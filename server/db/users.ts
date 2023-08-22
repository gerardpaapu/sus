import connection from "./connection";

export async function oneByEmail(email: string) {
    return connection('users')
        .select('*')
        .where({ email })
        .first()
}
