// Required for controller to work
const express = require('express');
const router = express.Router();

// Our scraping tools
const axios = require('axios');
const cheerio = require('cheerio');

// Import model to use its database functions.
var comment = require('../models/Comment.js');



module.exports = router;
