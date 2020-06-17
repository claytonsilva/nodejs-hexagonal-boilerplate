provider "aws" {
  region = "${var.region}"

  endpoints {
    dynamodb   = "http://localhost:4566"
    s3         = "http://localhost:4566"
    sqs        = "http://localhost:4566"
    lambda     = "http://localhost:4566"
    apigateway = "http://localhost:4566"

    # sts for full experience without valid real profile on aws
    sts = "http://localhost:4566"
  }

  version = "~> 2.62"

  profile = "localstack"
}
