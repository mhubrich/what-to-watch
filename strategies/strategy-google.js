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

    static createInstance() {
        return new GoogleStrategy({
            clientID: config.get("auth-provider.google.clientId"),
            clientSecret: config.get("auth-provider.google.clientSecret"),
            callbackURL: config.get("auth-provider.google.callbackURL")
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, { id: profile.id, name: this.getName(profile) });
        })
    }

    /**
     * Helper to obtain a display name from the given profile.
     * @param {Object} profile  Profile obtained by the identity provider.
     * @return {String}         Display name of the user.
     */
    getName(profile) {
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