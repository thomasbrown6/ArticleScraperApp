const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;


// Using the Schema constructor, create a new ArticleSchema object
const ArticleSchema = new Schema({
    // `title` is required and of type String
    title: {
      type: String,
      required: true,
      validate: {
        isAsync: true,
        validator: function(value, isValid) {
            const scrapedArticle = this;
            return scrapedArticle.constructor.findOne({ title: value })
            .exec(function(err, dbArticle){
                if(err){
                    throw err;
                }
                else if(dbArticle) {
                    if(scrapedArticle.id === dbArticle.id) {  // if finding and saving then it's valid even for existing article
                        return isValid(true);
                    }
                    return isValid(false);  
                }
                else{
                    return isValid(true);
                }

            })
        },
        message:  'The article is already in database'
    }
  },
  
    // Summary is required and of type String
    summary: {
      type: String,
      required: true
    },
    // `link` is required and of type String
    link: {
      type: String,
      required: true
    },
    // Pic is not required due to some articles not having images, and type is String
    pic: {
      type: String,
      required: false
    },
    saved: {
      type: Boolean,
      required: true,
      default: false
    },
    comment: {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Comment model
      ref: "Comments"
    }
  });
  
  // This creates our model from the above schema, using mongoose's model method
  const Article = mongoose.model("Article", ArticleSchema);
  
  // Export the Article model
  module.exports = Article;