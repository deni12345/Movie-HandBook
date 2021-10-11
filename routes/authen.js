const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

//get account info
router.get('/login', (req, res) => {
    res.render('./user/login', { layout: false })
})


router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (user) {
            const check = await bcrypt.compare(req.body.password, user.password)
            if (check) {
                return res.redirect('/')
            } else {
                throw new Error('invalid password')
            }
        }
    } catch (error) {
        res.send(error.message)
    }
})

//sign up account
router.post('/signup', async(req, res) => {
    try {
        const user = new User()
        if (!(req.body.name && req.body.password && req.body.email)) {
            return res.send("Some thing is not right here")
        } else {

            user.name = req.body.name
            user.email = req.body.email
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
            user.save()
            return res.redirect('/user/login')
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = router