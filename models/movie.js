const coverImgBasePath = 'upload/movieImg'
const path = require('path')
const mongoose = require('mongoose')
const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    actors: [String],
    coverImg: {
        type: String,
    },
    posterImg: {
        type: String,
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Studio'
    }
})

movieSchema.virtual('coverImgPath').get(function() {
    if (this.coverImg)
        return path.join('/', coverImgBasePath, this.coverImg)
})

module.exports = mongoose.model('Movie', movieSchema)
module.exports.coverImgBasePath = coverImgBasePath