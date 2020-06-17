resource "aws_dynamodb_table" "todo_data" {
  name           = "${local.dynamodb_table_name_todo}"
  read_capacity  = 5
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_sqs_queue" "todo_queue" {
  name                      = "todo-queue"
  delay_seconds             = 90
  max_message_size          = 8192
  message_retention_seconds = 3600
  receive_wait_time_seconds = 10
}
