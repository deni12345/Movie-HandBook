const mongoose = require('mongoose')
const Movie = require('./movie')
const studioSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        dropDups: true
    },
    founded: {
        type: Date,
        required: true,
        default: new Date()
    },
    detail: String
})

studioSchema.pre('remove', function(next) {
    Movie.find({ studio: this.id }, (error, data) => {
        if (error) {
            next(error)
        } else if (data.length > 0) {
            next(new Error('this studio has movies still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Studio', studioSchema)