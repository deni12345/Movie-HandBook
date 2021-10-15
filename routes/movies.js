const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const Studio = require("../models/studio");
const imageType = ["image/jpeg", "image/png", "image/gif"];

//get all movie' s information
router.get("/", async(req, res) => {
    let findingObj = {};
    findingObj.user = req.user._id
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

//get view to insert new movie
router.get("/new", async(req, res) => {
    renderNewMoviePage(req, res, new Movie(), "./movies/new_movie", null);
});

//create new movie
router.post("/", async(req, res) => {
    const movie = new Movie({
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        publishDate: new Date(req.body.publishDate),
        actors: req.body.actors.split("-"),
        studio: req.body.studio,
        user: req.user._id
    });

    try {
        saveImg(movie, req.body.coverImg, req.body.posterImg);
        await movie.save();
        res.status(201).redirect("/movie");
    } catch (error) {
        renderNewMoviePage(res, movie, "./movies/new_movie", error);
    }
});

//get detail vie of a movie
router.get("/:id", async(req, res) => {
    try {
        const movie = await Movie.findOne({ _id: req.params.id, user: req.user._id });
        const studio = await Studio.findById(movie.studio);
        res.render("./movies/display_movie", {
            movie: movie,
            studio: studio,
        });
    } catch (error) {
        res.redirect("/movie");
    }
});

//get edit movie view
router.get("/:id/edit", async(req, res) => {
    try {
        const movie = await Movie.findOne({ _id: req.params.id, user: req.user._id });
        const studio = await Studio.find({ user: req.user._id });
        res.render("./movies/edit_movie", {
            movie: movie,
            studios: studio,
        });
    } catch (error) {
        res.redirect(`/movie/${req.params.id}`);
    }
});

//update a specific movie
router.put("/:id", async(req, res) => {
    let movie;
    try {
        movie = await Movie.findById(req.params.id);
        movie.title = req.body.title.trim() != '' ? req.body.title : movie.title;
        movie.description = req.body.description.trim() != '' ? req.body.description : movie.description;
        movie.publishDate = req.body.publishDate.trim() != '' ? new Date(req.body.publishDate) : movie.publishDate;
        movie.actors = req.body.actors.trim() != '' ? req.body.actors.split('-') : movie.actors;
        movie.studio = req.body.studio.trim() != '' ? req.body.studio : movie.studio;
        movie.user = req.user._id;
        saveImg(movie, req.body.coverImg, req.body.posterImg)

        await movie.save();
        res.redirect(`/movie/${req.params.id}`);
    } catch (error) {
        if (movie) {
            renderNewMoviePage(req, res, movie, "./movies/edit_movie", error);
        } else {
            res.redirect('/movie')
        }
    }
});

//delete a specific movie
router.delete("/:id", async(req, res) => {
    let movie
    try {
        movie = await Movie.findOne({ _id: req.params.id, user: req.user._id })
        await movie.remove()
        res.redirect('./movie')
    } catch (error) {
        if (movie) {
            renderNewMoviePage(req, res, movie, `./movie/${movie.id}`, error)
        } else {
            res.redirect('/movie')
        }
    }
});

async function renderNewMoviePage(req, res, movie, path, error) {
    try {
        const studios = await Studio.find({ user: req.user._id });
        const params = {
            movie: movie,
            studios: studios,
        };
        if (error) {
            params.err = error.message;
        }
        res.status(400).render(path, params);
    } catch (error) {
        res.redirect("/movie");
    }
}

function saveImg(movie, coverEncoded, posterEncoded) {
    try {
        if (coverEncoded != '') {
            let cover = JSON.parse(coverEncoded);
            if (cover != null && imageType.includes(cover.type)) {
                movie.coverImg = new Buffer.from(cover.data, "base64");
                movie.coverImgType = cover.type;
            }
        } else if (movie.coverImg) {
            movie.coverImg = movie.coverImg
        } else {
            throw new Error('Please add a cover image')
        }

        if (posterEncoded != '') {
            let poster = JSON.parse(posterEncoded);
            if (poster != null && imageType.includes(poster.type)) {
                movie.posterImg = new Buffer.from(poster.data, "base64");
                movie.posterImgType = poster.type;
            }
        } else if (movie.posterImg) {
            movie.posterImg = movie.posterImg
        } else {
            throw new Error('Please add a poster image')
        }
    } catch (error) {
        console.log(error.message)
        throw error;
    }
}

module.exports = router;