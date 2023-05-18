const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const morgan = require('morgan')

//Load config
dotenv.config({ path: './config/config.env' })

//Passport
require('./config/passport')(passport)

connectDB()

const app = express()

//Logging
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Handlebars
//!Add the word .engine after exphbs
app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main',
    extname: '.hbs', 
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'views/partials'),
    ]
    })
)
app.set('view engine', '.hbs')

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
})
)


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 8500

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`))