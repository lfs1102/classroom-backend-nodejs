"use strict";

let assignmentsFilter = require('../filters/assignments');
let classesFilter = require('../filters/classes');
let materialsFilter = require('../filters/materials');
let membersFilter = require('../filters/members');
let noticesFilter = require('../filters/notices');

class ActivitiesFilter {
  static parseActivities(activitiesObj) {
    let notices = noticesFilter.parseNotices(activitiesObj.notices);
    let assignments = assignmentsFilter.parseAssignments(activitiesObj.assignments);

    let results = assignments.concat(notices);
    results.sort((a, b)=> {
      let a_time = a.last_activity_at || a.updated_at;
      let b_time = b.last_activity_at || b.updated_at;
      return new Date(b_time) - new Date(a_time);
    });

    return results;
  };
}

module.exports = ActivitiesFilter;