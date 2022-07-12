resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins     = local.cors_configuration.allow_origins
    allow_methods     = local.cors_configuration.allow_methods
    allow_headers     = local.cors_configuration.allow_headers
    expose_headers    = local.cors_configuration.expose_headers
    allow_credentials = local.cors_configuration.allow_credentials
    max_age           = local.cors_configuration.max_age
  }
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = local.environment_name
  auto_deploy = true
}

output "base_url" {
  description = "Base URL for API Gateway stage."

  value = aws_apigatewayv2_stage.lambda.invoke_url
}
