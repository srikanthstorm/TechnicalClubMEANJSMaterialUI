'use strict';

/**
 * Module dependencies
 */
var menusPolicy = require('../policies/menus.server.policy'),
  menus = require('../controllers/menus.server.controller');

module.exports = function(app) {
  // Menus Routes
  app.route('/api/menus').all(menusPolicy.isAllowed)
    .get(menus.list)
    .post(menus.create);

  app.route('/api/menus/:menuId').all(menusPolicy.isAllowed)
    .get(menus.read)
    .put(menus.update)
    .delete(menus.delete);

  // Finish by binding the Menu middleware
  app.param('menuId', menus.menuByID);
};
