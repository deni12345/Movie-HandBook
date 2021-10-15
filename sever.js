if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const studiosRouter = require('./routes/studios')
const movieRouter = require('./routes/movies')
const userRouter = require('./routes/user')
const { authenticateToken } = require('./middleware/authenMiddleware')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.urlencoded({ limit: '50mb', extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Database is connected'))

app.use('/', indexRouter)
app.use('/studio', authenticateToken, studiosRouter)
app.use('/movie', authenticateToken, movieRouter)
app.use('/user', userRouter)

app.all('*', (req, res) => {
    res.status(404).send("<h1>404 not found</h1>")
})

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
    console.log('Sever is connected at port 5000')
})