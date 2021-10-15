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
        type: Buffer,
        require: true
    },
    coverImgType: {
        type: String,
        require: true
    },
    posterImg: {
        type: Buffer,
        require: true
    },
    posterImgType: {
        type: String,
        require: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Studio'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

movieSchema.virtual('coverImgPath').get(function() {
    if (this.coverImg && this.coverImgType)
        return `data:${this.coverImgType};base64,${this.coverImg.toString('base64')}`
})

movieSchema.virtual('posterImgPath').get(function() {
    if (this.posterImg && this.posterImgType)
        return `data:${this.posterImgType};base64,${this.posterImg.toString('base64')}`
})

module.exports = mongoose.model('Movie', movieSchema)