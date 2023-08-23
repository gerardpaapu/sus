import * as crypto from 'node:crypto'
import * as util from 'node:util'
import express from 'express'
import passport from 'passport'

import LocalStrategy from 'passport-local'
import * as db from '../db/users.ts'

const pbkdf2 = util.promisify(crypto.pbkdf2)

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await db.oneByUsername(username)
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password' })
      }

      // TODO: move all these numbers to a module?
      const hashed_password = await pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
      )
      if (!crypto.timingSafeEqual(hashed_password, user.encrypted_password)) {
        return cb(null, false, { message: 'Incorrect username or password' })
      }

      return cb(null, user)
    } catch (err) {
      cb(err as Error)
    }
  }),
)

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    const { username, id } = user
    cb(null, { username, id })
  })
})

passport.deserializeUser(async (user: any, cb) => {
  process.nextTick(() => {
    const { username, id } = user
    cb(null, { username, id })
  })
})

const router = express.Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ username: req.user?.username })
})

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }

    res.sendStatus(204)
  })
})

router.get('/whoami', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const { username, id } = req.user
  res.json({ username, id })
})

export default router
