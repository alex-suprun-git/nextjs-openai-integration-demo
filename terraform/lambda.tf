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
  filename         = "lambda-nextjs-public.zip"
  function_name    = "nextjs-public-app"
  role             = aws_iam_role.lambda_role.arn
  handler          = "handler.handler"
  source_code_hash = filebase64sha256("lambda-nextjs-public.zip")
  runtime          = "nodejs20.x"
  memory_size      = 1024
  timeout          = 30

  environment {
    variables = {
      NODE_ENV = "production"
    }
  }
}