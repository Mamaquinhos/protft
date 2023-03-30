resource "aws_ecs_task_definition" "ptft_ecs_task" {
  family                   = "${local.project_name}_task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  container_definitions = jsonencode([{
    name      = "${local.project_name}_container"
    image     = aws_ecr_repository.ptft_ecr.repository_url
    essential = true
    environment = [
      { name = "NODE_ENV", value = "production" },
      //{ name = "DATABASE_URL", value = var.db_url }, esses secrets abaixo podem ser gerados randômicos? se sim, talvez usar random tbm
      { name = "SIGNIN_KEY", value = var.signin_key },
      { name = "JWT_SECRET", value = var.jwt_secret },
      { name = "COOKIE_SECRET", value = var.cookie_secret }
    ]
    secrets = [
      {
        name      = "DB_HOST"
        valueFrom = aws_ssm_parameter.db_host.name
      },
      {
        name      = "DB_USER"
        valueFrom = aws_ssm_parameter.db_user.name
      },
      {
        name      = "DB_PASS"
        valueFrom = aws_ssm_parameter.db_pass.name
      }
    ]
    portMappings = [{
      protocol      = "tcp"
      containerPort = 3001
      hostPort      = 3001
    }]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = "awslogs-ptft-api",
        "awslogs-region"        = "us-east-1",
        "awslogs-stream-prefix" = "awslogs-ptft-api"
      }
    }
  }])
}
