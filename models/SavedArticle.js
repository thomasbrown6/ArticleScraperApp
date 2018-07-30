const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;


// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const SavedSchema = new Schema({
    // `title` is required and of type String
    title: {
      type: String,
      required: true
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
    // `note` is an object that stores a Note id
    // The ref property links the ObjectId to the Note model
    // This allows us to populate the SavedArticle with an associated Note
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  });
  
  // This creates our model from the above schema, using mongoose's model method
  const SavedArticle = mongoose.model("SavedArticle", SavedSchema);
  
  // Export the SavedArticle model
  module.exports = SavedArticle;