const express = require('express');
const router = express.Router();
const Movie = require('../models/movie')
const Studio = require('../models/studio');

//get all film studios' s information
router.get("/", async(req, res) => {
    let findingObj = {};
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
        const movies = await Movie.find({ studio: req.params.id }).limit(8).exec()
        const studio = await Studio.findById(req.params.id)
        res.render('./movie_studios/display_studio', {
            studio: studio,
            movies: movies
        })
    } catch (error) {
        console.log(error)
        res.redirect('/studio')
    }
});

//get edit view
router.get("/:id/edit", async(req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        res.render("./movie_studios/edit_studio", {
            studio: studio
        });
    } catch (error) {
        res.status(500).json({ err: error.message });
    }
});

//update a specific studio
router.put("/:id", async(req, res) => {
    let studio
    try {
        studio = await Studio.findById(req.params.id);
        if (req.body.name) studio.name = req.body.name;
        if (req.body.founded) studio.founded = new Date(req.body.founded);
        if (req.body.detail) studio.detail = req.body.detail;
        await studio.save()
        res.redirect(`/studio/${studio._id}`)
    } catch (error) {
        if (studio) {
            res.status(400).render("./movie_studios/edit_studio", {
                studio: studio,
                err: error.message,
            });
        } else {
            res.status(500).redirect('/studio')
        }
    }
});

//delete a sudio
router.delete("/:id", async(req, res) => {
    let studio
    try {
        studio = await Studio.findById(req.params.id);
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