/**
 * Created by ZhongyiTong on 11/8/15.
 */
"use strict";

let apiwrap = require('./apibase').apiwrap;

let users = {};

users.get = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;


  return new Promise((resolve, reject) => {
      if (id == 'me') {
        gitlab.users.current((user) => {
          resolve(user);
        });
      } else {
        gitlab.users.show(id, (user) => {
          resolve(user);
        });
      }
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

module.exports = users;
