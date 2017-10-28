const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      path           = require('path'),
      flash          = require('connect-flash'),
      db             = require('./db/index'),
      methodOverride = require("method-override");

const indexRoutes = require("./routes/index"),
      ajaxRoutes  = require("./routes/ajax");

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
app.use(ajaxRoutes);

app.listen(7000,function () {
   console.log("server started");
});

