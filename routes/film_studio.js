const express = require('express')
const router = express.Router()

//get all film studios' s information
router.get('/', (req, res) => {
    res.render('index')
})



module.exports = router