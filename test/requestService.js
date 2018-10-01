//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// require('./controllers/todo.controller.test.js');

var chai = require("chai");
chai.config.includeStack = true;

var expect = chai.expect;
var assert = require('chai').assert;
var config = require('../config/database');
var mongoose = require('mongoose');

// var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
// if (!databaseUri) {
//   console.log('DATABASE_URI not specified, falling back to localhost.');
// }

// mongoose.connect(databaseUri || config.database);
mongoose.connect(config.databasetest);

var requestService = require('../services/requestService');
var messageService = require('../services/messageService');
var projectService = require('../services/projectService');
var departmentService = require('../services/departmentService');

var Request = require("../models/request");

describe('RequestService()', function () {

  var userid = "5badfe5d553d1844ad654072";

  it('createWithId', function (done) {
    // this.timeout(10000);

     projectService.create("createWithId", userid).then(function(savedProject) {
      // createWithId(request_id, requester_id, requester_fullname, id_project, first_text, departmentid, sourcePage, language, userAgent, status) {
       requestService.createWithId("request_id1", "requester_id1", "requester_fullname1", savedProject._id, "first_text").then(function(savedRequest) {
          console.log("test resolve");
          expect(savedRequest.request_id).to.equal("request_id1");
          expect(savedRequest.requester_id).to.equal("requester_id1");
          expect(savedRequest.requester_fullname).to.equal("requester_fullname1");
          expect(savedRequest.first_text).to.equal("first_text");
          expect(savedRequest.agents).to.have.lengthOf(1);
          expect(savedRequest.status).to.equal(200);
          expect(savedRequest.participants).to.contains(userid);
          
          // console.log("savedProject._id", savedProject._id, typeof savedProject._id);
          // console.log("savedRequest.id_project", savedRequest.id_project, typeof savedRequest.id_project);

          expect(savedRequest.id_project).to.equal(savedProject._id.toString());

          // aiuto
          // expect(savedRequest.department).to.equal("requester_id1");
          done();
        }).catch(function(err) {
            console.log("test reject");
            assert.isNotOk(err,'Promise error');
            done();
        });
    });

  });




  it('createWithIdWithPooledDepartment', function (done) {
    // this.timeout(10000);

     projectService.create("createWithIdWithPooledDepartment", userid).then(function(savedProject) {
      departmentService.create("PooledDepartment-for-createWithIdWith", savedProject._id, 'pooled', userid).then(function(createdDepartment) {
      // createWithId(request_id, requester_id, requester_fullname, id_project, first_text, departmentid, sourcePage, language, userAgent, status) {
       requestService.createWithId("request_id1", "requester_id1", "requester_fullname1", savedProject._id, "first_text", createdDepartment._id).then(function(savedRequest) {
          console.log("resolve savedRequest");
          expect(savedRequest.request_id).to.equal("request_id1");
          expect(savedRequest.requester_id).to.equal("requester_id1");
          expect(savedRequest.requester_fullname).to.equal("requester_fullname1");
          expect(savedRequest.first_text).to.equal("first_text");
          expect(savedRequest.agents).to.have.lengthOf(1);
          expect(savedRequest.status).to.equal(100);
          expect(savedRequest.participants).to.have.lengthOf(0);          
          expect(savedRequest.id_project).to.equal(savedProject._id.toString());
          expect(savedRequest.department.toString()).to.equal(createdDepartment._id.toString());
          done();
        }).catch(function(err) {
            console.log("test reject");
            assert.isNotOk(err,'Promise error');
            done();
        });
    });
  });
  });

 


  it('closeRequest', function (done) {

      projectService.create("test1", userid).then(function(savedProject) {
        requestService.createWithId("request_id-closeRequest", "requester_id1", "requester_fullname1", savedProject._id, "first_text").then(function(savedRequest) {
          Promise.all([
            messageService.create("5badfe5d553d1844ad654072", "test sender", savedRequest.request_id, "test recipient fullname", "hello1",
            savedProject._id, "5badfe5d553d1844ad654072"),
            messageService.create("5badfe5d553d1844ad654072", "test sender", savedRequest.request_id, "test recipient fullname", "hello2",
            savedProject._id, "5badfe5d553d1844ad654072")]).then(function(all) {
              requestService.closeRequestByRequestId(savedRequest.request_id, savedProject._id).then(function(closedRequest) {
                    console.log("resolve closedRequest", closedRequest);
                    expect(closedRequest.status).to.equal(1000);
                    expect(closedRequest.closed_at).to.not.equal(null);
                    expect(closedRequest.transcript).to.contains("hello1");
                    expect(closedRequest.transcript).to.contains("hello2");
                    done();                         
                  }).catch(function(err){
                    console.error("test reject", err);
                    assert.isNotOk(err,'Promise error');
                    done();
                  });
              });
          });
    });
  });




  it('reopenRequest', function (done) {

    projectService.create("test1", userid).then(function(savedProject) {
      requestService.createWithId("request_id-reopenRequest", "requester_id1", "requester_fullname1", savedProject._id, "first_text").then(function(savedRequest) {
        
            requestService.closeRequestByRequestId(savedRequest.request_id, savedProject._id).then(function(closedRequest) {
              requestService.reopenRequestByRequestId(savedRequest.request_id, savedProject._id).then(function(reopenedRequest) {
                
                  console.log("resolve reopenedRequest", reopenedRequest);

                  //check closedRequest
                  expect(closedRequest.status).to.equal(1000);
                  expect(closedRequest.closed_at).to.not.equal(null);      
                  expect(closedRequest.participants).to.have.lengthOf(1);          

                  //check reopenedRequest
                  expect(reopenedRequest.status).to.equal(200);
                  expect(reopenedRequest.closed_at).to.not.equal(null);      
                  expect(reopenedRequest.participants).to.have.lengthOf(1);          
                  
          
                  done();                         
                }).catch(function(err){
                  console.error("test reject", err);
                  assert.isNotOk(err,'Promise error');
                  done();
                });
            });
          });   
  });
});



  it('addparticipant', function (done) {

  projectService.create("addparticipant-project", userid).then(function(savedProject) {
    // createWithId(request_id, requester_id, requester_fullname, id_project, first_text, departmentid, sourcePage, language, userAgent, status) {
     requestService.createWithId("request_id1", "requester_id1", "requester_fullname1", savedProject._id, "first_text").then(function(savedRequest) {
       var member = 'agent1';
       requestService.addParticipantByRequestId(savedRequest.request_id, savedProject._id, member).then(function(savedRequestParticipant) {
        console.log("resolve", savedRequestParticipant);
        expect(savedRequestParticipant.request_id).to.equal("request_id1");
        expect(savedRequestParticipant.requester_id).to.equal("requester_id1");
        expect(savedRequestParticipant.requester_fullname).to.equal("requester_fullname1");
        expect(savedRequestParticipant.first_text).to.equal("first_text");
        expect(savedRequestParticipant.agents).to.have.lengthOf(1);
        expect(savedRequestParticipant.status).to.equal(200);
        expect(savedRequestParticipant.participants).to.have.lengthOf(2);
        expect(savedRequestParticipant.participants).to.contains(userid);
        expect(savedRequestParticipant.participants).to.contains(member);
        expect(savedRequestParticipant.id_project).to.equal(savedProject._id.toString());

        done();
      }).catch(function(err) {
          console.log("test reject");
          assert.isNotOk(err,'Promise error');
          done();
      });
    });
  });
});





it('removeparticipant', function (done) {

  projectService.create("removeparticipant-project", userid).then(function(savedProject) {
    // createWithId(request_id, requester_id, requester_fullname, id_project, first_text, departmentid, sourcePage, language, userAgent, status) {
     requestService.createWithId("request_id1", "requester_id1", "requester_fullname1", savedProject._id, "first_text").then(function(savedRequest) {
       requestService.removeParticipantByRequestId(savedRequest.request_id, savedProject._id, userid).then(function(savedRequestParticipant) {
        console.log("resolve", savedRequestParticipant);
        
        //savedRequest is assigned -> 200
        expect(savedRequest.status).to.equal(200);

        //savedRequestParticipant is unserved -> 100
        expect(savedRequestParticipant.request_id).to.equal("request_id1");
        expect(savedRequestParticipant.requester_id).to.equal("requester_id1");
        expect(savedRequestParticipant.requester_fullname).to.equal("requester_fullname1");
        expect(savedRequestParticipant.first_text).to.equal("first_text");
        expect(savedRequestParticipant.agents).to.have.lengthOf(1);
        expect(savedRequestParticipant.status).to.equal(100);
        expect(savedRequestParticipant.participants).to.have.lengthOf(0);
        expect(savedRequestParticipant.id_project).to.equal(savedProject._id.toString());
        
        done();
      }).catch(function(err) {
          console.log("test reject");
          assert.isNotOk(err,'Promise error');
          done();
      });
    });
  });
});



});