'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Menu = mongoose.model('Menu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Menu
 */
exports.create = function(req, res) {
  var menu = new Menu(req.body);
  menu.user = req.user;

  menu.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menu);
    }
  });
};

/**
 * Show the current Menu
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var menu = req.menu ? req.menu.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  menu.isCurrentUserOwner = req.user && menu.user && menu.user._id.toString() === req.user._id.toString();

  res.jsonp(menu);
};

/**
 * Update a Menu
 */
exports.update = function(req, res) {
  var menu = req.menu;

  menu = _.extend(menu, req.body);

  menu.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menu);
    }
  });
};

/**
 * Delete an Menu
 */
exports.delete = function(req, res) {
  var menu = req.menu;

  menu.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menu);
    }
  });
};

/**
 * List of Menus
 */
exports.list = function(req, res) {
  Menu.find().sort('-created').populate('user', 'displayName').exec(function(err, menus) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menus);
    }
  });
};

/**
 * Menu middleware
 */
exports.menuByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Menu is invalid'
    });
  }

  Menu.findById(id).populate('user', 'displayName').exec(function (err, menu) {
    if (err) {
      return next(err);
    } else if (!menu) {
      return res.status(404).send({
        message: 'No Menu with that identifier has been found'
      });
    }
    req.menu = menu;
    next();
  });
};
