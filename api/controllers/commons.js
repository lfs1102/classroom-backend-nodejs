"use strict";

let commons = {};

commons.server = {
  url: 'http://gitlab',
  admin_token: 'woiSFyyUezyJeyzq-y11',
  test_token: 'woiSFyyUezyJeyzq-y11'
};

console.log(`Using ${JSON.stringify(commons.server)}.`);

/* Admin */
commons.adminAuthObj = {
  url: commons.server.url,
  token: commons.server.admin_token
};

/* Test Robot */
commons.authObj = {
  url: commons.server.url,
  token: commons.server.test_token
};

commons.unauthObj = {
  url: commons.server.url,
  token: ''
};

module.exports = commons;