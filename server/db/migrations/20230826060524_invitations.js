/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('invitation', (t) => {
    t.uuid('id').primary()
    t.integer('owner').references('users.id').onDelete('CASCADE')
    t.date('created')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTable('invitation')
}
