"use strict";

let apiwrap = require('./apibase').apiwrap;

let assignments = {};

let assignmentsFilter = require('../filters/assignments');
let commons = require('./commons');

assignments.listAll = apiwrap((req, res, gitlab) => {
  return new Promise((resolve, reject) => {
      gitlab.projects.all((projects) => {
        console.log("assignment row: " + JSON.stringify(projects));
        let assignments_ = assignmentsFilter.parseAssignments(projects, true, true);
        console.log("assignment: " + JSON.stringify(assignments_));
        resolve(assignments_);
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

assignments.get = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.projects.show(id, (project) => {
        let assignment_ = assignmentsFilter.parseAssignment(project);
        resolve(assignment_);
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

assignments.remove = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.projects.remove(id, (result) => {
        resolve(result);
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

assignments.submit = apiwrap((req, res, gitlab) => {
  // TODO: should use SHA to refer branch
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
    gitlab.users.current((user) => {
      resolve(user);
    });
  }).then((user) => {
    let branchName = user.email.match(/(\S+)@\S+/)[1];
    let param = {id: 91, projectId: 91, branch_name: branchName, ref: 'master'};
    console.log(param);

    let adminGitlab = require('gitlab')({
      url: commons.server.url,
      token: commons.adminAuthObj.token
    });
    return new Promise((resolve, reject) => {
      adminGitlab.projects.repository.createBranch(param, (result) => {
        resolve(param);
      });
    });
  }).then((param) => {
    return new Promise((resolve, reject) => {
      gitlab.projects.show(id, (project) => {
        param.origin = project.forked_from_project.id;
        resolve(param);
      });
    })
  }).then((param) => {
    return new Promise((resolve, reject) => {
      let branchName = param.branch_name;
      let oid = param.origin;
      gitlab.projects.merge_requests.add(oid, 'HEAD', branchName, 1, `${branchName} submission`, (result) => {
        resolve(result);
      });
    });
  }).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

module.exports = assignments;