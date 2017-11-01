const express  = require("express"),
   con      = require('../db/index'),
   router   = express.Router();

router.get('/getWalletDetailsRider', (req,res) => {
   con.query("select balance from wallet where walletid="+res.app.locals.rider['walletid'],
      (err,results,fields)=>{
      res.status(200).send(results[0]['balance'].toString());
   });
});

router.get('/getWalletDetailsDriver', (req,res) => {
   con.query("select balance from wallet where walletid="+res.app.locals.driver['walletid'],
      (err,results,fields)=>{
         res.status(200).send(results[0]['balance'].toString());
      });
});

router.get('/gettransactionsRider', (req,res) => {
   con.query("select mode,amount from payment where walletid="+res.app.locals.rider['walletid'],
      (err,results,fields)=>{
         res.status(200).send(results);
      });
});

router.get('/gettransactionsDriver', (req,res) => {
   con.query("select mode,amount from payment where walletid="+res.app.locals.driver['walletid'],
      (err,results,fields)=>{
         res.status(200).send(results);
      });
});

router.get('/getPastRidesRider', (req,res) => {
   con.query(`select riderid from rider where userid=${res.app.locals.rider['userid']}`, (e,r,f) => {
      con.query(`select pickuplocation,droplocation,fare from ride natural join ridereq where riderid=${r[0]['riderid']}`,(e,result,field)=>{
         res.status(200).send(result);
      });
   })
});

router.get('/getPastRidesDriver', (req,res) => {
   con.query(`select driverid from driver where userid=${res.app.locals.driver['userid']}`, (e,r,f) => {
      con.query(`select pickuplocation,droplocation,fare from ride natural join ridereq where driverid=${r[0]['driverid']}`,(e,result,field)=>{
         res.status(200).send(result);
      });
   })
});

router.get('/getPlaceName', (req,res) => {
   con.query(`select place from location where zipcode=${req.query.pickup}`, (e1,r1,f)=>{
      con.query(`select place from location where zipcode=${req.query.drop}`, (e2,r2,f)=>{
         res.status(200).send({
            p1: r1[0]['place'],
            p2: r2[0]['place']
         });
      });
   })
});

router.get('/gettransactionsDriver', (req,res) => {
   con.query("select mode,amount from payment where walletid="+res.app.locals.driver['walletid'],
      (err,results,fields)=>{
         res.status(200).send(results.toString());
      });
});

router.get('/acceptButton', (req,res) => {
   con.query(`select status from driver where userid=${res.app.locals.driver['userid']}`, (err,result,fields)=>{
      if(result[0]['status'] === "Assigned"){
         res.status(200).send(true);
      } else {
         res.status(200).send(false);
      }
   })
});

router.get('/getLocations', (req,res) => {
   con.query("select *from location", function (err, result, fields) {
      res.send(result);
   });
});

router.get('/getRiderContacts', (req,res) => {
   con.query(`select phoneno from contact where userid=${res.app.locals.rider['userid']}`,(err,r,f)=>{
      res.status(200).send(r);
   });
});

router.get('/getDriverContacts', (req,res) => {
   con.query(`select phoneno from contact where userid=${res.app.locals.driver['userid']}`,(err,r,f)=>{
      res.status(200).send(r);
   });
});

router.get('/isRiding', (req,res) => {
   con.query(`select riderid from rider where userid=${res.app.locals.rider['userid']}`, (e,r,f) => {
      con.query(`select pickuplocation,droplocation,fare from ride natural join ridereq where riderid=${r[0]['riderid']} and status='In Progress'`,(e,result,field)=>{
         res.status(200).send(result);
      });
   })
});

module.exports = router;