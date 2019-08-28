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

            // Update article if exists, create otherwise
               db.Article.updateOne(result, result, {upsert: true})
                  .then((dbArticle) => {
                     console.log(dbArticle);
                  })
                  .catch((err) => {
                     console.log(err);
                  });

            // Limit new results
            return i<2
         });
      });
   });
}