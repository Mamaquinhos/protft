data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      identifiers = ["ecs-tasks.amazonaws.com"]
      type        = ["Service"]
    }
  }
}

data "aws_iam_policy_document" "task_policy_document" {
  statement {
    actions   = ["ssm:Get*"]
    effect    = ["Allow"]
    resources = ["arn:aws:ssm:us-east-2:${local.account_id}:parameter/${local.project_name}*"]
  }
  statement {
    actions   = ["ssm:DescribeParameters"]
    effect    = ["Allow"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "task_policy" {
  policy = data.aws_iam_policy_document.task_policy_document.json
  name   = "${local.project_name}-ecs-task-policy"
}

resource "aws_iam_role" "ecs_task_role" {
  name               = "${local.project_name}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "attach_task_policy" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.task_policy.arn
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "${local.project_name}-ecs-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# resource "aws_iam_policy" "dynamodb" {
#   name        = "${var.name}-task-policy-dynamodb-${var.environment}"
#   description = "Policy that allows access to DynamoDB"

#   policy = <<EOF
# {
#     "Version": "2012-10-17",
#     "Statement": [
#         {
#             "Effect": "Allow",
#             "Action": [
#                 "dynamodb:CreateTable",
#                 "dynamodb:UpdateTimeToLive",
#                 "dynamodb:PutItem",
#                 "dynamodb:DescribeTable",
#                 "dynamodb:ListTables",
#                 "dynamodb:DeleteItem",
#                 "dynamodb:GetItem",
#                 "dynamodb:Scan",
#                 "dynamodb:Query",
#                 "dynamodb:UpdateItem",
#                 "dynamodb:UpdateTable"
#             ],
#             "Resource": "*"
#         }
#     ]
# }
# EOF
# }

# resource "aws_iam_role_policy_attachment" "ecs-task-role-policy-attachment" {
#   role       = aws_iam_role.ecs_task_role.name
#   policy_arn = aws_iam_policy.dynamodb.arn
# }