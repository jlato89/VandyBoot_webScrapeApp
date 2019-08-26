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
               .find('.entry-title')
               .attr('href');
            result.date = $(el)
               .find('.date')
               .text()
               .replace(/,/, '');
            result.summary = $(el)
               .find('.entry-content')
               .text();

               console.log(result);

            // Insert into DB
            db.Article.create(result)
               .then((dbArticle) => {
                  console.log(dbArticle);
               })
               .catch((err) => {
                  console.log(err);
               });

            // Limit results
            return i<5
         });
      });
   });
}