# CloudFront Origin Access Control (for S3)
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "nextjs-s3-oac"
  description                       = "OAC for Next.js S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "nextjs_cdn" {
  enabled = true

  # Origin 1: S3 for static assets
  origin {
    domain_name              = aws_s3_bucket.nextjs_static.bucket_regional_domain_name
    origin_id                = "S3-nextjs"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  # Origin 2: API Gateway for Lambda
  origin {
    domain_name = "${aws_apigatewayv2_api.lambda_api.id}.execute-api.eu-central-1.amazonaws.com"
    origin_id   = "APIGateway-nextjs"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Behavior: Next static assets from S3 (narrowed to avoid breaking SSR)
  ordered_cache_behavior {
    path_pattern     = "/_next/static/*"
    target_origin_id = "S3-nextjs"

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000
  }

  # Behavior: public assets [favicons, logo, etc]
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    target_origin_id = "S3-nextjs"

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = 86400    # Cache for 1 day
    max_ttl     = 31536000 # Max 1 year
  }

  # Behavior: API routes to Lambda
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    target_origin_id = "APIGateway-nextjs"

    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Content-Type"]

      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # Default behavior: Route to Lambda (SSR pages)
  default_cache_behavior {
    target_origin_id       = "APIGateway-nextjs"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true

      headers = [
        "accept",
        "accept-language",
        "content-type",
        "origin",
        "access-control-request-headers",
        "access-control-request-method",
        "rsc",
        "next-router-prefetch",
        "next-router-state-tree",
        "next-router-segment-prefetch",
        "next-url",
      ]

      cookies {
        forward = "all"
      }
    }

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = ["www.nextjs-ai-platform.site", "nextjs-ai-platform.site"]


  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.site.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}