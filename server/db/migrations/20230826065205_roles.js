/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('roles', (t) => {
    t.integer('id').primary()
    t.string('name').unique()
  })

  await knex.schema.createTable('has_role', (t) => {
    t.integer('id').primary()
    t.integer('user').references('users.id').onDelete('CASCADE')
    t.integer('role').references('roles.id').onDelete('CASCADE')
    t.unique(['user', 'role'])
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('has_role')
  await knex.schema.dropTable('roles')
}
