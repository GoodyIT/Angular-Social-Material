/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');

var _ = require('lodash');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');


/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var crmController = require('./controllers/crm');
var contactController = require('./controllers/contact');
var redirectController = require('./controllers/redirect');

/**
 * API keys and Passport configuration.
 */
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

var util = require('util');

/**
 * Connect to MongoDB.
 */
mongoose.connect(secrets.db);
console.log(secrets.db);
mongoose.connection.on('error', function () {
  console.log(
    'MongoDB Connection Error. Please make sure that MongoDB is running.'
  );
  process.exit(1);
});

console.log("process.env settings:");
console.log(process.env);

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  sourceMap: true,
  outputStyle: 'expanded'
}));
/* Must above passport no avoid user deserialization call */
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000
}));

app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'fpfavicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function (req, res, next) {
  if(/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});



/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/landing', homeController.landing);
app.get('/login', userController.getLogin);
app.get('/loginForm', userController.getLoginForm);
app.post('/login', userController.postLogin);
app.get('/userDetails/:id', userController.getUserDetails);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:userId/:token', userController.getReset);
app.post('/reset/:userId/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated,
  userController.getOauthUnlink);
// app.patch('/account/campaigns', userController.patchUpdateCampaigns);
app.patch('/account/profile', userController.patchUpdateProfile);
app.get('/extendFbToken/:token', userController.extendFbToken);
app.get('/userFacebookPagesInsight/:userId/(:pageId)?', userController.getUserPages);
app.get('/userYoutubeChannelAudit/:userId', userController.getUserYoutubeAudit);
app.get('/userInstagramAudit/:userId', userController.getUserInstagramAudit);
app.get('/userFacebookInsight/:userId/(:postId)?', userController.getUserFacebookInsight);
app.get("/userTweetInsight/:tweetId", userController.getTweetInsight);
app.post("/sessionUserType", userController.setSessionUserType);
app.get("/sessionUserType", userController.getSessionUserType);
app.get("/emailExisted/:email/:userId", userController.getEmailExisted);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.post('/api/schedulepost', apiController.scheduleFacebookPost);
app.post('/api/scheduleFacebookPosts', apiController.schedulePostsForApplication);
app.get('/api/lambdaEndpoint', apiController.getLambdaUrl);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getLinkedin);
app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized,
  apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);
app.post('/crm/createOrg', crmController.createOrgApi);
app.post('/crm/createPerson', crmController.createPersonApi);
app.post('/crm/createDeal', crmController.createDealApi);
app.put('/crm/updateDeal', crmController.updateDealApi);
app.post('/crm/createCelebDeal', crmController.createCelebrityApi);
app.post('/crm/createPersonDealFilter', crmController.createPersonDealFilter);
app.get('/crm/deals/:filterId', crmController.getDealsByFilter);
app.post('/crm/postFeedback', crmController.createFeedback);


/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram', {
  scope: ['basic', 'public_content', 'follower_list'],
}));
app.get('/auth/instagram/callback', passport.authenticate('instagram', {
  failureRedirect: '/app.html'
}), function (req, res) {
  res.redirect("/app.html");
});
app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email', 'user_location', 'read_insights', 'pages_show_list',
    'public_profile', 'manage_pages', "ads_management", "ads_read"]
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/app.html'
  }), function (req, res) {
    res.redirect("/app.html#/campaign");
  },
  // on error
  function (err, req, res, next) {
    res.redirect('/login');
  });
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', {
  failureRedirect: '/app.html'
}), function (req, res) {
  res.redirect("/app.html");
});
app.get('/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/yt-analytics-monetary.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
    'https://www.googleapis.com/auth/youtubepartner-channel-audit',
    'https://www.googleapis.com/auth/youtubepartner',
    'https://www.googleapis.com/auth/userinfo.profile',
    'email'],
  accessType: 'offline',
  approvalPrompt: 'force'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/app.html'
}), function (req, res) {
  res.redirect("/app.html#/campaign");
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect: '/app.html'
}), function (req, res) {
  res.redirect("/app.html#/campaign");
});
app.get('/auth/linkedin', passport.authenticate('linkedin', {
  state: 'SOME STATE'
}));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect: '/app.html'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', {
  failureRedirect: '/api'
}), function (req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', {
  failureRedirect: '/api'
}), function (req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', {
  scope: 'make_payments access_profile access_balance access_email access_phone'
}));
app.get('/auth/venmo/callback', passport.authorize('venmo', {
  failureRedirect: '/api'
}), function (req, res) {
  res.redirect('/api/venmo');
});
app.get('/auth/steam', passport.authorize('openid', {
  state: 'SOME STATE'
}));
app.get('/auth/steam/callback', passport.authorize('openid', {
  failureRedirect: '/login'
}), function (req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 *  Rockstars custom
 */
app.post('/api/facebook/feed', apiController.postFeedFacebook);


/**
 *  Redirect page
 */
app.get('/s', redirectController.redirect);

/**
 * Error Handler.
 */
app.use(errorHandler());

console.log("Facebook callback url: " + (process.env.FACEBOOK_CALLBACK_URL ||
  '/auth/facebook/callback'));

/**
 * Start Express server.
 */
app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get(
    'port'), app.get('env'));
});

var jobs = require("./jobs");
module.exports = app;
