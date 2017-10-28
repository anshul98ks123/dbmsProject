const express  = require("express"),
   con      = require('../db/index'),
   router   = express.Router();

router.get('/getWalletDetailsRider', (req,res) => {
   con.query("select balance from wallet where walletid="+res.app.locals.rider['userid'],
      (err,results,fields)=>{
      console.log(results[0]['balance']);
      res.status(200).send(results[0]['balance'].toString());
   });
});

router.get('/getWalletDetailsDriver', (req,res) => {
   con.query("select balance from wallet where walletid="+res.app.locals.driver['userid'],
      (err,results,fields)=>{
         console.log(results[0]['balance']);
         res.status(200).send(results[0]['balance'].toString());
      });
});

router.get('/gettransactionsRider', (req,res) => {
   con.query("select mode,amount from payment where walletid="+res.app.locals.rider['userid'],
      (err,results,fields)=>{
         res.status(200).send(results.toString());
      });
});

router.get('/getLocations', (req,res) => {
   con.query("select *from location", function (err, result, fields) {
      res.send(result);
   });
});
module.exports = router;