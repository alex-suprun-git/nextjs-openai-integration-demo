#!/bin/bash
set -euo pipefail

echo "🚀 Deploying Next.js Lambda (wrapper)"
echo "====================================="

TERRAFORM_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "1️⃣ Building Lambda package..."
"$TERRAFORM_DIR/build-lambda.sh"

if [ "${1:-}" = "--apply" ]; then
  echo ""
  echo "2️⃣ Applying Terraform..."
  (cd "$TERRAFORM_DIR" && terraform apply -auto-approve)
else
  echo ""
  echo "✅ Build done."
  echo "Next: cd terraform && terraform apply"
  echo "Or run: ./deploy-lambda.sh --apply"
fi

