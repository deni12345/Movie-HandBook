const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const { authenticateToken } = require("../middleware/authenMiddleware");

router.get("/", authenticateToken, async(req, res) => {
    let movies;
    let randomMovies;
    try {
        movies = await Movie.find().sort({ createDate: "desc" }).limit(10).exec();
        let total = await Movie.count();
        let randomNum = Math.floor(Math.random() * (total + 1));
        randomMovies = await Movie.find().skip(randomNum).limit(10);
    } catch (error) {
        movies = [];
        randomMovies = [];
    }

    res.render("index", {
        movies: movies,
        randomMovies: randomMovies,
    });
});
module.exports = router;