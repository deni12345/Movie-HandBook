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
        res.render('./film_studios/index', {
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
    res.render('./film_studios/new_studio', {
        studio: new studio(),
        date: new Date()
    })
})

//create new studio's information 
router.post('/new', validateInfo, async(req, res) => {
    try {
        await res.newStudio.save()
        res.status(201).redirect('/studio')
    } catch (error) {
        res.status(500).render('./film_studios/new_studio', {
            studio: new Studio(),
            date: new Date(),
            err: error.message
        })
    }
})


function validateInfo(req, res, next) {
    const newStudio = new Studio({
        name: req.body.name,
        founded: req.body.founded,
        detail: req.body.detail
    })

    if (req.body.name.toString().trim() == "") {
        return res.status(400).render('./film_studios/new_studio', {
            studio: newStudio,
            date: `${newStudio.founded.getFullYear()}-${newStudio.founded.getMonth()+1}-${newStudio.founded.getDate()}`,
            err: 'wrong input'
        })
    }

    res.newStudio = newStudio
    next()
}

module.exports = router