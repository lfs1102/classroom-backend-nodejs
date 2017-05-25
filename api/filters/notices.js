"use strict";

class NoticesFilter {

  static parseNotices(notices) {
    let results = [];
    for (let notice of notices) {
      let result = NoticesFilter.parseNotice(notice);
      if (result) {
        results.push(result);
      }
    }
    return results;
  };

  static parseNotice(notice) {
    if (notice.state == 'closed') return null;

    delete notice.assignee;
    delete notice.state;
    delete notice.milestone;
    delete notice.labels;

    notice.item_type = 'notice';
    return notice;
  };

  static parseNoticeDetail(detail) {
    return detail;
  }
}

module.exports = NoticesFilter;