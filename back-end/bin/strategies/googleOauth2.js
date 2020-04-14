const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
require('dotenv').config()

//Use the GoogleStrategy within Passport.
//Strategies in Passport require a "verify" function, which accept
//credentials (in this case, an accessToken, refreshToken, and Google)
//profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK

},
    function (accessToken, refreshToken, profile, done) {
    console.log("passport function, profile")

    done(null, profile)
}
))