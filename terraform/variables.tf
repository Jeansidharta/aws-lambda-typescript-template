locals {
  # TODO - add real name
  project_prefix   = "YOUR-PROJECT-NAME"
  environment_name = local.workspace_vars.environment_name

  JWT_SECRET    = sensitive(local.workspace_vars.JWT_SECRET)

  workspace_vars = jsondecode(file("./env/${terraform.workspace}.json"))
}

locals {
  table_users_name = "${local.project_prefix}-${local.environment_name}-users"
}

locals {
  cors_configuration = {
      # TODO - add real URL
      allow_origins     = ["https://your-url-here.com", "http://localhost:3000"]
      allow_methods     = ["GET", "POST", "OPTIONS"]
      allow_headers     = ["Content-Type", "Authorization"]
      expose_headers    = ["Authorization"]
      allow_credentials = true
      max_age           = 300
    }
}
