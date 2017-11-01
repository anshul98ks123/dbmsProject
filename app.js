const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      path           = require('path'),
      flash          = require('connect-flash'),
      cookieParser   = require('cookie-parser'),
      methodOverride = require("method-override");

const indexRoutes = require("./routes/index"),
      ajaxRoutes  = require("./routes/ajax");

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(cookieParser('keyboard cat'));
app.use(require("express-session")({
   secret: 'keyboard cat',
   resave: false,
   saveUninitialized: false
}));
app.use(flash());
app.use(function(req,res,next){
   res.locals.error = req.flash('error');
   res.locals.success = req.flash('success');
   next();
});
app.use(indexRoutes);
app.use(ajaxRoutes);

app.listen(7000,function () {
   console.log("server started");
});

