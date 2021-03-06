const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
var fs = require("fs");
var details = require("./models/upload");
const { ensureAuthenticated, forwardAuthenticated } = require("./config/auth");

const app = express();

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// EJS
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/Project"));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/", require("./routes/index.js"));
app.use("/users", require("./routes/users.js"));
app.use("/admins", require("./routes/admins.js"));
app.use("/regcar", require("./routes/register.js"));
app.use("/profile", require("./routes/index.js"));
app.use("/reserve", require("./routes/reserve.js"));
app.use("/yourcar", require("./routes/yourcar.js"));

app.get("/more/:id", async (req, res) => {
  try {
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      var records1 = await details.findById(req.params.id);
    }

    res.render("more", {
      records1: records1,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/find", async (req, res) => {
  var rec = await details.find({ vname: { $regex: item } });
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs");
});

app.get("/welcome", function (req, res) {
  res.render("welcome.ejs");
});
app.get("/cont", ensureAuthenticated, function (req, res) {
  res.render("cont.ejs");
});
app.get("/terms-of-use", ensureAuthenticated, function (req, res) {
  res.render("terms-of-use.ejs");
});
app.get("/policy", ensureAuthenticated, function (req, res) {
  res.render("policy.ejs");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
