var express = require('express');
var router = express.Router();
var Project = require("../models/project");
var winston = require('../config/winston');
var Project_user = require("../models/project_user");
var operatingHoursService = require("../services/operatingHoursService");
var AnalyticResult = require("../models/analyticResult");
var Department = require("../models/department");
var RoleConstants = require("../models/roleConstants");
var cacheUtil = require('../utils/cacheUtil');

router.get('/load', function(req, res, next) {
  winston.debug(req.projectid);
  
  // https://stackoverflow.com/questions/24258782/node-express-4-middleware-after-routes
  next();      // <=== call next for following middleware 
  // redirect to widget
});

router.get('/', function(req, res, next) {
    winston.debug(req.projectid);


    var availableUsers = function() {
      winston.debug('availableUsers:');
      return new Promise(function (resolve, reject) {
        if (!req.project) {
          return reject({err: "Project Not Found"});
        }
      operatingHoursService.projectIsOpenNow(req.projectid, function (isOpen, err) {    
          winston.debug('isOpen:'+ isOpen);
          if (isOpen) {            
            Project_user.find({ id_project: req.projectid, user_available: true, role: { $in : [RoleConstants.OWNER, RoleConstants.ADMIN, RoleConstants.SUPERVISOR, RoleConstants.AGENT]}, status: "active" }).
              populate('id_user').
              exec(function (err, project_users) {
                winston.debug('project_users:'+ project_users);
                if (project_users) {    
                  user_available_array = [];
                  project_users.forEach(project_user => {
                    if (project_user.id_user) {
                      user_available_array.push({ "id": project_user.id_user._id, "firstname": project_user.id_user.firstname });
                    } else {
                      winston.debug('else:');
                    }
                  });      
                  winston.debug('user_available_array:'+ JSON.stringify(user_available_array));          
                  return resolve(user_available_array);
                }
              });
          } else {          
            return resolve([]);
          }
        });
      });
  };

  var waiting = function() {
    return new Promise(function (resolve, reject) {
      AnalyticResult.aggregate([
        //last 4
        { $match: {"id_project":req.projectid, "createdAt" : { $gte : new Date((new Date().getTime() - (4 * 60 * 60 * 1000))) }} },
        { "$group": { 
          "_id": "$id_project", 
          "waiting_time_avg":{"$avg": "$waiting_time"}
        }
      },
      
    ])
    // .cache(cacheUtil.longTTL, req.projectid+":analytics:query:waiting:avg:4hours")        
    .exec(function(err, result) {
          return resolve(result);
    });
  });
  };

  
  var getIp = function() {
    return new Promise(function (resolve, reject) {
    //  var ip = req.ip;
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
      winston.debug("ip:"+ ip);
      return resolve(ip);
  });
  };

  
  var getDepartments = function(req) {

    return new Promise(function (resolve, reject) {

      var query = { "id_project": req.projectid, "status": 1 };

      winston.debug("req.project:" + JSON.stringify(req.project));
      
      if (req.project) {
                                    //secondo me qui manca un parentesi tonda per gli or
        if (req.project.profile && (req.project.profile.type === 'free' && req.project.trialExpired === true) || (req.project.profile.type === 'payment' && req.project.isActiveSubscription === false)) {
          query.default = true;
        }
  
        winston.debug("query:", query);
  
        Department.find(query).exec(function(err, result) {
              return resolve(result);
        });
      } else {        
          return reject({err: "Project Not Found"});        
      }


    });

  }


  var getProject = function(req) {
    winston.debug('getProject.');

    return new Promise(function (resolve, reject) {

       //@DISABLED_CACHE .cache(cacheUtil.queryTTL, "projects:query:id:status:100:"+req.projectid+":select:-settings")            
      
      Project.findOne({_id: req.projectid, status: 100}).select('-settings -ipFilter -ipFilterEnabled').exec(function(err, project) {
        // not use .lean I need project.trialExpired 

          if (err) {
            return reject({err: "Project Not Found"});        
          }


          winston.debug("project", project);

          // ProjectSetter project not found with id: 62d8cf8b2b10b30013bb9b99
          // Informazioni
          // 2022-07-27 14:32:14.772 CESTerror: Error getting widget. {"err":"Project Not Found"}
          // Informazioni
          // 2022-07-27 14:32:14.778 CESTerror: uncaughtException: Cannot read property 'profile' of null
          // Informazioni
          // 2022-07-27 14:32:14.778 CESTTypeError: Cannot read property 'profile' of null at /usr/src/app/routes/widget.js:132:124 at /usr/src/app/node_modules/mongoose/lib/model.js:5074:18 at processTicksAndRejections (internal/process/task_queues.js:79:11) {"date":"Wed Jul 27 2022 12:32:14 GMT+0000 (Coordinated Universal Time)","error":{},"exception":true,"os":{"loadavg":[0.26,0.51,0.58],"uptime":1028128},"process":{"argv":["/usr/local/bin/node","/usr/src/app/bin/www"],"cwd":"/usr/src/app","execPath":"/usr/local/bin/node","gid":0,"memoryUsage":{"arrayBuffers":128833077,"external":130521753,"heapTotal":110641152,"heapUsed":85605912,"rss":310054912},"pid":26,"uid":0,"version":"v12.22.12"},"stack":"TypeError: Cannot read property 'profile' of null\n at /usr/src/app/routes/widget.js:132:124\n at /usr/src/app/node_modules/mongoose/lib/model.js:5074:18\n at processTicksAndRejections (internal/process/task_queues.js:79:11)","trace":[{"column":124,"file":"/usr/src/app/routes/widget.js","function":null,"line":132,"method":null,"native":false},{"column":18,"file":"/usr/src/app/node_modules/mongoose/lib/model.js","function":null,"line":5074,"method":null,"native":false},{"column":11,"file":"internal/process/task_queues.js","function":"processTicksAndRejections","line":79,"method":null,"native":false}]}

          // console.log("project!=null",project!=null);
          // console.log("project.profile",project.profile);
                                              //secondo me qui manca un parentesi tonda per gli or
          if (project  && project.profile && ((project.profile.type === 'free' && project.trialExpired === true) || (project.profile.type === 'payment' && project.isActiveSubscription === false))) {
            winston.debug('getProject remove poweredBy tag', project);
            project.widget.poweredBy = undefined;
            project.widget.baloonImage = undefined;            
          }

        return resolve(project);
      });        

    });

  }

// TOOD add labels
    Promise.all([

        getProject(req)
      ,
        availableUsers()
      ,
        getDepartments(req)
      ,
        // waiting()unused used 620e87f02e7fda00350ea5a5/publicanalytics/waiting/current
      , 
        getIp()
     

    ]).then(function(all) {
      let result = {project: all[0], user_available: all[1], departments: all[2], waiting: all[3], ip: all[4]};
      res.json(result);
      // https://stackoverflow.com/questions/24258782/node-express-4-middleware-after-routes
      next();      // <=== call next for following middleware 

    }).catch(function(err) {
      winston.error('Error getting widget.', err);
      return res.status(500).send({success: false, msg: 'Error getting widget.'});
    });


  });



  


  

  


module.exports = router;
