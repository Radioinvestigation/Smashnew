const Strategy = require('passport-discord').Strategy
const config = require("../config.json")

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser((obj, done) => {
        done(null, obj)
    })

    passport.use(new Strategy({
        clientID: config.bot.id,
        clientSecret: config.bot.secret,
        callbackURL: config.callback,
        scope: ['identify', 'guilds', 'email'],
        passReqToCallback: true
    },
    function (req, token, secret, profile, done) {
        return done(null, profile)
    }))
}