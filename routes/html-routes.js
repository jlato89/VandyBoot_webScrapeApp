module.exports = function(app) {
   // Homepage
   app.get('/', function(req, res) {
      res.render('index');
   });
}