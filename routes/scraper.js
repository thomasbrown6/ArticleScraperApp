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
  

  // Scrape route, the server will scrape data from the site and save it to MongoDB.
  app.post("/articles", function(req, res) {
    db.Article.deleteMany({ saved: false }, function(err) {
      console.log("cleared Articles");
    });
    db.Article.create(articles)
      .then(function(dbArticle) {
        res.render("index", { articleData: dbArticle });
      })
      .catch(function(err) {
        return res.json(err);
      });
  });
  // Route to get all articles on page
  app.get("/articles", function(req, res) {
    db.Article.find({ saved: false}, (err, dbArticle) => {
      res.render("index", { articleData: dbArticle });
    });
  });

  // Clear route, clears the articles from MongoDB and webpage is saved value is false
  app.get("/articles/clear", function(req, res) {
    db.Article.deleteMany({ saved: false }, function(err) {
      console.log("cleared Articles");
    });
    res.redirect("/articles");
  });

  // Delete saved, clears a article from Article collection in MongoDB
  app.get("/articles/saved/:id", (req, res) => {
    db.Article.findByIdAndRemove(
      req.params.id,
      (err, dbArticle) => {}
    ).then(dbArticle => {
      res.render("saved");
    });
  });

  // Route for saving a article
  app.put("/articles/saved/:id", (req, res) => {
    db.Article.findOneAndUpdate({
      _id: req.params.id },
      {saved: true})
      .then(dbArticle => {
        // console.log(dbArticle);
          res.render("index");
        });
  });

  // Route for removing a article from saved page
  app.put("/articles/unsave/:id", (req, res) => {
    db.Article.findOneAndUpdate({
      _id: req.params.id },
      {saved: false})
      .then(dbArticle => {
        // return db.Comments.findOneAndRemove
        // console.log(dbArticle);
          res.render("saved");
        });
  });

  // Route for saving/updating an Article's comment
  app.post("/articles/comment/:id", function(req, res) {
    console.log(req.body);
    // Create a new comment and pass the req.body to the entry
    db.Comments.create(req.body)
    .then(newcomment => {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: newcomment._id }, { new: true });
  })
  .then(comment => {
    //console.log(comment);
  })
  .catch(err => {
    res.json(err);
  });
});

  // Delete a comment from MongoDB and from the article
  app.get("/articles/comment/:id", (req, res) => {
    console.log(req.params.id);
    db.Comments.findByIdAndRemove(
      req.params.id,
      (err, dbArticle) => {}
    ).then(dbArticle => {
      res.redirect("/articles/saved");
    });
  });


};
