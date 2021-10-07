const express = require("express");
const router = express.Router();
const multer = require("multer");
const Movie = require("../models/movie");
const Studio = require("../models/studio");
const path = require("path");
const fs = require('fs');
const { title } = require("process");
const uploadPath = path.resolve("public", Movie.coverImgBasePath);
const mimeType = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, mimeType.includes(file.mimetype));
    },
});

//get all movie' s information
router.get("/", async(req, res) => {
    let findingObj = {}
    if (req.query.title) {
        findingObj.title = new RegExp(req.query.title.trim(), 'i')
    }
    if (req.query.publishDate) {
        findingObj.publishDate = { $lte: req.query.publishDate }
    }

    try {
        const movies = await Movie.find(findingObj)
        res.render("./movies/index", {
            searchOptions: {
                title: req.query.title,
                publishDate: req.query.publishDate
            },
            movies: movies
        });
    } catch (error) {
        res.status(400).json({
            err: error.message
        })
    }

});

//delete a sudio
router.delete("/", (req, res) => {});

//get view to insert new movie
router.get("/new", async(req, res) => {
    renderNewMoviePage(res, new Movie())
});

//create new movie
router.post(
    "/",
    upload.fields([
        { name: "coverImg", maxCount: 1 },
        { name: "posterImg", maxCount: 1 },
    ]),
    async(req, res) => {
        const coverImg = req.files.coverImg != null ? req.files.coverImg[0].filename : null;
        const posterImg = req.files.posterImg != null ? req.files.posterImg[0].filename : null;
        const movie = new Movie({
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            publishDate: new Date(req.body.publishDate),
            actors: req.body.actors.split("-"),
            coverImg: coverImg,
            posterImg: posterImg,
            studio: req.body.studio,
        });
        try {
            await movie.save();
            res.status(201).redirect("/movie");
        } catch (error) {
            if (req.files.coverImg) {
                removeImgFile(movie.coverImg, movie.posterImg)
            }
            renderNewMoviePage(res, movie, true)
        }
    }
);

async function renderNewMoviePage(res, movie, hasError = false) {
    try {
        const studios = await Studio.find();
        const params = {
            movie: movie,
            studios: studios,
        }
        if (hasError) {
            params.err = "Something wrong happened"
        }
        res.render("./movies/new_movie", params);
    } catch (error) {
        res.redirect("/movie");
    }
}

function removeImgFile(coverImg, posterImg) {
    fs.unlink(path.join(uploadPath, coverImg), (err) => console.error(err))
    fs.unlink(path.join(uploadPath, posterImg), (err) => console.error(err))
}

module.exports = router;