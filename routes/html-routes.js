var db = require('../models');
// Our scraping tools
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = function(app) {

   // Homepage
   app.get('/', (req, res) => {
      db.Article.find({})
         .then(function(dbArticle) {
            console.log(dbArticle);
            res.render('index', {
               article: dbArticle
            });
         })
         .catch(function(err) {
            res.json(err);
         });
   });


   // Scrape
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
      });
   });
}