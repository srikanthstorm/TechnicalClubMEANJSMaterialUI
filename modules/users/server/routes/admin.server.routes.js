'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('../policies/admin.server.policy'),
  admin = require('../controllers/admin.server.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/createuser').post(admin.createuser);
  app.route('/api/users/dailystatus').post(admin.postdailystatus);
  app.route('/api/users/getDailyStatus').get(admin.getDailyStatus);
  app.route('/api/users/getUsers').get(admin.getUsers);
  app.route('/api/users/getOnlyUsers').get(admin.getOnlyUsers);

  app.route('/api/users/updateUser').post(admin.updateUser);

  app.route('/api/users/create').post(adminPolicy.isAllowed,admin.createuser);
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
