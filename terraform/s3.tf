# Create an S3 bucket
resource "aws_s3_bucket" "nextjs_static" {
  bucket = "nextjs-ai-platform-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name        = "Next.js AI Platform Static Site"
    Environment = "dev"
    ManagedBy   = "Terraform"
  }
}

# Enable static website hosting
resource "aws_s3_bucket_website_configuration" "nextjs_site" {
  bucket = aws_s3_bucket.nextjs_static.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# Allow public read access
resource "aws_s3_bucket_public_access_block" "nextjs_public" {
  bucket = aws_s3_bucket.nextjs_static.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Bucket policy for public read
resource "aws_s3_bucket_policy" "nextjs_policy" {
  bucket = aws_s3_bucket.nextjs_static.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.nextjs_static.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.nextjs_public]
}