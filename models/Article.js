var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      required: true
   },
   link: {
      type: String,
      required: true
   },
   summary: {
      type: String,
      required: true
   },
   image: {
      type: String,
      required: true
   },
   // `Comment` is an object that stores a Comment id
   // The ref property links the ObjectId to the Comment model
   // This allows us to populate the Article with an associated Comment
   comment: [
      {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
      }
   ]
});

var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
