import express from 'express'
import passport from 'passport'
import cookieSession from 'cookie-session'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.ts'
import friends from './routes/friends.ts'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cookieParser())
server.use(cookieSession({
  name: 'session',
  secret: 'keyboard cat',
}))

server.use(function(request, response, next) {
  if (request.session && !request.session.regenerate) {
      request.session.regenerate = (cb: () => void) => {
          cb()
      }
  }
  if (request.session && !request.session.save) {
      request.session.save = (cb: () => void) => {
          cb()
      }
  }
  next()
})

// server.use(passport.initialize())
server.use(passport.session())

server.use(authRoutes)
server.use(friends)

export default server
