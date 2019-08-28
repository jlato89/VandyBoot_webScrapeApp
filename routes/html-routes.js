var db = require('../models');
// Our scraping tools
const axios = require('axios');
const cheerio = require('cheerio');


module.exports = function(app) {
   // Homepage
   app.get('/', function(req, res) {
      axios.get('https://vrscout.com/news/').then(function(response) {
         const $ = cheerio.load(response.data);

         var result = {};

         $('.vce-post').each((i, el) => {
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

            // console.log(result);

            db.Article.findOne(
               {
                  title: result.title
               },
               function(err, res) {
                  if (err) throw err;
                  // Check if there is a duplicate in DB
                  if (res) {
                     // If duplicate found, DO NOT add to DB
                     console.log('duplicate found, do not create again');
                  } else {
                     // If no duplicate was found, then add to DB
                     db.Article.create(result)
                        .then(dbArticle => {
                           // console.log(dbArticle);
                           console.log('Document Created!');
                        })
                        .catch(err => {
                           console.log(err);
                        });
                  }
               }
            );   
            // Limit new results
            return i<4
         });
      });
   });
}