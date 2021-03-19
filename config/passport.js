const LocalStrategy = require("passport-local").Strategy

//load User Model
const User = require("../models/user")

//export passport functions to our app for user authentication and session tracking

module.exports = (passport)=>{
    //passport session setup ====================================

    //serialize user for the session
    passport.serializeUser((user, done)=> {
        done(null, user.id)
    })

    //deserialize the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

     //local sign up setup ====================================
     passport.use("local-signup", new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true //passing the entire request to callback
     },
     (req, email, password, done)=>{

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, (err, user) => {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (email.indexOf(' ') >= 0) {
                return done(null, false, req.flash('signupMessage', 'Input empty. Please enter an email.'));
            }
            else if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.local.avatar = req.body.avatar
				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    // LOCAL LOGIN =============================================================

    passport.use('local-login', new LocalStrategy({
        
        usernameField : "email",
        passwordField : "password",
        passReqToCallback : true 
    },
    (req, email, password, done) => { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, (err, user) => {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password, user))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};
