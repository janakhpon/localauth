const
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require('../models/User.js')

// every request will attempt to extract the current user's id,
// and serialize it to put it into a cookie 🍪
passport.serializeUser((user, done) => {
	done(null, user.id)
})

// every request will also attempt to read a provided cookie
// grab the id within, and identify the user it belongs to 🤷‍
passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user)
	})
})

passport.use('local-signup', new LocalStrategy({
	usernameField: 'email', // assign our user's 'email' field as passport's 'username'
	passwordField: 'password', // assign our user's 'password' field as passport's 'password'
	passReqToCallback: true // include the original req object in the following callback:
}, (req, email, password, done) => {
	// before saving new user, first check if user with desired email already exists:
	User.findOne({email: email}, (err, user) => {
		// if there's a problem with the query, abort
		if(err) return done(err)
		// if there's a user with that email:
		// using 'false' as the second done() arg gets us to a failure redirect (try again)
		if(user) return done(null, false, req.flash('signupMessage', 'That email is taken...'))
		// otherwise, allow user to be created
		var newUser = new User(req.body)
		// but hash the user's password before saving
		newUser.password = newUser.generateHash(password)
		// save new user and use a truthy second done() arg to trigger a
		// success redirect
		newUser.save((err) => {
			if(err) return console.log(err)
			return done(null, newUser)
		})
	})
}))

passport.use('local-login', new LocalStrategy({
	usernameField: 'email', // assign our user's 'email' field as passport's 'username'
	passwordField: 'password', // assign our user's 'password' field as passport's 'password'
	passReqToCallback: true // include the original req object in the following callback:
}, (req, email, password, done) => {
	// before logging in, first check to see if user with submitted email exists:
	User.findOne({email: email}, (err, user) => {
		// if there's a problem with the query, abort
		if(err) return done(err)
		// if no user found or password is invalid:
		if(!user || !user.validPassword(password)) {
			// using 'false' as the second done() arg gets us to a failure redirect (try again)
			// req.flash('messageName', 'message body') is a flash message setter
			return done(null, false, req.flash('loginMessage', 'There was a problem logging in...'))
		}

		// otherwise if it gets to this point, it means they've logged in successfully
		// use truthy 'user' object as second done() arg to trigger success redirect
		return done(null, user)
	})
}))

module.exports = passport