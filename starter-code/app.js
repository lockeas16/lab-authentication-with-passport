require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

// In order to do that, we need to configure Sessions and initialize a session with passport in our app.js file. We also need to add the passport.serializeUser functions as well as defining the Passport Local Strategy.
const session = require("express-session");
const passport = require("./helpers/passport");
// connect flash para enviar los mensajes de error al fallar
// la autenticacion
const flash = require("connect-flash");

mongoose
  .connect("mongodb://localhost/starter-code", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// to use flash messages
app.use(flash());

// ------------------------------
// Passport and session setup
// ------------------------------
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
// ------------------------------

// --------------------------
// Express View engine setup
// --------------------------
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// default value for title local
app.locals.title = "Lab Authentication with Passport";
app.locals.title2 = "Lab Passport Roles";

// Routes middleware goes here
const index = require('./routes/index');
app.use('/', index);

const passportRouter = require("./routes/passportRouter");
app.use("/", passportRouter);

const auth = require("./routes/auth");
app.use("/auth", auth);

const admin = require("./routes/admin");
app.use("/admin", admin);

const ta = require("./routes/ta");
app.use("/ta", ta);

const course = require("./routes/course");
app.use("/course", course);

module.exports = app;
