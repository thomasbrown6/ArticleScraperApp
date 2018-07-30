// Dependencies
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
const request = require("request");
const Cheerio = require("cheerio");

// Require all models
var db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/ArticleMongoScraper");

// // An empty array to save the data that we'll scrape

module.exports = function(app) {
  let articles = [];

  // Make a request call to grab the HTML body from the site of your choice
  request("https://www.usatoday.com/sports/nba/", function(
    error,
    response,
    html
  ) {
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    const cheerio = Cheerio.load(html);

    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    cheerio("li.hgpm-item").each(function(i, element) {
      const title = cheerio(element)
        .children("a")
        .children(".hgpm-list-wrap")
        .children(".hgpm-list-text")
        .children(".hgpm-list-hed")
        .text();
      const summary = cheerio(element)
        .children("a")
        .children(".hgpm-list-wrap")
        .children(".hgpm-list-text")
        .children(".hgpm-back-listview-text")
        .text();
      const link = cheerio(element)
        .children("a")
        .attr("href");
      const pic = cheerio(element)
        .children("a")
        .children(".hgpm-list-wrap")
        .children()
        .children("img")
        .attr("src");

      // Save these articles in an object that we'll push into the articles array we defined earlier
      articles.push({
        title: title,
        summary: summary,
        link: link,
        pic: pic
      });

    });
  });

  // Routes
  //========================================
  // Main route
  app.get("/", function(req, res) {
    db.Article.remove({}, function(req, res) {
      console.log(`removed Articles`);
    });
    res.render("index");
  });

  // Scrape route, the server will scrape data from the site and save it to MongoDB.
  app.get("/articles", function(req, res) {
    db.Article.create(articles)
      .then(function(dbArticle) {
        res.render("index", { articleData: dbArticle });
      })
      .catch(function(err) {
        return res.json(err);
      });
  });

  // Clear route, clears the articles from MongoDB and webpage
  app.get("/articles/clear", function(req, res) {
    db.Article.remove({}, function(req, res) {
      console.log(`cleared Articles `);
    });
    res.render("index");
  });

  // Delete saved, clears the articles from SavedArticle collection in MongoDB
  app.get("/articles/saved/:id", function(req, res) {
    db.SavedArticle.deleteOne({ _id: req.params._id}, function (err) {
      if (err) return handleError(err);
      // deleted at most one tank document
    });
    res.render("saved");
  });

  // Saved route, goes to saved page, and displays saved articles
  app.get("/articles/saved", function(req, res) {
    db.SavedArticle.find({})
      .then(function(savedArticles) {
        res.render("saved", {
        savedArticle: savedArticles
        })
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Route for saving a article
  app.post("/articles/saved/:id", (req, res) => {
    console.log(req.params.id);
    db.SavedArticle.create(req.body)
      .then(dbArticle => {
        return db.Article.findByIdAndRemove(req.params.id, (err, dbArticle) => {
        })
          .then(dbArticle => {
            res.redirect("/articles");
          });
      });
  });

};
