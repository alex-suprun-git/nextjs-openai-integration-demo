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

# Test Lambda function
resource "aws_lambda_function" "test_api" {
  filename         = "lambda-test.zip"
  function_name    = "nextjs-test-api"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("lambda-test.zip")
  runtime         = "nodejs20.x"
  timeout         = 30

  environment {
    variables = {
      NODE_ENV = "production"
    }
  }
}