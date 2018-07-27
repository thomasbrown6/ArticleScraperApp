// PORT
var PORT = process.env.PORT || 3000;
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var Cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

 // An empty array to save the data that we'll scrape
 var results = [];

// Make a request call to grab the HTML body from the site of your choice
request(
  "http://www.espn.com/nba/team/roster/_/name/lal/los-angeles-lakers",
  function(error, response, html) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var cheerio = Cheerio.load(html);

   

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    cheerio("td.sortcell").each(function(i, element) {
      var link = cheerio(element)
        .children()
        .attr("href");
      var player = cheerio(element)
        .children()
        .text();

      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        player: player,
        link: link
      });
    });

  }
);


// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello World");
});

// TODO: make two more routes

// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)
app.get("/all", function(req, res) {
  db.scrapedData.find({}, function(err, data) {
    if (err) throw err;
    console.log(data);
    res.send(data);
});

});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?
app.get("/scrape", function(req, res) {
  db.scrapedData.remove({});
  db.scrapedData.insert(results);
  //console.log(results);
  res.send("Scraped Data");
});

app.get("/delete", function(req, res) {
  db.scrapedData.remove({});
  res.send("Deleted scraped data from Mongo");
});

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
