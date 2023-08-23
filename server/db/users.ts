import connection from './connection'

export async function oneByUsername(username: string) {
  return connection('users').select('*').where({ username }).first()
}

export async function oneById(id: number) {
  return connection('users').select('*').where({ id }).first()
}
