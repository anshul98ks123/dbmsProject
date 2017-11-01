const express  = require("express"),
      con      = require('../db/index'),
      router   = express.Router();

// HOME PAGE
router.get('/', function(req,res){
   res.render('index');
});

router.get('/rider',isRiderLoggedIn, function (req,res) {
   res.render('rider');
});

router.get('/driver',isDriverLoggedIn, function (req,res) {
   res.render('driver');
});

router.get('/loginrider', function (req,res) {
   res.render('loginrider');
});

router.get('/logindriver', function (req,res) {
   res.render('logindriver');
});

router.get('/signuprider', function (req,res) {
   res.render('signuprider');
});

router.post('/rider', function (req,res) {
   con.query('select riderid from rider where userid='+res.app.locals.rider['userid'], (err,results,fields)=>{
      if(err){
         console.log(err);
         req.flash('error', 'Error in boooking ride' + err.message);
         return res.redirect('/');
      }
      con.query(`insert into ridereq(riderid,pickuplocation,droplocation) 
         values(${results[0]['riderid']},${req.body.loc},${req.body.dest})`, (err,r,f)=>{
         if(err){
            console.log(err);
            req.flash('error', 'Error in boooking ride' + err.message);
            return res.redirect('/');
         }
         req.flash('success', 'Cab booked successfully');
         return res.redirect('/rider');
      })
   });
});

router.get('/logout', function (req,res) {
   res.app.locals.rider = undefined;
   res.app.locals.driver = undefined;
   req.flash('success','logged out successfully');
   res.redirect('/');
});

router.post('/loginrider', function (req,res) {
   con.query("select *from user where userid="+req.body.id, (err,result,fields)=>{
      if(err){
         console.log(err);
         req.flash('error', 'error occurred ' + err.message);
         return res.redirect('/signuprider');
      }
      con.query("select *from rider where userid="+req.body.id, (err,results,fields)=>{
         if(err){
            console.log(err);
            req.flash('error', 'error occurred ' + err.message);
            return res.redirect('/signuprider');
         }
         if(results.length === 0){
            req.flash('error', 'user does not exist');
            return res.redirect('/signuprider');
         }
         if(result[0]['password'] === req.body.password){
            req.app.locals.rider = result[0];
            req.flash('success', 'Welcome '+result[0]['name']);
            return res.redirect('/rider');
         }
         req.flash('error', 'incorrect password');
         return res.redirect('/loginrider');
      });
   });
});

router.post('/logindriver', function (req,res) {
   con.query("select *from user where userid="+req.body.id, (err,result,fields)=>{
      if(err){
         console.log(err);
         con.query("select place,zipcode from location", function (err, result, fields) {
            if (err) throw err;
            req.flash('error', 'error occured : ' + err.message);
            return res.redirect('/signupdriver');
         });loginrider
      }
      con.query("select *from driver where userid="+req.body.id, (err,results,fields)=>{
         if(err){
            console.log(err);
            req.flash('error', 'error occured : ' + err.message);
            return res.redirect('/signupdriver');
         }
         if(results.length === 0){
            req.flash('error', 'user does not exist');
            return res.redirect('/signupdriver');
         }
         if(result[0]['password'] === req.body.password){
            req.app.locals.driver = result[0];
            req.flash('success', 'Welcome '+result[0]['name']);
            return res.redirect('/driver');
         }
         req.flash('error', 'incorrect password');
         return res.redirect('/logindriver');
      });
   });
});

router.get('/signupdriver', function (req,res) {
   con.query("select place,zipcode from location", function (err, result, fields) {
      if (err) throw err;
      res.render('signupdriver', {
         result: result
      });
   });
});

router.post('/signuprider', function (req,res) {
   console.log(req.body);
   con.query("insert into user (name,password,email) values('"
      + req.body.name + "','" + req.body.password + "','"
      + req.body.email + "')", function (err,result,fields) {
      if(err){
         console.log(err);
         req.flash('error', 'error occurred' + err.message);
         return res.redirect('/signuprider');
      }
      con.query("insert into rider (dob) values('"+ req.body.date+"')"
         , function (err,resultss,fields) {
            if(err){
               console.log(err);
               req.flash('error', 'error occurred' + err.message);
               return res.redirect('/signuprider');
            }
            console.log("successful");
            req.flash('success', 'Successfully signed up as rider');
            return res.redirect('/loginrider');
      });
   });
});

router.post('/', function (req,response) {
   con.query("select *from location", function (err, result, field) {
      if (err) throw err;
      console.log(req.body.query);
      console.log(0);
      if(req.body.query.length >= 6 && req.body.query.slice(0,6) === "select"){
         con.query(req.body.query, (er,results,fields) => {
            if (er){
               console.log(err);
               console.log(1);
               return response.render('index', {
                  result: result,
                  fields: field,
                  error: er.message
               });
            }
            console.log(2);
            return response.render('index', {
               result: results,
               fields: fields,
               success: 'Query results : '
            });
         });
      } else {
         console.log(3);
         return response.render('index', {
            result: result,
            fields: field
         });
      }
   });
});

router.post('/signupdriver', function (req,response) {
   console.log(req.body);
   let userid,taxiid;
   con.query("insert into user (name,password,email) values('"
      + req.body.name + "','" + req.body.password + "','"
      + req.body.email + "')", function (err,result,fields) {
      if(err){
         console.log(err);
         req.flash('error', 'error occurred' + err.message);
         return res.redirect('/signupdriver');
      }
      con.query("insert into taxi(type,model_name,color,manufacturer)" +
         " values('"+req.body.type+"','"+req.body.model+"','" +
         req.body.color+"','"+req.body.man+"')", (err, result, fields) => {
         if(err){
            console.log(err);
            req.flash('error', 'error occurred' + err.message);
            return res.redirect('/signupdriver');
         }
         con.query("insert into driver (dob,licenseno,location) " +
            "values('" + req.body.date+"','" +
            req.body.license + "',"+ req.body.loc+")"
            , function (err,resultss,fields) {
               if(err){
                  console.log(err);
                  req.flash('error', 'error occurred' + err.message);
                  return res.redirect('/signupdriver');
               }
               console.log("successful");
               req.flash('success', 'Successfully signed up as driver');
               return res.redirect('/logindriver');
            });
      });
   });
});

router.post('/completeRide', (req,res) => {
   con.query(`update driver set status='Available' where userid=${res.app.locals.driver['userid']}`, (err,r,f)=>{
      if(err){
         req.flash('error','error occurred : '+err.message);
         return res.redirect('/driver');
      }
      req.flash('success', 'Ride completed successfully');
      res.redirect('/driver');
   })
});

router.post('/addContactRider', (req,res) => {
   con.query(`select *from contact where userid=${res.app.locals.rider['userid']} and phoneno=${req.body.contact}`, (err,r,f) => {
      if(err){
         console.log(err);
         req.flash('error', err.message);
         return res.redirect('/rider');
      }
      if(r.length === 0){
         con.query(`insert into contact values (${res.app.locals.rider['userid']},${req.body.contact})`, (e,r,f)=>{
            if(e){
               console.log(e);
               req.flash('error', e.message);
               return res.redirect('/rider');
            }
            req.flash('success', 'contact added');
            res.redirect('/rider');
         })
      } else {
         req.flash('error', 'contact already present');
         return res.redirect('/rider');
      }
   })
});

router.post('/addContactDriver', (req,res) => {
   con.query(`select *from contact where userid=${res.app.locals.driver['userid']} and phoneno=${req.body.contact}`, (err,r,f) => {
      if(err){
         console.log(err);
         req.flash('error', err.message);
         return res.redirect('/driver');
      }
      if(r.length === 0){
         con.query(`insert into contact values (${res.app.locals.driver['userid']},${req.body.contact})`, (e,r,f)=>{
            if(e){
               console.log(e);
               req.flash('error', e.message);
               return res.redirect('/driver');
            }
            req.flash('success', 'contact added');
            res.redirect('/driver');
         })
      } else {
         req.flash('error', 'contact already present');
         req.session.save(function () {
            return res.redirect('/driver');
         });
      }
   })
});

router.post('/addMoneyRider', (req,res) => {
   con.query(`insert into payment(walletid,amount,mode) values(${res.app.locals.rider['walletid']},${req.body.amount},'${req.body.method}')`, (e,r,f)=>{
      if(e){
         console.log(e);
         req.flash('error', e.message);
         return res.redirect('/rider');
      }
      req.flash('success', 'money added successfully');
      return res.redirect('/rider');
   });
});

function isRiderLoggedIn(req,res,next) {
   if(req.app.locals.rider){
      return next();
   }
   return res.render('loginrider', {
      error: 'You must login first'
   });
}

function isDriverLoggedIn(req,res,next) {
   if(req.app.locals.driver){
      return next();
   }
   return res.render('logindriver', {
      error: 'You must login first'
   });
}
module.exports = router;