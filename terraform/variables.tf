variable "contentful_space_id" {
  type = string
}

variable "contentful_access_token" {
  type      = string
  sensitive = true
}

variable "contentful_management_token" {
  type      = string
  sensitive = true
}
variable "contentful_preview_access_token" {
  type      = string
  sensitive = true
}

variable "contentful_preview_secret" {
  type      = string
  sensitive = true
}


variable "contentful_webhook_secret" {
  type      = string
  sensitive = true
}

# Datadog (Serverless / Lambda)
variable "dd_api_key" {
  type        = string
  sensitive   = true
  description = "Datadog API key value (no 'DD_API_KEY=' prefix). Set as a sensitive variable in HCP Terraform."
}

variable "dd_site" {
  type        = string
  description = "Datadog site, e.g. datadoghq.eu or datadoghq.com"
  default     = "datadoghq.eu"
}

variable "dd_env" {
  type        = string
  description = "Datadog environment tag (DD_ENV), e.g. production/staging"
  default     = "production"
}

variable "dd_service" {
  type        = string
  description = "Datadog service name (DD_SERVICE) for the Lambda"
  default     = "web-public"
}

variable "dd_version" {
  type        = string
  description = "Datadog version tag (DD_VERSION), often a git SHA or release version"
  default     = "1.0"
}

variable "dd_trace_enabled" {
  type        = bool
  description = "Enable Datadog tracing (DD_TRACE_ENABLED)"
  default     = true
}

variable "dd_serverless_logs_enabled" {
  type        = bool
  description = "Enable Datadog serverless logs (DD_SERVERLESS_LOGS_ENABLED)"
  default     = true
}

variable "dd_capture_lambda_payload" {
  type        = bool
  description = "Capture Lambda request/response payloads (DD_CAPTURE_LAMBDA_PAYLOAD). Keep false unless you really need it."
  default     = false
}

variable "dd_merge_xray_traces" {
  type        = bool
  description = "Merge AWS X-Ray traces (DD_MERGE_XRAY_TRACES)"
  default     = false
}

variable "dd_lambda_handler" {
  type        = string
  description = "Original Lambda handler (DD_LAMBDA_HANDLER). Used when Datadog wrapper handler is enabled."
  default     = "handler.handler"
}

variable "dd_extension_layer_arn" {
  type        = string
  description = "Datadog Lambda Extension layer ARN for the region."
  default     = "arn:aws:lambda:eu-central-1:464622532012:layer:Datadog-Extension:92"
}

variable "dd_additional_layer_arns" {
  type        = list(string)
  description = "Optional additional Datadog layer ARNs (e.g., runtime library layer) to attach alongside the extension."
  default     = []
}

variable "dd_tags" {
  type        = string
  description = "Optional comma-separated Datadog tags (DD_TAGS), e.g. 'app:public,repo:nextjs-openai-integration-demo'"
  default     = ""
}