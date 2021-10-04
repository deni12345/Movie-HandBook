if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const indexRouter = require('./routes/index')
const studiosRouter = require('./routes/studios')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database is connected'))

app.use('/', indexRouter)
app.use('/studio', studiosRouter)

app.all('*', (req, res) => {
    res.status(404).send("<h1>404 not found</h1>")
})

app.listen(process.env.PORT || 5000, () => {
    console.log('Sever is connected at port 5000')
})