import Na from 'libsodium-wrappers-sumo'
import express from 'express'
import passport from 'passport'

import LocalStrategy from 'passport-local'
import * as db from '../db/users.ts'

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const user = await db.oneByUsername(username)
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password' })
      }

      await Na.ready

      if (!Na.crypto_pwhash_str_verify(user.encrypted_password, password)) {
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

router.post(
  '/change-password',
  passport.authenticate('local'),
  async (req, res) => {
    if (!req.user) {
      res.sendStatus(401)
      return
    }

    const { newPassword } = req.body
    await Na.ready

    /* @ts-expect-error */
    const hashed_password = Na.crypto_pwhash(
      newPassword,
      Na.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      Na.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    )

    await db.changePassword(req.user.id, hashed_password)
    res.sendStatus(204)
  },
)

// TODO: POST /invitiation
// TODO: POST /accept?invitation=GUID

router.post('/logout', (req, res) => {
  req.logout()
  res.sendStatus(204)
})

router.get('/whoami', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  const { username, id } = req.user
  res.json({ username, id })
})

export default router
