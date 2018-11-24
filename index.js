const
	express = require('express'),
	app = express(),
	ejsLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	passport = require('passport'),
	passportConfig = require('./config/passport.js'),
	usersRoutes = require('./routes/users.js')

// environment port
const
	PORT = process.env.PORT || 3000,
	mongoConnectionString = process.env.MONGODB_URI || 'mongodb://localhost/localauth'

// mongoose connection
mongoose.connect(mongoConnectionString, (err) => {
	console.log(err || "Connected to MongoDB.")
})

// will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
});

// middleware
app.use(logger('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true})) // interpret any form data coming in
app.use(bodyParser.json()) // interpret any json data coming in (eg: using ajax requests)
app.use(flash())

// configure our cookie issuer:
app.use(session({
	secret: 'boomchakalaka',
	cookie: {maxAge: 60000000},
	resave: true,
	saveUninitialized: false,
	store: store
}))

// use passport with sessions on every request (to get current user for example)
app.use(passport.initialize())
app.use(passport.session())

// make 'currentUser' and 'loggedIn' available in every view:
app.use((req, res, next) => {
	app.locals.currentUser = req.user
	app.locals.loggedIn = !!req.user
	next()
})

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

//root route
app.get('/', (req,res) => {
	res.render('index')
})

app.use('/', usersRoutes)

app.listen(PORT, (err) => {
	console.log(err || `Server running on ${PORT}`)
})
