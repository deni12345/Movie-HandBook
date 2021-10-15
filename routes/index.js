const express = require('express')
const router = express.Router()
const Movie = require('../models/movie')
const { authenticateToken } = require('../middleware/authenMiddleware')

router.get('/', authenticateToken, async(req, res) => {
    let movies
    try {
        movies = await Movie.find().sort({ createDate: 'desc' }).limit(10).exec()
    } catch (error) {
        movies = []
    }

    res.render('index', {
        movies: movies
    })
})
module.exports = router