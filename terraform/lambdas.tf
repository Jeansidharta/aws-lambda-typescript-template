# User
module "lambda_users_login" {
  source = "./modules/default-lambda"

  method              = "POST"
  path                = "/users/login"
  handler_filename    = "users"
  handler_entry_point = "login"

  environment_variables = {
    JWT_SECRET = local.JWT_SECRET
    DYNAMODB_USERS_TABLE = local.table_users_name
  }

  project_prefix            = local.project_prefix
  environment_name          = local.environment_name
  api_gateway_id            = aws_apigatewayv2_api.lambda.id
  api_gateway_execution_arn = aws_apigatewayv2_api.lambda.execution_arn
  code_bucket               = aws_s3_bucket.s3_lambda_source_code_bucket.bucket
}

module "lambda_users_signup" {
  source = "./modules/default-lambda"

  method              = "POST"
  path                = "/users/signup"
  handler_filename    = "users"
  handler_entry_point = "signup"

  environment_variables = {
    JWT_SECRET = local.JWT_SECRET
    DYNAMODB_USERS_TABLE = local.table_users_name
  }

  project_prefix            = local.project_prefix
  environment_name          = local.environment_name
  api_gateway_id            = aws_apigatewayv2_api.lambda.id
  api_gateway_execution_arn = aws_apigatewayv2_api.lambda.execution_arn
  code_bucket               = aws_s3_bucket.s3_lambda_source_code_bucket.bucket
}