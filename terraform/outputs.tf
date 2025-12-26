output "bucket_name" {
  value       = aws_s3_bucket.nextjs_static.id
  description = "The name of the S3 bucket"
}

output "bucket_arn" {
  value       = aws_s3_bucket.nextjs_static.arn
  description = "The ARN of the S3 bucket"
}

output "cloudfront_domain" {
  value       = aws_cloudfront_distribution.nextjs_cdn.domain_name
  description = "CloudFront distribution domain name"
}

output "cloudfront_distribution_id" {
  value       = aws_cloudfront_distribution.nextjs_cdn.id
  description = "CloudFront distribution ID (for invalidations)"
}

output "cloudfront_url" {
  value       = "https://${aws_cloudfront_distribution.nextjs_cdn.domain_name}"
  description = "CloudFront URL"
}

output "api_gateway_url" {
  value       = aws_apigatewayv2_stage.lambda_stage.invoke_url
  description = "API Gateway URL"
}