var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var moment = require('moment');
require('dotenv').config();

// Assign port to server
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Configure middleware
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static('public'));

// Setup Handlebars
app.engine(
   'handlebars',
   exphbs({
      defaultLayout: 'main',
      helpers: {
         formatDate: function(date, format) {
            return moment(date).format(format);
         }
      }
   })
);
app.set("view engine", "handlebars");

// Views
app.set("views", "./views");

// Define routes
var articleRoutes = require('./controllers/articlesController.js');
var commentRoutes = require('./controllers/commentsController.js');
app.use(articleRoutes, commentRoutes);

// Connect to the Mongo DB
var user = process.env.DB_USER;
var psw = process.env.DB_PSW;
var MONGODB_URI =
   process.env.MONGODB_URI ||
   `mongodb+srv://${user}:${psw}@webscrapeapp-hoapb.mongodb.net/webscraping?retryWrites=true&w=majority`;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
   .catch(error => handleError(error));


// Start the server
app.listen(PORT, function() {
   console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.  ',
      PORT,
      PORT
   );
});
