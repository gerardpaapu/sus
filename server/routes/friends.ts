import express from 'express'

const router = express.Router()

router.get('/friends', (req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401)
  }

  res.json({ weAreFriends: true, username: req.user.username })
})

export default router
