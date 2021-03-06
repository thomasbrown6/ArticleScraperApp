const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentSchema object
// This is similar to a Sequelize model
const CommentSchema = new Schema({
  // `body` is of type String
  comment: String
});

// This creates our model from the above schema, using mongoose's model method
const Comments = mongoose.model("Comments", CommentSchema);

// Export the Comment model
module.exports = Comments;