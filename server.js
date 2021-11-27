//Install express server
const express = require('express');
const path = require('path');

const app = express();

const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const teacherRoutes = require('./api/routes/teachers')
const studentRoutes = require('./api/routes/students')
const routes = require('./api/routes/routers')
const auth = require('./api/routes/auth')
const { checkToken } = require('./api/utils/auth')

const passport = require('passport');

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/audit-project'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/audit-project/index.html'));
});

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
app.use('/api/teachers', checkToken, teacherRoutes)
app.use('/api/students',checkToken, studentRoutes)
app.use('/api/routes', checkToken, routes)
app.use('/api/', auth)

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

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);