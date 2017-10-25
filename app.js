const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      path           = require('path'),
      flash          = require('connect-flash'),
      db             = require('./db/index'),
      methodOverride = require("method-override");

const indexRoutes = require("./routes/index");

app.use(flash());
app.use(require("express-session")({
   secret: 'I am the best',
   resave: false,
   saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(indexRoutes);

app.listen(8000,function () {
   console.log("server started");
});

