# Configure Terraform to use AWS provider
terraform {
  required_version = ">= 1.0"

  cloud {
    organization = "IDK-io"
    workspaces {
      name = "nextjs-openai-integration-demo"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Configure AWS Provider
provider "aws" {
  region = "eu-central-1"
}

# Get current AWS account ID (for unique bucket name)
data "aws_caller_identity" "current" {}