terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"

  backend "s3" {
    bucket               = "YOUR-BUCKET-NAME-HERE" # TODO - change this
    key                  = "PROJECT-NAME" # TODO - change this
    workspace_key_prefix = "environments"
    region               = "us-east-1"
    profile              = "YOUR-PROFILE-HERE" # TODO - change this
  }
}

provider "aws" {
  profile = "YOUR-PROFILE-HERE" # TODO - change this
  region  = "us-east-1"
}


resource "aws_s3_bucket" "s3_lambda_source_code_bucket" {
  bucket = "${local.project_prefix}-${local.environment_name}-lambda-source-code"
  acl    = "private"
  versioning {
    enabled = true
  }

  lifecycle {
    # Comment this if you want to destroy the bucket holding the code
    prevent_destroy = true
  }
}
