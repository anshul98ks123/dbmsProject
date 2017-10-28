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
   res.render('index');
});

router.get('/driver',isDriverLoggedIn, function (req,res) {
   res.render('index');
});

router.get('/login', function (req,res) {
   res.render('login');
});

router.get('/signuprider', function (req,res) {
   res.render('signuprider');
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
                     , function (err,result,fields) {
                        if(err){
                           console.log(err);
                           return res.render('signuprider',{
                              error: 'error occurred' + err.message
                           });
                        }
                        console.log("successful");
                        req.flash('success', 'Successfully signed up as rider');
                        return res.render('signuprider');
                     });
               });
         });
      });
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
                           , function (err,result,fields) {
                              if(err){
                                 console.log(err);
                                 return response.render('signupdriver',{
                                    error: 'error occurred' + err.message
                                 });
                              }
                              console.log("successful");
                              req.flash('success', 'Successfully signed up as driver');
                              return response.render('signupdriver');
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