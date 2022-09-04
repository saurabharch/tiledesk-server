var dotenvPath = undefined;

if (process.env.DOTENV_PATH) {
  dotenvPath = process.env.DOTENV_PATH;
  console.log("load dotenv form DOTENV_PATH", dotenvPath);
}

if (process.env.LOAD_DOTENV_SUBFOLDER ) {
  console.log("load dotenv form LOAD_DOTENV_SUBFOLDER");
  dotenvPath = __dirname+'/confenv/.env';
}

require('dotenv').config({ path: dotenvPath});


var express = require('express');
var path = require('path');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var passport = require('passport');
require('./middleware/passport')(passport);

var config = require('./config/database');
var cors = require('cors');
var Project = require("./models/project");
var validtoken = require('./middleware/valid-token');
var roleChecker = require('./middleware/has-role');
const MaskData = require("maskdata");
var winston = require('./config/winston');

// https://bretkikehara.wordpress.com/2013/05/02/nodejs-creating-your-first-global-module/
var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI || config.database;

if (!databaseUri) { //TODO??
  winston.warn('DATABASE_URI not specified, falling back to localhost.');
}

if (process.env.NODE_ENV == 'test')  {
  databaseUri = config.databasetest;
}

const masked_databaseUri = MaskData.maskPhone(databaseUri, {
        maskWith : "*",
        unmaskedStartDigits: 15, 
        unmaskedEndDigits: 5
      });

if (process.env.DISABLE_MONGO_PASSWORD_MASK ==true || process.env.DISABLE_MONGO_PASSWORD_MASK == "true")  {
  winston.info("DatabaseUri: " + databaseUri);
}else {
  winston.info("DatabaseUri: " + masked_databaseUri);
}


var autoIndex = true;
if (process.env.MONGOOSE_AUTOINDEX) {
  autoIndex = process.env.MONGOOSE_AUTOINDEX;
}

winston.info("DB AutoIndex: " + autoIndex);

var connection = mongoose.connect(databaseUri, { "useNewUrlParser": true, "autoIndex": autoIndex }, function(err) {
  if (err) { 
    winston.error('Failed to connect to MongoDB on ' + databaseUri + " ", err);
    process.exit(1);
  }
});
if (process.env.MONGOOSE_DEBUG==="true") {
  mongoose.set('debug', true);
}
mongoose.set('useFindAndModify', false); // https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', false); 

// ROUTES *//

var auth = require('./routes/auth');
var authtest = require('./routes/authtest');
var authtestWithRoleCheck = require('./routes/authtestWithRoleCheck');

var lead = require('./routes/lead');
var message = require('./routes/message');
var messagesRootRoute = require('./routes/messagesRoot');
var department = require('./routes/department');
var group = require('./routes/group');
var resthook = require('./routes/subscription');
var tag = require('./routes/tag');
var faq = require('./routes/faq');
var faq_kb = require('./routes/faq_kb');
var project = require('./routes/project');
var project_user = require('./routes/project_user');
var request = require('./routes/request');
// var setting = require('./routes/setting');
var users = require('./routes/users');
var publicRequest = require('./routes/public-request');
var userRequest = require('./routes/user-request');
var publicAnalytics = require('./routes/public-analytics');
var pendinginvitation = require('./routes/pending-invitation');
var jwtroute = require('./routes/jwt');
var key = require('./routes/key');
var widgets = require('./routes/widget');
var widgetsLoader = require('./routes/widgetLoader');

// var admin = require('./routes/admin');
var faqpub = require('./routes/faqpub');
var labels = require('./routes/labels');
var fetchLabels = require('./middleware/fetchLabels');
var cacheUtil = require("./utils/cacheUtil");
var orgUtil = require("./utils/orgUtil");
var images = require('./routes/images');
var files = require('./routes/files');
var campaigns = require('./routes/campaigns');
var logs = require('./routes/logs');
var requestUtilRoot = require('./routes/requestUtilRoot');
var urls = require('./routes/urls');
var email = require('./routes/email');
// ROUTES *//

// SERVICES *//
var bootDataLoader = require('./services/bootDataLoader');
var settingDataLoader = require('./services/settingDataLoader');
var schemaMigrationService = require('./services/schemaMigrationService');
var RouterLogger = require('./models/routerLogger');

require('./services/mongoose-cache-fn')(mongoose);

var subscriptionNotifier = require('./services/subscriptionNotifier');
subscriptionNotifier.start();

var botSubscriptionNotifier = require('./services/BotSubscriptionNotifier');
botSubscriptionNotifier.start();
 

var geoService = require('./services/geoService');
geoService.listen();

var faqBotHandler = require('./services/faqBotHandler');
faqBotHandler.listen();
var BanUserNotifier = require('./services/banUserNotifier');
BanUserNotifier.listen();

var modulesManager = undefined;
try {
  modulesManager = require('./services/modulesManager');
  modulesManager.init({express:express, mongoose:mongoose, passport:passport, routes: {departmentsRoute: department, projectsRoute: project, widgetsRoute: widgets} });
} catch(err) {
  winston.info("ModulesManager not present");
}

// SERVICES END *//

// SUBMODULES *//
var pubModulesManager = require('./pubmodules/pubModulesManager');
pubModulesManager.init({express:express, mongoose:mongoose, passport:passport, databaseUri:databaseUri, routes:{}});

//enterprise modules can modify pubmodule
modulesManager.start();

pubModulesManager.start();


settingDataLoader.save();
schemaMigrationService.checkSchemaMigration();

// SUBMODULES END *//


// MIDDLEWARE *//
var IPFilter = require('./middleware/ipFilter');
// MIDDLEWARE END*//

// CHANNELS *//
var channelManager = require('./channels/channelManager');
channelManager.listen(); 
// CHANNELS END*//


if (process.env.CREATE_INITIAL_DATA !== "false") {
   bootDataLoader.create();
}




var app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// TODO DELETE IT IN THE NEXT RELEASE
if (process.env.ENABLE_ALTERNATIVE_CORS_MIDDLEWARE === "true") {  
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //qui dice cequens attento
    // var request_cors_header = req.headers[""]
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-xsrf-token");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
  });

  winston.info("Enabled alternative cors middleware");
} else {
  winston.info("Used standard cors middleware");
}


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(morgan('dev'));
// app.use(morgan('combined'));



// app.use(bodyParser.json());

// https://stackoverflow.com/questions/18710225/node-js-get-raw-request-body-using-express

app.use(bodyParser.json({
  verify: function (req, res, buf) {
    // var url = req.originalUrl;
    // if (url.indexOf('/stripe/')) {
      req.rawBody = buf.toString();
      winston.debug("bodyParser verify stripe", req.rawBody);
    // } 
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//app.use(morgan('dev'));

if (process.env.ENABLE_ACCESSLOG) {
  app.use(morgan('combined', { stream: winston.stream }));
}

app.use(passport.initialize());


//ATTENTION. If you use AWS Api Gateway you need also to configure the cors policy https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors-console.html
app.use(cors());
app.options('*', cors());

// const customRedisRateLimiter = require("./rateLimiter").customRedisRateLimiter;
// app.use(customRedisRateLimiter);

if (process.env.ROUTELOGGER_ENABLED==="true") {
  winston.info("RouterLogger enabled ");
  app.use(function (req, res, next) {
    // winston.error("log ", req);

      try {
        var projectid = req.projectid;
        winston.debug("RouterLogger projectIdSetter projectid:" + projectid);

      var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      winston.debug("fullUrl:"+ fullUrl);
      winston.debug(" req.get('host'):"+  req.get('host'));
     
      winston.debug("req.get('origin'):" + req.get('origin'));
      winston.debug("req.get('referer'):" + req.get('referer'));

      var routerLogger = new RouterLogger({
        origin: req.get('origin'),
        fullurl: fullUrl,    
        url: req.originalUrl.split("?").shift(),    
        id_project: projectid,      
      });

      routerLogger.save(function (err, savedRouterLogger) {        
        if (err) {
          winston.error('Error saving RouterLogger ', err);
        }
        winston.debug("RouterLogger saved "+ savedRouterLogger);
        next();
      });
      }catch(e) {
        winston.error('Error saving RouterLogger ', e);
        next();
      }
  });

} else {
  winston.info("RouterLogger disabled ");
}

app.get('/', function (req, res) {  
  res.send('Hello from Tiledesk server. It\'s UP. See the documentation here http://developer.tiledesk.com');
});

  


var projectIdSetter = function (req, res, next) {
  var projectid = req.params.projectid;
  winston.debug("projectIdSetter projectid: "+ projectid);

  // if (projectid) {
    req.projectid = projectid;
  // }
  
  next();
};




var projectSetter = function (req, res, next) {
  var projectid = req.params.projectid;
  winston.debug("projectSetter projectid:" + projectid);

  if (projectid) {
    Project.findOne({_id: projectid, status: 100})
      //@DISABLED_CACHE .cache(cacheUtil.defaultTTL, "projects:id:"+projectid)
      .exec(function(err, project){
      if (err) {
        winston.warn("Problem getting project with id: " + projectid + " req.originalUrl:  " + req.originalUrl);
      }

      winston.debug("projectSetter project:" + project);
      if (!project) {
        winston.warn("ProjectSetter project not found with id: " + projectid);
        next();
      } else {
        req.project = project;
        next(); //call next one time for projectSetter function
      }
    
    });
  
  }else {
    next();
  }
  

};




// app.use('/admin', admin);

//oauth2
// app.get('/dialog/authorize', oauth2.authorization);
// app.post('/dialog/authorize/decision', oauth2.decision);
// app.post('/oauth/token', oauth2.token);


// const ips = ['::1'];

app.use('/auth', auth);
app.use('/widgets', widgetsLoader);
app.use('/w', widgetsLoader);

app.use('/images', images);
app.use('/files', files);
app.use('/urls', urls);
app.use('/projects',project);

app.use('/testauth', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], authtest);

app.use('/users', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], users);
app.use('/logs', logs);
app.use('/requests_util', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], requestUtilRoot);

// TODO security issues
if (process.env.DISABLE_TRANSCRIPT_VIEW_PAGE ) {
  winston.info(" Transcript view page is disabled");
}else {
  app.use('/public/requests', publicRequest);
}

// project internal auth check. TODO check security issues?

channelManager.use(app);

if (pubModulesManager) {
  pubModulesManager.use(app);
  pubModulesManager.useUnderProjects(app);
}

if (modulesManager) {
  modulesManager.use(app);
  modulesManager.useUnderProjects(app);
}


app.use('/:projectid/', [projectIdSetter, projectSetter, IPFilter.projectIpFilter, IPFilter.projectIpFilterDeny, IPFilter.decodeJwt, IPFilter.projectBanUserFilter]);

app.use('/:projectid/authtestWithRoleCheck', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken], authtestWithRoleCheck);

app.use('/:projectid/leads', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], lead);
app.use('/:projectid/requests/:request_id/messages', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes(null, ['bot','subscription'])] , message);

app.use('/:projectid/messages', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])] , messagesRootRoute);

// department internal auth check
app.use('/:projectid/departments', department);





channelManager.useUnderProjects(app);

app.use('/:projectid/groups', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], group);
app.use('/:projectid/tags', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], tag);
app.use('/:projectid/subscriptions', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('admin')], resthook);

//deprecated
app.use('/:projectid/faq', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], faq);
app.use('/:projectid/intents', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], faq);

//Deprecated??
app.use('/:projectid/faqpub', faqpub);

//deprecated
app.use('/:projectid/faq_kb', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], faq_kb);
app.use('/:projectid/bots', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], faq_kb);



// app.use('/settings',setting);

app.use('/:projectid/widgets', widgets);

// non mettere ad admin perchà la dashboard  richiama il servizio router.get('/:user_id/:project_id') spesso
// TOOD security issues. internal route check 
// app.use('/:projectid/project_users', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], project_user);
app.use('/:projectid/project_users', project_user);

// app.use('/:projectid/project_users', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], project_user);

app.use('/:projectid/requests', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('guest', ['bot','subscription'])], userRequest);

app.use('/:projectid/requests', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRoleOrTypes('agent', ['bot','subscription'])], request);


app.use('/:projectid/publicanalytics', publicAnalytics);

app.use('/:projectid/keys', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], key);

//TODO deprecated?
app.use('/:projectid/jwt', jwtroute);


app.use('/:projectid/pendinginvitations', [passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], pendinginvitation);
app.use('/:projectid/labels', [fetchLabels],labels);

app.use('/:projectid/campaigns',[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('agent')], campaigns);

app.use('/:projectid/emails',[passport.authenticate(['basic', 'jwt'], { session: false }), validtoken, roleChecker.hasRole('owner')], email);



 
  
// REENABLEIT
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

/*
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/









// error handler
app.use((err, req, res, next) => {

  winston.debug("err.name", err.name);
  if (err.name === "IpDeniedError") {
    winston.info("IpDeniedError");
    return res.status(401).json({ err: "error ip filter" });
  } 

  winston.error("General error", err);
  return res.status(500).json({ err: "error" });
});




module.exports = app;
