# Tables
module "table_users" {
  source = "./modules/default-table"

  table_name = local.table_users_name
  hash_key   = "email"
}
