// Required for controller to work
const express = require('express');
const router = express.Router();

// Import model to use its database functions.
var comment = require('../models/Comment.js');
var article = require('../models/Article.js');

//* ADD Comment to article
router.post('/article/:id', (req, res) => {
   comment.create(req.body)
      .then((dbComment) => {
         // If a Comment was created successfully, find a Article with a _id equal to req.params.id, Then update the Article to be associated with the new Comment
         return article.findOneAndUpdate(
            { _id: req.params.id },
            { $push: { comment: dbComment._id } },
            { new: true }
         );
      })
      .then((dbArticle) => {
         // If the Article was updated successfully, then pass json to user.
         res.json(dbArticle);
      })
      .catch((err) => {
         res.json(err);
      });
});

//* DELETE Comment from article
router.delete('/delete/:id', (req, res) => {
   comment.deleteOne(
      {
         _id: req.params.id
      })
      .then(() => {
         res.json('success');
      })
      .catch((err) => {
         res.json(err);
      });
});

module.exports = router;