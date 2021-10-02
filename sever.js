if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database is connected'))

app.use('/', indexRouter)
app.use('/db', (req, res) => {
    res.send(`hey: ${process.env.DATABASE_URL}`)
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Sever is connected at port 5000')
})