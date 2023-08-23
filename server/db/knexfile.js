// Update with your config settings.
import * as URL from 'node:url'
import * as Path from 'node:path/posix'

const __filename = URL.fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: Path.resolve(__dirname, './dev.sqlite3'),
    },
  },
}
