const express = require("express");
const passport = require("passport");


const loginRouter = express.Router();


// Redirect the user to the OAuth provider for authentication
loginRouter.get("/login", passport.authenticate("google", { scope: ["profile"] }));

// When authentication complete, the provider will redirect the user
// back to the application at this route
loginRouter.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login"}),
    (req, res) => {
        console.log("AUTHENTICATION SUCCESSFUL", req);
        res.redirect("/");
    }
);

// Calling logout will clear both user and session information
loginRouter.get("/logout", (req, res, next) => {
    console.log("LOGOUT", req.user);
    // Logout of passport (removes user property from req)
    req.logout(err => { 
        // Destroy the session (removes session property from req)
        req.session.destroy(err => {
            res.redirect("/");
        });
    });
});


module.exports = loginRouter;