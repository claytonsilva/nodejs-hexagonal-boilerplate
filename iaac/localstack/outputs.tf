# this file is for output members

output "todo_queue_url" {
  value = "${aws_sqs_queue.todo_queue.id}"
}


output "dynamo_todo_id" {
  value = "${aws_dynamodb_table.todo_data.id}"
}
