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