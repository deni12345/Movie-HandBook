const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//get account info
router.get('/login', (req, res) => {
    renderLoginPage(res, 'login-form', './user/login')
})

//get logout
router.get('/logout', (req, res) => {
    res.cookie('token', '', { maxAge: 1 })
    res.redirect('/')
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({ name: req.body.name })
        if (user) {
            const check = await bcrypt.compare(req.body.password, user.password)
            if (check) {
                const accessToken = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }, process.env.ACCESS_TOKEN_KEY)

                res.cookie('token', accessToken, { httpOnly: true, secure: true })
                return res.redirect('/')
            } else {
                throw new Error('invalid password')
            }
        } else {
            throw new Error('invalid account')
        }
    } catch (error) {
        renderLoginPage(res, 'login-form', './user/login', error)
    }
})

//sign up account
router.post('/signup', async(req, res) => {
    try {
        const user = new User()
        if (!(req.body.name && req.body.password && req.body.email)) {
            throw new Error("Some thing is not right here")
        } else {
            user.name = req.body.name
            user.email = req.body.email
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(req.body.password, salt)
            user.save()
            return res.redirect('/user/login')
        }
    } catch (error) {
        renderLoginPage(res, 'register-form', './user/login', error)
    }
})

function renderLoginPage(res, formName, path, error = null) {
    let formObj = {
        formActive: formName,
        layout: false
    }
    if (error) {
        formObj.err = error.message;
    }
    res.render(path, formObj)
}


module.exports = router