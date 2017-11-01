const express  = require("express"),
      con      = require('../db/index'),
      router   = express.Router();

// HOME PAGE
router.get('/', function(req,res){
   con.query("select *from location", function (err, result, fields) {
      if (err) throw err;
      res.render('index', {
         result: result,
         fields: fields
      });
   });
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
         return res.render('rider',{
            error: 'Error in boooking ride' + err.message
         });
      }
      con.query(`insert into ridereq(riderid,pickuplocation,droplocation) 
         values(${results[0]['riderid']},${req.body.loc},${req.body.dest})`, (err,r,f)=>{
         if(err){
            console.log(err);
            return res.render('rider',{
               error: 'Error in boooking ride' + err.message
            });
         }
         return res.render('rider',{
            success: 'Cab Booked by '+ result[0]['name']
         });
      })
   });
});

router.get('/logout', function (req,res) {
   res.app.locals.rider = undefined;
   res.app.locals.driver = undefined;
   con.query("select *from location", function (err, result, fields) {
      if (err) throw err;
      res.render('index', {
         result: result,
         fields: fields,
         success: 'logged out successfully'
      });
   });
});

router.post('/loginrider', function (req,res) {
   con.query("select *from user where userid="+req.body.id, (err,result,fields)=>{
      if(err){
         console.log(err);
         return res.render('signuprider',{
            error: 'error occurred' + err.message
         });
      }
      con.query("select *from rider where userid="+req.body.id, (err,results,fields)=>{
         if(err){
            console.log(err);
            return res.render('signuprider',{
               error: 'error occurred' + err.message
            });
         }
         if(results.length === 0){
            return res.render('signuprider',{
               error: 'user does not exist'
            });
         }
         if(result[0]['password'] === req.body.password){
            req.app.locals.rider = result[0];
            return res.render('rider',{
               success: 'Welcome '+result[0]['name']
            });
         }
         return res.render('loginrider',{
            error: 'incorrect password'
         });
      });
   });
});

router.post('/logindriver', function (req,res) {
   con.query("select *from user where userid="+req.body.id, (err,result,fields)=>{
      if(err){
         console.log(err);
         con.query("select place,zipcode from location", function (err, result, fields) {
            if (err) throw err;
            return res.render('signupdriver', {
               result: result,
               error: 'error occured : ' + err.message
            });
         });
      }
      con.query("select *from driver where userid="+req.body.id, (err,results,fields)=>{
         if(err){
            console.log(err);
            return res.render('signupdriver', {
               result: result,
               error: 'error occured : ' + err.message
            });
         }
         if(results.length === 0){
            return res.render('signupdriver', {
               result: result,
               error: 'user does not exist'
            });
         }
         if(result[0]['password'] === req.body.password){
            req.app.locals.driver = result[0];
            return res.render('driver',{
               success: 'Welcome '+result[0]['name']
            });
         }
         return res.render('logindriver',{
            error: 'incorrect password'
         });
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
   con.query("insert into wallet values()", function (err, result, fields) {
      if (err){
         console.log(err);
         return res.render('signuprider',{
            error: 'error occurred' + err.message
         });
      }
      con.query("select max(walletid) as max from wallet", (err, result, fields)=>{
         if(err){
            console.log(err);
            return res.render('signuprider',{
               error: 'error occurred' + err.message
            });
         }
         con.query("insert into user (name,password,email,walletid) values('"
            + req.body.name + "','" + req.body.password + "','"
            + req.body.email + "',"+ (result[0]['max']) +")", function (err,result,fields) {
            if(err){
               console.log(err);
               return res.render('signuprider',{
                  error: 'error occurred' + err.message
               });
            }
            con.query("select max(userid) as max from user"
               , function (err,result,fields) {
                  if(err){
                     console.log(err);
                     return res.render('signuprider',{
                        error: 'error occurred' + err.message
                     });
                  }
                  con.query("insert into rider (userid,dob) values("+ result[0]['max']+",'"+req.body.date+"')"
                     , function (err,resultss,fields) {
                        if(err){
                           console.log(err);
                           return res.render('signuprider',{
                              error: 'error occurred' + err.message
                           });
                        }
                        console.log("successful");
                        return res.render('loginrider',{
                           success: 'Successfully signed up as rider with userid = ' + result[0]['max']+"" +
                           "\n remember this userid you will need it for loggin in to your account"
                        });
                     });
               });
         });
      });
   });
});

router.post('/query', function (req,response) {
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
   con.query("insert into wallet values()", function (err, result, fields) {
      if (err){
         console.log(err);
         return response.render('signupdriver',{
            error: 'error occurred' + err.message
         });
      }
      con.query("select max(walletid) as max from wallet", (err, result, fields)=>{
         if(err){
            console.log(err);
            return response.render('signupdriver',{
               error: 'error occurred' + err.message
            });
         }
         con.query("insert into user (name,password,email,walletid) values('"
            + req.body.name + "','" + req.body.password + "','"
            + req.body.email + "',"+ (result[0]['max']) +")", function (err,result,fields) {
            if(err){
               console.log(err);
               return response.render('signupdriver',{
                  error: 'error occurred' + err.message
               });
            }
            con.query("insert into taxi(type,model_name,color,manufacturer)" +
               " values('"+req.body.type+"','"+req.body.model+"','" +
               req.body.color+"','"+req.body.man+"')", (err, result, fields) => {
               if(err){
                  console.log(err);
                  return response.render('signupdriver',{
                     error: 'error occurred' + err.message
                  });
               }
               con.query("select max(taxiid) as max from taxi", (err,res,fields) => {
                  if(err){
                     console.log(err);
                     return response.render('signupdriver',{
                        error: 'error occurred' + err.message
                     });
                  }
                  taxiid = res[0]['max'];
                  con.query("select max(userid) as max from user"
                     , function (err,result,fields) {
                        if(err){
                           console.log(err);
                           return response.render('signupdriver',{
                              error: 'error occurred' + err.message
                           });
                        }
                        userid = result[0]['max'];
                        con.query("insert into driver (userid,dob,licenseno,taxiid,location) " +
                           "values("+ userid+",'"+req.body.date+"','" +
                           req.body.license + "',"+ taxiid + ","+ req.body.loc+")"
                           , function (err,resultss,fields) {
                              if(err){
                                 console.log(err);
                                 return response.render('signupdriver',{
                                    error: 'error occurred' + err.message
                                 });
                              }
                              console.log("successful");
                              req.flash('success', );
                              return response.render('logindriver',{
                                 success: 'Successfully signed up as driver with userid = ' + result['0']['max']+"" +
                                 "\n remember this userid you will need it for loggin in to your account"
                              });
                           });
                     });
               })
            });
         });
      });
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