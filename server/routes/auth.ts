import * as crypto from 'node:crypto'
import * as util from 'node:util'
import express from "express"
import passport from "passport"

import * as db from '../db/users.ts' 
import LocalStrategy from 'passport-local'

const pbkdf2 = util.promisify(crypto.pbkdf2) 

// @ts-expect-error
passport.use(new LocalStrategy(async (username: string, password: string, cb: (err: Error | null, user?: Object | false, options?: object) => void) => {
    try {
        const user = await db.oneByEmail(username)
        console.log(user)
        if (!user) {
            return cb(null, false, { message: 'Incorrect username or password' })
        }

        const hashed_password = await pbkdf2(password, user.salt, 310000, 32, 'sha256')
        if (!crypto.timingSafeEqual(hashed_password, user.encrypted_password)) {
            return cb(null, false, { message: 'Incorrect username or password' })
        }

        return cb(null, user)
    } catch (err) {
        return cb(err as Error)
    }
}))


passport.serializeUser((user: any, cb) => {
    console.log('serialize', user)
    process.nextTick(() => {
        cb(null, { username: user.email })
    })
})

passport.deserializeUser((user: any, cb) => {
    console.log('deserializeUser', user)
    process.nextTick(() => {
        cb(null, user)
    })
})

const router = express.Router()

router.post('/login', 
    passport.authenticate('local'), (req, res, next) => {
      res.sendStatus(204)
    })

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        res.sendStatus(204)
    })
})



export default router
