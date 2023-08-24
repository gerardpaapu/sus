import express from 'express'
import passport from 'passport'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import authRoutes from './routes/auth.ts'
import friends from './routes/friends.ts'

let { COOKIE_SECRET, NODE_ENV } = process.env
NODE_ENV = NODE_ENV || 'development'
if (!COOKIE_SECRET) {
  throw new Error(`Environment variable missing: COOKIE_SECRET`)
}

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cookieParser())
server.use(
  cookieSession({
    name: 'session',
    secret: COOKIE_SECRET,

    // cookie options
    sameSite: 'lax', // https://web.dev/samesite-cookies-explained/
    secure: NODE_ENV === 'production', // require https in production
    httpOnly: true, // this is the default anyway
    maxAge: 24 * 60 * 60 * 1000, // valid for one day
  }),
)

server.use(passport.session())

server.use('/api/v1', authRoutes)
server.use('/api/v1', friends)

export default server
