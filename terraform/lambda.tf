# IAM role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "nextjs-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Public App Lambda function
resource "aws_lambda_function" "nextjs_public_app" {
  filename         = "bootstrap-lambda.zip"
  function_name    = "nextjs-public-app"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handler.handler"
  source_code_hash = filebase64sha256("bootstrap-lambda.zip")
  runtime          = "nodejs22.x"
  memory_size      = 1024
  timeout          = 30

  lifecycle {
    ignore_changes = [
      filename,
      source_code_hash,
    ]
  }

  environment {
    variables = {
      NODE_ENV                        = "production"
      CONTENTFUL_SPACE_ID             = var.contentful_space_id
      CONTENTFUL_ACCESS_TOKEN         = var.contentful_access_token
      CONTENTFUL_MANAGEMENT_TOKEN     = var.contentful_management_token
      CONTENTFUL_PREVIEW_ACCESS_TOKEN = var.contentful_preview_access_token
      CONTENTFUL_PREVIEW_SECRET       = var.contentful_preview_secret
      CONTENTFUL_WEBHOOK_SECRET       = var.contentful_webhook_secret
    }
  }
}