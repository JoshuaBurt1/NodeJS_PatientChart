var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// GET handler for /login
router.get("/login", (req, res, next) => {
  let messages = req.session.messages || []; //if null set an empty list
  req.session.messages = []; //clear messages
  res.render("login", { title: "Login to the App", messages: messages });
});

//POST /login (user click login button)
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/charts",
    failureRedirect: "/login",
    failureMessage: "Invalid Credentials",
  })
);

// GET handler for /register (user loads page)
router.get("/register", (req, res, next) => {
  res.render("register", { title: "Create an Account" });
});

//POST handler for /register
router.post("/register", (req, res, next) => {
  // Create a new user based on the information from the page
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        // take user back and reload register page
        return res.redirect("/register");
      } else {
        // log user in
        req.login(newUser, (err) => {
          res.redirect("/charts");
        });
      }
    }
  );
});

// GET handler for logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    res.redirect("/login");
  });
});

// GET handler /github passport authenticate and pass the name of the strategy 
router.get('/github', passport.authenticate('github', { scope: ['user.email'] }));
// GET handler for /github/callback 
// this is the url they come back to after entering their credentials
router.get('/github/callback',
  // callback to send user back to login if unsuccessful
  passport.authenticate('github', { failureRedirect: '/login' }),
  // callback when login is successful
  (req, res, next) => { res.redirect('/charts') }
);

//renders chart count and page
router.get("/", (req, res, next) => {
    res.render("index", { title: "Online Chart", user: req.user });
});

// GET handler for /charts/index
router.get("/charts/index", (req, res, next) => {
  res.render("index");
});
// GET handler for /support
router.get("/support", (req, res, next) => {
  res.render("support", { isTransparent: true, title: "Support", user: req.user });
});
// GET handler for /support
router.get("/education", (req, res, next) => {
  res.render("education", { isTransparent: true, title: "Medical/Nursing Skill Resource", user: req.user });
});

module.exports = router;
