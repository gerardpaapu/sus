import Na from 'libsodium-wrappers-sumo'

export async function seed(knex) {
  await Na.ready
  const pw = process.env.ADMIN_PW || 'letmein'
  const encrypted_password = Na.crypto_pwhash_str(
    pw,
    Na.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    Na.crypto_pwhash_MEMLIMIT_INTERACTIVE,
  )

  await knex('users').del()
  const [user] = await knex('users').insert({
    username: 'admin',
    encrypted_password,
  })
  const [role] = await knex('roles').insert({ name: 'admin' })
  await knex('has_role').insert({ user, role })
}
