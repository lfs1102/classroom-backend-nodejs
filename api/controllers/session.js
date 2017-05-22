/**
 * Created by htc on 11/8/15.
 */
'use strict';

let commons = require('./commons');
let gitlab = require('gitlab');

let session = {};

session.login = (req, res) => {
  let username = req.swagger.params.username.value;
  let password = req.swagger.params.password.value;
  gitlab(commons.unauthObj).users.session(username, password, (ret) => {
    if (typeof ret == 'object') {
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'token=' + ret.private_token + '; Path=/; ' + ''
      });
      res.write(JSON.stringify({
        'message': 'ok',
        'token': ret.private_token,
        'id': ret.id
      }));
      res.end();
    } else {
      res.writeHead(401, {
        'Content-Type': 'application/json',
        'Set-Cookie': 'token='
      });
      res.write(JSON.stringify({
        'message': '401 unauthorized'
      }));
      res.end();
    }
  });
};

session.token_login = (req, res) => {
  let token = req.swagger.params.token.value;

  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Set-Cookie': 'token=' + token + '; Path=/; '
  });
  res.write(JSON.stringify({
    'message': 'ok'
  }));
  res.end();
};

module.exports = session;
