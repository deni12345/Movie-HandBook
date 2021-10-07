const express = require('express')
const router = express.Router()
const Studio = require('../models/studio')

//get all film studios' s information
router.get('/', async(req, res) => {
    let findingObj = {}
    if (req.query.name)
        findingObj.name = new RegExp(req.query.name, 'i')

    try {
        const allStudio = await Studio.find(findingObj)
        res.render('./movie_studios/index', {
            studios: allStudio,
            searchInput: req.query.name
        })
    } catch (error) {
        res.status(404).json({
            request: "success",
            error: error.message
        })
    }
})

//delete a sudio
router.delete('/', (req, res) => {

})

//get view to insert new film studio
router.get('/new', (req, res) => {
    res.render('./movie_studios/new_studio', {
        studio: new Studio(),
    })
})

//create new studio's information 
router.post('/', async(req, res) => {
    const studio = new Studio({
        name: req.body.name.trim(),
        founded: req.body.founded,
        detail: req.body.detail
    })
    try {
        await studio.save()
        res.status(201).redirect('/studio')
    } catch (error) {
        res.status(400).render('./movie_studios/new_studio', {
            studio: studio,
            err: error.message
        })
    }
})

module.exports = router