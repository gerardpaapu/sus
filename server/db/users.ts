import connection from './connection'

export async function oneByUsername(username: string) {
  return connection('users').select('*').where({ username }).first()
}

// export async function oneById(id: number) {
//   return connection('users').select('*').where({ id }).first()
// }

interface UserDescription {
  id: number;
  username: string;
  roles: Array<string>
}

export async function oneById(id: number): Promise<UserDescription | undefined> {
  const rows = await connection('users')
    .leftJoin('has_role', 'has_role.user', 'users.id')
    .leftJoin('roles', 'has_role.role', 'roles.id')
    .where('users.id', id)
    .select('users.id as id', 'users.username', 'roles.name as role')

  if (rows.length === 0) {
    return undefined
  }

  const result = { id: rows[0].id, username: rows[0].username, roles: [] as Array<string> }
  for (const row of rows) {
    if (row.role != null) {
      result.roles.push(row.role)
    }
  }

  return result
}

export async function changePassword(id: number, hashed_password: string) {
  return connection('users').update({ hashed_password }).where({ id })
}
