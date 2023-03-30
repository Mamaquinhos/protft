resource "random_password" "db_pass" {
  length  = 16
  special = true
}

resource "random_string" "db_user" {
  length  = 16
  special = false
}

resource "aws_db_subnet_group" "ptft_db_subnet_group" {
  name       = "${local.project_name}-db-subnet-group"
  subnet_ids = [aws_subnet.ptft_public_subnet_az1.id, aws_subnet.ptft_public_subnet_az2.id]
}

resource "aws_db_instance" "ptft_db" {
  allocated_storage       = 20
  backup_retention_period = 7
  db_name                 = "ptft"
  db_subnet_group_name    = aws_db_subnet_group.ptft_db_subnet_group.name
  engine                  = "postgres"
  engine_version          = "12"
  instance_class          = "db.t2.micro"
  max_allocated_storage   = 0
  username                = random_string.db_user.result
  password                = random_password.db_pass.result
  publicly_accessible     = true
  skip_final_snapshot     = true
  vpc_security_group_ids  = [aws_security_group.ptft_rds_sec_group.id]
}

### SSM Parameters - DB Related

resource "aws_ssm_parameter" "db_pass" {
  name        = "/${local.project_name}/db/password"
  description = "Database Password"
  type        = "SecureString"
  value       = random_password.db_pass.result
}

resource "aws_ssm_parameter" "db_host" {
  name        = "/${local.project_name}/db/host"
  description = "Database endpoint - Format = endpoint:port"
  type        = "SecureString"
  value       = aws_db_instance.ptft_db.endpoint
}

resource "aws_ssm_parameter" "db_user" {
  name        = "/${local.project_name}/db/user"
  description = "Database user"
  type        = "SecureString"
  value       = random_string.db_user.result
}
