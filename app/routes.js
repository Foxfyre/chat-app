module.exports = function(app, passport) {
  //Home page with login
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });
  //Login page
  app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });
  //process login form.
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/chat",
      failureRedirect: "/login",
      failureFlash: true
    })
  );
  //signup
  app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });
  // process signup
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/chat", function(req, res) {
    res.sendFile(process.cwd() + "/views/chat.html");
    console.log(req);
  });
  // profile section
  app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs", {
      user: req.user
    });
  });

  // logout
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};

// route middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
