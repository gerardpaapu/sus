import * as crypto from 'node:crypto'

export async function seed(knex) {
  const salt = crypto.randomBytes(16)
  const pw = process.env.ADMIN_PW || 'letmein'
  const encrypted_password = crypto.pbkdf2Sync(pw, salt, 310000, 32, 'sha256')

  await knex('users').del()
  await knex('users').insert({
    username: 'admin',
    salt,
    encrypted_password,
  })
}
