'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Menu = mongoose.model('Menu'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  menu;

/**
 * Menu routes tests
 */
describe('Menu CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Menu
    user.save(function () {
      menu = {
        name: 'Menu name'
      };

      done();
    });
  });

  it('should be able to save a Menu if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu
        agent.post('/api/menus')
          .send(menu)
          .expect(200)
          .end(function (menuSaveErr, menuSaveRes) {
            // Handle Menu save error
            if (menuSaveErr) {
              return done(menuSaveErr);
            }

            // Get a list of Menus
            agent.get('/api/menus')
              .end(function (menusGetErr, menusGetRes) {
                // Handle Menus save error
                if (menusGetErr) {
                  return done(menusGetErr);
                }

                // Get Menus list
                var menus = menusGetRes.body;

                // Set assertions
                (menus[0].user._id).should.equal(userId);
                (menus[0].name).should.match('Menu name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Menu if not logged in', function (done) {
    agent.post('/api/menus')
      .send(menu)
      .expect(403)
      .end(function (menuSaveErr, menuSaveRes) {
        // Call the assertion callback
        done(menuSaveErr);
      });
  });

  it('should not be able to save an Menu if no name is provided', function (done) {
    // Invalidate name field
    menu.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu
        agent.post('/api/menus')
          .send(menu)
          .expect(400)
          .end(function (menuSaveErr, menuSaveRes) {
            // Set message assertion
            (menuSaveRes.body.message).should.match('Please fill Menu name');

            // Handle Menu save error
            done(menuSaveErr);
          });
      });
  });

  it('should be able to update an Menu if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu
        agent.post('/api/menus')
          .send(menu)
          .expect(200)
          .end(function (menuSaveErr, menuSaveRes) {
            // Handle Menu save error
            if (menuSaveErr) {
              return done(menuSaveErr);
            }

            // Update Menu name
            menu.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Menu
            agent.put('/api/menus/' + menuSaveRes.body._id)
              .send(menu)
              .expect(200)
              .end(function (menuUpdateErr, menuUpdateRes) {
                // Handle Menu update error
                if (menuUpdateErr) {
                  return done(menuUpdateErr);
                }

                // Set assertions
                (menuUpdateRes.body._id).should.equal(menuSaveRes.body._id);
                (menuUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Menus if not signed in', function (done) {
    // Create new Menu model instance
    var menuObj = new Menu(menu);

    // Save the menu
    menuObj.save(function () {
      // Request Menus
      request(app).get('/api/menus')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Menu if not signed in', function (done) {
    // Create new Menu model instance
    var menuObj = new Menu(menu);

    // Save the Menu
    menuObj.save(function () {
      request(app).get('/api/menus/' + menuObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', menu.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Menu with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/menus/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Menu is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Menu which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Menu
    request(app).get('/api/menus/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Menu with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Menu if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Menu
        agent.post('/api/menus')
          .send(menu)
          .expect(200)
          .end(function (menuSaveErr, menuSaveRes) {
            // Handle Menu save error
            if (menuSaveErr) {
              return done(menuSaveErr);
            }

            // Delete an existing Menu
            agent.delete('/api/menus/' + menuSaveRes.body._id)
              .send(menu)
              .expect(200)
              .end(function (menuDeleteErr, menuDeleteRes) {
                // Handle menu error error
                if (menuDeleteErr) {
                  return done(menuDeleteErr);
                }

                // Set assertions
                (menuDeleteRes.body._id).should.equal(menuSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Menu if not signed in', function (done) {
    // Set Menu user
    menu.user = user;

    // Create new Menu model instance
    var menuObj = new Menu(menu);

    // Save the Menu
    menuObj.save(function () {
      // Try deleting Menu
      request(app).delete('/api/menus/' + menuObj._id)
        .expect(403)
        .end(function (menuDeleteErr, menuDeleteRes) {
          // Set message assertion
          (menuDeleteRes.body.message).should.match('User is not authorized');

          // Handle Menu error error
          done(menuDeleteErr);
        });

    });
  });

  it('should be able to get a single Menu that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Menu
          agent.post('/api/menus')
            .send(menu)
            .expect(200)
            .end(function (menuSaveErr, menuSaveRes) {
              // Handle Menu save error
              if (menuSaveErr) {
                return done(menuSaveErr);
              }

              // Set assertions on new Menu
              (menuSaveRes.body.name).should.equal(menu.name);
              should.exist(menuSaveRes.body.user);
              should.equal(menuSaveRes.body.user._id, orphanId);

              // force the Menu to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Menu
                    agent.get('/api/menus/' + menuSaveRes.body._id)
                      .expect(200)
                      .end(function (menuInfoErr, menuInfoRes) {
                        // Handle Menu error
                        if (menuInfoErr) {
                          return done(menuInfoErr);
                        }

                        // Set assertions
                        (menuInfoRes.body._id).should.equal(menuSaveRes.body._id);
                        (menuInfoRes.body.name).should.equal(menu.name);
                        should.equal(menuInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Menu.remove().exec(done);
    });
  });
});
