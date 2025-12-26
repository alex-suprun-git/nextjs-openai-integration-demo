#!/bin/bash
set -euo pipefail

echo "🚀 Deploying Next.js Lambda (wrapper)"
echo "====================================="

TERRAFORM_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$TERRAFORM_DIR/.." && pwd)"

DO_APPLY=false

for arg in "$@"; do
  case "$arg" in
    --apply) DO_APPLY=true ;;
    *)
      echo "Unknown arg: $arg"
      echo "Usage: ./deploy-lambda.sh [--apply]"
      exit 1
      ;;
  esac
done

echo "0️⃣ Building Next.js (apps/public)..."
(cd "$PROJECT_ROOT" && yarn workspace public build)

echo ""
echo "0️⃣ Uploading static assets to S3 (for CloudFront)..."
BUCKET_NAME="$(cd "$TERRAFORM_DIR" && terraform output -raw bucket_name)"

# Next build assets (CloudFront routes /_next/static/* to S3)
aws s3 sync \
  "$PROJECT_ROOT/apps/public/.next/static" \
  "s3://${BUCKET_NAME}/_next/static" \
  --delete \
  --exclude "*.map" \
  --cache-control "public,max-age=31536000,immutable"

echo "1️⃣ Building Lambda package..."
"$TERRAFORM_DIR/build-lambda.sh"

if [ "$DO_APPLY" = true ]; then
  echo ""
  echo "2️⃣ Applying Terraform..."
  (cd "$TERRAFORM_DIR" && terraform apply -auto-approve)

  echo ""
  echo "3️⃣ Invalidating CloudFront cache..."
  # Prefer Terraform output (most reliable). Fallback to lookup by domain if output isn't available yet.
  DIST_ID="$(cd "$TERRAFORM_DIR" && terraform output -raw cloudfront_distribution_id 2>/dev/null || true)"
  if [ -z "$DIST_ID" ]; then
    DOMAIN="$(cd "$TERRAFORM_DIR" && terraform output -raw cloudfront_domain)"
    DIST_ID="$(aws cloudfront list-distributions --query "DistributionList.Items[?DomainName=='${DOMAIN}'].Id | [0]" --output text)"
  fi

  if [ -z "$DIST_ID" ] || [ "$DIST_ID" = "None" ]; then
    echo "❌ Could not determine CloudFront distribution ID for invalidation."
    exit 1
  fi

  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" >/dev/null
  echo "✅ Invalidation requested for /* (can take ~1-5 minutes to fully propagate)"
else
  echo ""
  echo "✅ Build done."
fi

