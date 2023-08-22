import express from 'express'

const router = express.Router()

router.get('/friends', (req, res, next) => {
    console.log(req.session)
    if (!req.user) {
        return res.sendStatus(401)
    }

    return res.json({ weArFriends: true, ...req.user })
})


export default router
