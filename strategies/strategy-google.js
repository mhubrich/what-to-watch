const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("config");


/**
 * Wrapper class which creates an instance of `GoogleStrategy` with desired configs.
 * @class StrategyGoogle
 */
class StrategyGoogle {
    constructor() {
        if (this.constructor == StrategyGoogle) {
            throw new Error("Use factory method `createInstance` instead.");
        }
    }

    /**
     * Factory method creates an instance of `GoogleStrategy` with desired configs.
     * @static
     * @return {GoogleStrategy} New instance of `GoogleStrategy`.
     */
    static createInstance() {
        return new GoogleStrategy({
            clientID: config.get("strategy.google.clientId"),
            clientSecret: config.get("strategy.google.clientSecret"),
            callbackURL: config.get("strategy.google.callbackURL")
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, { id: profile.id, name: StrategyGoogle.getName(profile) });
        })
    }

    /**
     * Helper to obtain a display name from the given profile.
     * @static
     * @param {Object} profile  Profile obtained by the identity provider.
     * @return {String}         Display name of the user.
     */
    static getName(profile) {
        if (profile.hasOwnProperty("name") && profile.name.hasOwnProperty("givenName")) {
            return profile.name.givenName;
        }
        if (profile.hasOwnProperty("displayName")) {
            return profile.displayName;
        }
        return "Unknown User";
    }
}


module.exports = StrategyGoogle;