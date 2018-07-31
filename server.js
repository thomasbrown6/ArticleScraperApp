// PORT
const PORT = process.env.PORT || 4000;
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
const logger = require("morgan");
const mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Dependencies
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const express = require("express");


// Initialize Express
const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Static directory
app.use(express.static("public")); //basically assets folder

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); //middleware code comes from bodyparser package
// parse application/json
app.use(bodyParser.json());

// Require Routes 
//=======================================================
require("./routes/scraper.js")(app);
require("./routes/htmlRoutes.js")(app);



/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 4000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
