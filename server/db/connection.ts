import knexfile from './knexfile.js'
import knex from 'knex'

type Environment = 'development'
const env: Environment = 'development'

const connection = knex(knexfile[env])
export default connection
