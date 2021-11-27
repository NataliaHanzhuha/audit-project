const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const teacherRoutes = require('./routes/teachers')
const studentRoutes = require('./routes/students')
const routes = require('./routes/routers')
const auth = require('./routes/auth')
const { checkToken } = require('./utils/auth')

var passport = require('passport');
app.use(passport.initialize());

mongoose.connect(
    `mongodb+srv://admin:QAI2tAkArHOror5T@cluster0.dpxaj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, 
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

// cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', 'PUT, POST, PATCH, GET, DELETE')
        return res.status(200).json({})
    }
    next()
})

//connect routes 
app.use('/teachers', checkToken, teacherRoutes)
app.use('/students',checkToken, studentRoutes)
app.use('/routes', checkToken, routes)
app.use('/', auth)

// error hendler
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app