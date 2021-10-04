const mongoose = require('mongoose')
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

module.exports = mongoose.model('Studio', studioSchema)