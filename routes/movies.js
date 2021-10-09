const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Studio = require("../models/studio");
const path = require("path");
const { title } = require("process");;
const imageType = ["image/jpeg", "image/png", "image/gif"];

//get all movie' s information
router.get("/", async(req, res) => {
    let findingObj = {};
    if (req.query.title) {
        findingObj.title = new RegExp(req.query.title.trim(), "i");
    }
    if (req.query.publishDate) {
        findingObj.publishDate = { $lte: req.query.publishDate };
    }

    try {
        const movies = await Movie.find(findingObj);
        res.render("./movies/index", {
            searchOptions: {
                title: req.query.title,
                publishDate: req.query.publishDate,
            },
            movies: movies,
        });
    } catch (error) {
        res.status(400).json({
            err: error.message,
        });
    }
});

//delete a sudio
router.delete("/", (req, res) => {});

//get view to insert new movie
router.get("/new", async(req, res) => {
    renderNewMoviePage(res, new Movie());
});

//create new movie
router.post("/", async(req, res) => {
    const movie = new Movie({
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        publishDate: new Date(req.body.publishDate),
        actors: req.body.actors.split("-"),
        studio: req.body.studio,
    });

    try {
        saveImg(movie, req.body.coverImg, req.body.posterImg)
        await movie.save();
        res.status(201).redirect("/movie");
    } catch (error) {
        renderNewMoviePage(res, movie, true);
    }
});


async function renderNewMoviePage(res, movie, hasError = false) {
    try {
        const studios = await Studio.find();
        const params = {
            movie: movie,
            studios: studios,
        };
        if (hasError) {
            params.err = "Something wrong happened";
        }
        res.status(400).render("./movies/new_movie", params);
    } catch (error) {
        res.redirect("/movie");
    }
}

function saveImg(movie, coverEncoded, posterEncoded) {
    try {
        let cover = JSON.parse(coverEncoded)
        let poster = JSON.parse(posterEncoded)

        if (cover != null && imageType.includes(cover.type)) {
            movie.coverImg = new Buffer.from(cover.data, 'base64')
            movie.coverImgType = poster.type
        }
        if (poster != null && imageType.includes(poster.type)) {
            movie.posterImg = new Buffer.from(poster.data, 'base64')
            movie.posterImgType = poster.type
        }
    } catch (error) {
        throw (error)
    }

}

module.exports = router;