"use strict";

let apiwrap = require('./apibase').apiwrap;

let classes = {};

let assignmentsFilter = require('../filters/assignments');
let classesFilter = require('../filters/classes');
let materialsFilter = require('../filters/materials');
let membersFilter = require('../filters/members');
let noticesFilter = require('../filters/notices');
let activitiesFilter = require('../filters/activities');

classes.listAll = apiwrap((req, res, gitlab) => {
  return new Promise((resolve, reject) => {
      gitlab.groups.all((groups) => {
        console.log(groups);
        resolve(classesFilter.parseClasses(groups));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.get = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.show(id, function (group) {
        console.log(group);
        resolve(classesFilter.parseClass(group));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listAssignments = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  let group = new Promise((resolve, reject) => {
    gitlab.groups.listProjects(id, function (projects) {
      //console.log("list projects:"+ JSON.stringify(projects));
      resolve(assignmentsFilter.parseAssignments(projects));
    });
  });
  let project = new Promise((resolve, reject) => {
    gitlab.projects.all((projects) => {
      //console.log("projects all:"+ JSON.stringify(projects));
      resolve(assignmentsFilter.parseAssignments(projects));
    });
  });

  let member = new Promise((resolve, reject) => {
    gitlab.groups.listMembers(id, function (members) {
      console.log(members);
      resolve(membersFilter.parseMembers(members));
    });
  });

  let user = new Promise((resolve, reject) => {
    gitlab.users.current((user) => {
      //console.log(user);
      resolve(user);
    });
  });

  Promise.all([group,project,member,user]).then(values => {
    let combine = assignmentsFilter.compareAssignments(values[0],values[1],values[2],values[3]);
    //console.log("meow" + JSON.stringify(combine));
    return combine;
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });

 /* return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects_all) {
        gitlab.projects.all((projects) => {
          let assignments_ = assignmentsFilter.parseAssignments(projects, true, true);
          //console.log("assignment: " + JSON.stringify(assignments_));
          let assignments_all = assignmentsFilter.parseAssignments(projects_all);
          //console.log("assignment all: " + JSON.stringify(assignments_all));
          resolve(assignmentsFilter.compareAssignments(assignments_all,assignments_));
        });
      });
    }
  ).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });*/
});

classes.listMaterials = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
      gitlab.projects.repository.listTree(syllabus.id, function (list) {
        resolve(materialsFilter.parseMaterials(list, syllabus.web_url, syllabus.default_branch));
      });
    });
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listMembers = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listMembers(id, function (members) {
        console.log(members);
        resolve(membersFilter.parseMembers(members));
      });
    }
  ).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listNotices = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(syllabus.id, function (issues) {
          resolve(noticesFilter.parseNotices(issues));
        });
      }
    )
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

// TODO: unfinished work
classes.getNotice = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  let iid = req.swagger.params.iid.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
            return;
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.notes.all(syllabus.id, iid, function (issue) {
          console.log(iid);
          resolve(noticesFilter.parseNoticeDetail(issue));
        });
      }
    ).then((val)=> {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(val));
      res.end();
    });
  })
});

classes.listActivities = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            let activitiesObj = {'syllabus': project, 'assignments': projects};
            resolve(activitiesObj);
          }
        }
      });
    }
  ).then((activitiesObj)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(activitiesObj.syllabus.id, function (issues) {
          activitiesObj.notices = issues;
          resolve(activitiesFilter.parseActivities(activitiesObj));
        });
      }
    )
  }).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.createAssignment = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  let assignmentObj = req.swagger.params.assignment_obj.value;
  return new Promise((resolve, reject) => {
    gitlab.groups.show(id, function (group) {
      resolve(group);
    });
  }).then((class_) => {
    return new Promise((resolve, reject) => {
      let param = {};
      param.path = `${class_.path}-${assignmentObj.name}`;
      param.name = `${class_.name}-${assignmentObj.name}`;
      param.description = `${assignmentObj.description} %ddl:${assignmentObj.deadline}%`;
      param.namespace_id = id;
      if (assignmentObj.import_url) param.import_url = assignmentObj.import_url;

      gitlab.projects.create(param, function (project) {
        resolve(project);
      });
    }).then((val)=> {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(val));
      res.end();
    });
  });
});

classes.forkAssignment = apiwrap((req, res, gitlab) => {
  let pid = req.swagger.params.pid.value;
  return new Promise((resolve, reject) => {
    // TODO: not graceful. remember to send them a PR.
    gitlab.post(`/projects/fork/${pid}`, {}, function (result) {
      resolve(result);
    });
  }).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

module.exports = classes;
