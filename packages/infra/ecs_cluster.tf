resource "aws_ecs_cluster" "ptft_ecs_cluster" {
  name = "${local.project_name}-cluster"
}
