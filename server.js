const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const configDB = require("./config/database.js");
//const http = require("http").Server(app);
//const io = require("socket.io")(http);
const io = require("socket.io").listen(app.listen(port));

mongoose.connect(
  configDB.url,
  { useNewUrlParser: true }
);

require("./config/passport")(passport);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/views"));

app.set("view engine", "ejs");

app.use(
  session({
    secret: "randomsecret",
    resave: true,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./app/routes.js")(app, passport);

//app.listen(port);
console.log("Port " + port + " responding");

io.on("connection", function(socket) {
  console.log("A user has connected");
  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });
});
