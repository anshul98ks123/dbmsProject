let mysql = require('mysql');

let con = mysql.createConnection({
   host: "localhost",
   user: "dbms",
   password: "password",
   database: "dbms"
});

con.connect(function(err) {
   if (err) throw err;
   console.log("db connected");
});

module.exports = con;
