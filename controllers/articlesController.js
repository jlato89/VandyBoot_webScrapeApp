// Required for controller to work
const express = require('express');
const router = express.Router();

// Our scraping tools
const axios = require('axios');
const cheerio = require('cheerio');

var moment = require('moment');


// Import model to use its database functions.
var article = require('../models/Article.js');


//* Homepage Route
router.get('/', (req, res) => {
   article.find({}).lean()
      // sort by date
      .sort({ date: -1 })
      // Then render to page
      .then((data) => {
         //! disabled since id need to add it to every instance of date. have to find better way
         // let newData = data.map((item) => {
         //    item.date = moment(item.date).format('dddd, MMMM Do YYYY');
         //    return item;
         // })
         var hbsObject = {
            articles: data
         }
         res.render('index', hbsObject);
      })
      // Catch any errors and display them
      .catch((err) => {
         res.json(err);
      });
});

//* Article Page
router.get('/article/:id', (req, res) => {
   article.findOne({ _id: req.params.id })
      // populate all comments associated with it
      .populate('comment')
      // If article is found, display it
      .then((article) => {
         res.render('article', article);
      })
      .catch((err) => {
         // If error occurs, send to client
         res.json(err);
      });
});

//* Article Scrape Route
router.get('/scrape', (req, res) => {
   axios.get('https://vrscout.com/news/').then((response) => {
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

         article.findOne(
            {
               title: result.title
            },
            (err, res) => {
               if (err) throw err;
               // Check if there is a duplicate in DB
               if (res != null) {
                  // If duplicate found, DO NOT add to DB
                  console.log('duplicate found, do not create document again');
               } else {
                  // If no duplicate was found, then add to DB
                  article.create(result)
                     .then(article => {
                        console.log('Document Created! ->', article.title);
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

module.exports = router;
