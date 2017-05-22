/**
 * Created by ZhongyiTong on 11/21/15.
 */
"use strict";

class ClassesFilter {
  static parseClasses(classes) {
    let results = [];

    for (let class_ of classes) {
      class_ = ClassesFilter.parseClass(class_);
      if (class_) results.push(class_);
    }
    return results;
  };

  static parseClass(class_) {
    if (class_.name == 'best-practices') return false;

    let semesterObj = class_.name.match(/-(\S+)/);
    let nameObj = class_.name.match(/(\S+)-/);

    // invalid class
    if (!semesterObj || !nameObj) return false;

    class_.semester = semesterObj[1];
    class_.name = nameObj[1];

    if (class_.projects) {
      let assignmentsFilter = require('../filters/assignments');
      class_.assignments = assignmentsFilter.parseAssignments(class_.projects, false, true);
      delete class_.projects;
    }
    return class_;
  };

}

module.exports = ClassesFilter;