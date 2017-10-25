const express  = require("express"),
      con      = require('../db/index'),
      router   = express.Router();

// HOME PAGE
router.get('/', function(req,res){
   req.app.locals.rider = 'Anshul';
   con.query("select *from location", function (err, result, fields) {
      if (err) throw err;
      console.log(fields);
      console.log(result);
      res.render('index', {
         result: result,
         fields: fields
      });
   });

});

router.get('/rider',isRiderLoggedIn, function (req,res) {
   res.render('index');
});

router.get('/driver',isDriverLoggedIn, function (req,res) {
   res.render('index');
});

router.get('/login', function (req,res) {
   res.render('login');
});

router.get('/signup', function (req,res) {
   res.render('signup');
});

function isRiderLoggedIn(req,res,next) {
   if(req.app.locals.rider){
      return next();
   }
   req.flash('error', 'You must login first');
   res.redirect('/login');
}

function isDriverLoggedIn(req,res,next) {
   if(req.app.locals.driver){
      return next();
   }
   req.flash('error', 'You must login first');
   res.redirect('/login');
}
module.exports = router;