resource "aws_lambda_function" "todo" {
  function_name = "todo_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/todo.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 10                                             #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}
