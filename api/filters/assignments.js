/**
 * Created by ZhongyiTong on 11/21/15.
 */
"use strict";

class AssignmentsFilter {
  static parseAssignments(projects, strictMode, asec) {
    let results = [];
    for (let project of projects) {
      let result = AssignmentsFilter.parseAssignment(project, strictMode);
      if (result) results.push(result);
    }
    results.sort((a, b)=> {
      if (asec) {
        return (a.days_left - b.days_left) && b.days_left >= 0;
      } else {
        return b.days_left - a.days_left;
      }
    });
    return results;
  };

  static parseAssignment(project, strictMode) {
    let ddl = project.description.match(/%ddl:(\S*)%/);
    if (!ddl || (strictMode && !project["forked_from_project"])) {
      return null;
    }
    let nameObj = project.description.match(/^(\S*)\s*%ddl:\S+%/);
    if (nameObj) {
      project.description = nameObj[1];
    }

    project.deadline = new Date(ddl[1]);
    project.days_left = Math.floor((project.deadline - Date.now()) / 1000 / 24 / 3600);
    if (project["forked_from_project"]) {
      project.class_name = project["forked_from_project"]["name_with_namespace"].match(/^(\S+)/)[1];
    } else {
      project.class_name = project["name_with_namespace"].match(/^(\S+)/)[1];
    }

    project.item_type = 'assignment';

    delete project.tag_list;
    delete project.public;
    delete project.archived;
    delete project.visibility_level;
    delete project.issues_enabled;
    delete project.merge_requests_enabled;
    delete project.wiki_enabled;
    delete project.snippets_enabled;
    delete project.namespace;
    delete project.star_count;
    delete project.path;
    delete project.path_with_namespace;
    delete project.owner;
    if (project.forked_from_project) {
      delete project.forked_from_project.path;
      delete project.forked_from_project.path_with_namespace;
    }

    return project;
  };

  static compareAssignments(projects_all, projects,members,user){
    let role;
    for (let member of members) {
      if(member.username == user.username){
        role = member.role;
      }
    }
    console.log(role);
    for (let project of projects_all) {
      project.forked = false;
      for (let my_project of projects) {
        if(my_project.name == project.name){
          project.forked = true;
        }
      }
    }

    return {
      role: role,
      assignments: projects_all
    };
  }
}

module.exports = AssignmentsFilter;