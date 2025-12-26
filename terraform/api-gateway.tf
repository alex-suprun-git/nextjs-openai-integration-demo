# HTTP API Gateway (simpler than REST API)
resource "aws_apigatewayv2_api" "lambda_api" {
  name          = "nextjs-lambda-api"
  protocol_type = "HTTP"
}

# Lambda integration
resource "aws_apigatewayv2_integration" "lambda" {
  api_id           = aws_apigatewayv2_api.lambda_api.id
  integration_type = "AWS_PROXY"

  integration_uri        = aws_lambda_function.nextjs_public_app.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# Route: Catch all routes
resource "aws_apigatewayv2_route" "lambda_default" {
  api_id    = aws_apigatewayv2_api.lambda_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# Stage (like environment)
resource "aws_apigatewayv2_stage" "lambda_stage" {
  api_id      = aws_apigatewayv2_api.lambda_api.id
  name        = "$default"
  auto_deploy = true
}

# Permission for API Gateway to invoke Lambda
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.nextjs_public_app.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.lambda_api.execution_arn}/*/*"
}