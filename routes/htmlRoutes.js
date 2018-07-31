// Dependencies
var mongoose = require("mongoose");

// Require all models
var db = require("../models");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/ArticleMongoScraper");

module.exports = function(app) {
  // Main route
  app.get("/", function(req, res) {
    res.redirect("/articles");
  });

  // Saved route, goes to saved page, and displays saved articles
  app.get("/articles/saved", function(req, res) {
    db.Article.find({ saved: true }).populate("comment")
      .then(function(savedArticles) {
        res.render("saved", {
          savedArticle: savedArticles,
        });
      })
      .catch(function(err) {
        res.json(err);
      });
  });
};
