const express = require('express');
const router = express.Router();
const Movie = require('../models/movie')
const Studio = require('../models/studio');

//get all film studios' s information
router.get("/", async(req, res) => {
    let findingObj = {};
    findingObj.user = req.user._id
    if (req.query.name) findingObj.name = new RegExp(req.query.name, "i");

    try {
        const allStudio = await Studio.find(findingObj);
        res.render("./movie_studios/index", {
            studios: allStudio,
            searchInput: req.query.name,
        });
    } catch (error) {
        res.status(404).json({
            request: "success",
            error: error.message,
        });
    }
});

//get view to insert new film studio
router.get("/new", (req, res) => {
    res.render("./movie_studios/new_studio", {
        studio: new Studio(),
    });
});

//create new studio's information
router.post("/", async(req, res) => {
    const studio = new Studio({
        name: req.body.name.trim(),
        founded: req.body.founded,
        detail: req.body.detail,
        user: req.user._id
    });
    try {
        await studio.save();
        res.status(201).redirect("/studio");
    } catch (error) {
        res.status(400).render("./movie_studios/new_studio", {
            studio: studio,
            err: error.message,
        });
    }
});

//get a specific studio
router.get("/:id", async(req, res) => {
    try {
        const movies = await Movie.find({ studio: req.params.id, user: req.user._id }).limit(8).exec()
        const studio = await Studio.findOne({ _id: req.params.id, user: req.user._id })
        res.render('./movie_studios/display_studio', {
            studio: studio,
            movies: movies
        })

    } catch (error) {
        res.redirect('/studio')
    }
});

//get edit studio view
router.get("/:id/edit", async(req, res) => {
    try {
        const studio = await Studio.findOne({ _id: req.params.id, user: req.user._id });
        if (studio) {
            res.render("./movie_studios/edit_studio", {
                studio: studio
            });
        } else {
            return res.redirect('/studio')
        }
    } catch (error) {
        res.redirect(`/studio/${req.params.id}`)
    }
});

//update a specific studio
router.put("/:id", async(req, res) => {
    let studio
    try {
        studio = await Studio.findOne({ _id: req.params.id, user: req.user._id });
        studio.name = req.body.name.trim() != '' ? req.body.name : studio.name;
        studio.founded = req.body.founded.trim() != '' ? new Date(req.body.founded) : studio.founded;
        studio.detail = req.body.detail.trim() != '' ? req.body.detail : studio.detail;
        await studio.save()
        res.redirect(`/studio/${studio._id}`)
    } catch (error) {
        if (studio) {
            res.status(400).render("./movie_studios/edit_studio", {
                studio: studio,
                err: error.message,
            });
        } else {
            res.redirect('/studio')
        }
    }
});

//delete a sudio
router.delete("/:id", async(req, res) => {
    let studio
    try {
        studio = await Studio.findOne({ _id: req.params.id, user: req.user._id });
        await studio.remove()
        res.redirect('/studio');
    } catch (error) {
        if (studio) {
            res.redirect(`/studio/${studio._id}`)
        } else {
            res.redirect('/studio')
        }
    }
});

module.exports = router;