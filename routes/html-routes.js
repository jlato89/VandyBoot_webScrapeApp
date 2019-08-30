var db = require('../models');
// Our scraping tools
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = function(app) {

   //* Homepage
   app.get('/', (req, res) => {
      // Find all articles in DB
      db.Article.find({})
         // sort by date
         .sort({ date:-1 })
         // Then render to page
         .then(function(dbArticle) {
            res.render('index', {
               article: dbArticle
            });
         })
         // Catch any errors and display them
         .catch(function(err) {
            res.json(err);
         });
   });


   //* Article profile
   app.get('/article/:id', function(req, res) {
      db.Article.findOne({ _id: req.params.id })
         // populate all comments associated with it
         .populate('comment')
         // If article is found, display it
         .then(function(dbArticle) {
            console.log(dbArticle.comment);
            res.render('article', dbArticle);
         })
         .catch(function(err) {
            // If error occurs, send to client
            res.json(err);
         });
   });

   //* Article comment save
   app.post('/article/:id', function(req, res) {
      db.Comment.create(req.body)
         .then(function(dbComment) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate(
               { _id: req.params.id },
               { $push:
                  {comment: dbComment._id }
               },
               { new: true }
            );
         })
         .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
         })
         .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
         });
   });

   //* Scrape
   app.get('/scrape', (req, res) => {
      axios.get('https://vrscout.com/news/').then(function(response) {
         const $ = cheerio.load(response.data);

         $('.vce-post').each((i, el) => {
            var result = {};

            // Scrape data from website
            result.title = $(el)
               .find('.entry-title')
               .text()
               .trim();
            result.link = $(el)
               .find('.entry-title a')
               .attr('href');
            result.date = $(el)
               .find('.date')
               .text()
               .replace(/,/, '');
            result.summary = $(el)
               .find('.entry-content')
               .text();
            result.image = $(el)
               .find('.meta-image a img')
               .attr('src')

            // console.log('raw Results: ',result.title);
            // console.log('-----------------');

            db.Article.findOne(
               {
                  title: result.title
               },
               function(err, res) {
                  if (err) throw err;
                  // console.log('res: ',res);

                  // Check if there is a duplicate in DB
                  if (res != null) {
                     // If duplicate found, DO NOT add to DB
                     console.log('duplicate found, do not create document again');
                  } else {
                     // If no duplicate was found, then add to DB
                     db.Article.create(result)
                        .then(dbArticle => {
                           console.log('Document Created! ->', dbArticle.title);
                        })
                        .catch(err => {
                           console.log(err);
                        });
                  }
               }
            );   
            // Limit new results
            return i<2
         });
         res.send('Scrape Complete');
      });
   });
}