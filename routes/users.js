//user routes
const
	express = require('express'),
	passport = require('passport'),
	usersRouter = new express.Router()

usersRouter.route('/login')
	.get((req, res) => {
		// we include a local variable called 'message' in our login.ejs view
		// its value is the result of running req.flash('loginMessage') as a getter method
		// if there's no loginMessage generated before getting to this point
		// then {message: ''}. otherwise, {message: 'There was a problem logging in...'}
		res.render('login', {message: req.flash('loginMessage')})
	})

	// utilize our local-login strategy to log in
	// if login succeeds (according to our local-login strategy in ../config/passport.js)
	// redirect to the user profile route. otherwise redirect back to the sign up page
	.post(passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login'
	}))

usersRouter.route('/signup')
	.get((req, res) => {
		// we include a local variable called 'message' in our signup.ejs view
		// its value is the result of running req.flash('signupMessage') as a getter method
		// if there's no loginMessage generated before getting to this point
		// then {message: ''}. otherwise, {message: 'That email is taken...'}
		res.render('signup', {message: req.flash('signupMessage')})
	})

	// utilize our local-signup strategy to sign up.
	// if sign up succeeds (according to our local-signup strategy in ../config/passport.js)
	// redirect to the user profile route. otherwise redirect back to the sign up page
	.post(passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup'
	}))

usersRouter.get('/profile', isLoggedIn, (req, res) => {
	res.render('profile', {user: req.user})
})

usersRouter.get('/logout', (req, res) => {
	// logout() is a method that is added to the req object
	// by passport middleware before we process any routes
	// we run it to invalid the current cookie and then redirect
	req.logout()
	res.redirect('/')
})

// we construct our own ExpressJS middleware as a function,
// that exposes the incoming request object, the available response object
// and a next() function that we run when we're ready to move on to the next function in the chain
// here, next() would be whichever route callback (controller action) is supposed to run next:
function isLoggedIn(req, res, next) {
	// isAuthenticated() is also added to the req object by passport middleware
	// it returns boolean: is the cookie (if there is one provided in the request) valid?
	if(req.isAuthenticated()) return next()
	res.redirect('/')
}

module.exports = usersRouter