resource "aws_acm_certificate" "site" {
  provider          = aws.use1
  domain_name       = "www.nextjs-ai-platform.site"
  validation_method = "DNS"

  subject_alternative_names = [
    "nextjs-ai-platform.site",
  ]

  lifecycle {
    create_before_destroy = true
  }
}