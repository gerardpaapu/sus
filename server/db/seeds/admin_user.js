import * as crypto from 'node:crypto'


export async function seed(knex) {
  const salt = crypto.randomBytes(16)
  const encrypted_password = crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256')

  await knex('users').del()
  await knex('users').insert({
    email: 'gerard@gerardpaapu.com',
    salt,
    encrypted_password
  });
}
