let mysql = require('mysql');

let con = mysql.createConnection({
   host: "localhost",
   user: "dbms_project",
   password: "password",
   database: "dbmsv2"
});

con.connect(function(err) {
   if (err) throw err;
   console.log("db connected");
});

module.exports = con;
