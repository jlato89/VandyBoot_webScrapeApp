// Required for controller to work
const express = require('express');
const router = express.Router();

// Import model to use its database functions.
var comment = require('../models/Comment.js');
var article = require('../models/Article.js');

//* Save Comment ref to article
router.post('/article/:id', function(req, res) {
   comment.create(req.body)
      .then(function(dbComment) {
         // If a Comment was created successfully, find a Article with a _id equal to req.params.id, Then update the Article to be associated with the new Comment
         return article.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { comment: dbComment._id } },
            { new: true }
         );
      })
      .then(function(dbArticle) {
         // If the Article was updated successfully, then pass json to user.
         res.json(dbArticle);
      })
      .catch(function(err) {
         res.json(err);
      });
});

module.exports = router;