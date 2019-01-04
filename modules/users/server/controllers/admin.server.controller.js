'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Status = mongoose.model('Status'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
 var nodemailer = require('nodemailer');
 var randomstring = require("randomstring");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'developers.svec@gmail.com',
    pass: 'infinity@svec'
  }
});


exports.read = function (req, res) {
  res.json(req.model);
};
//create user
exports.createuser = function (req, res) {
  // For security measurement we remove the roles from the req.body object
 console.log(req.body.user);

  // Init user and add missing fields
  var user = new User(req.body.user);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

var genPass = randomstring.generate({
  length: 10,
  charset: 'alphanumeric'
});
user.password = genPass;
console.log(user.password);

  // Then save the user
  user.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      var mailOptions = {
        from: 'TechnicalClub@gmail.com',
        to: 'srikanthnaidu512@gmail.com',
        subject: 'REGISTRATION SUCESSFULL',
        // text: 'Welcome '+user.firstName+'. Your Registration has been completed Successfully 'genPass
         html: '<html><body> <p style="font-family:comic san ms;color:#009999"> <b> Hello '+user.firstName+',</b></p> Your Registration for '+user.clubs+' has been Successfully completed <br> Username:  '+user.email+'<br>Password: '+genPass+'<br> Please <a href="https://my-apwep.mybluemix.net/authentication/signin">Click Here</a> to Login. </body></html>'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      user.password = undefined;
      user.salt = undefined;
      res.json(user);

    }
  });
};

exports.postdailystatus = function (req, res) {
  // For security measurement we remove the roles from the req.body object
 console.log(req.body.status);

  // Init user and add missing fields
  var status = new Status(req.body.status);

  // Then save the user
  status.save(function (err) {
    if (err) {
      console.log(err);
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login

      res.json(status);

    }
  });
};


/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  // For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};
exports.updateUser = function (req, res) {

  var user = new User(req.body.user);
  console.log("You reached here")
  User.findOneAndUpdate({email:req.body.user.email}, req.body.user, function (err, user) {

    if (err) {
      console.log("Update Failed",err)
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    console.log("update Successful");

    res.json(user);
  });

};
/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.find({}, '-salt -password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(users);
  });
};

exports.getDailyStatus = function (req, res) {
  Status.find({}).sort('_id').populate('user', 'displayName').sort({"_id":-1}).exec(function (err, users) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
console.log("Successful")
console.log(users);
    res.json(users);
  });
};

exports.getUsers = function (req, res) {
  var query={};
//query.status='active';
query.roles={
$in:["coordinator","user"]

}
  User.find(query).sort('_id').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      console.log("error")
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
console.log("Successful")
console.log(users);
    res.json(users);
  });
};


exports.getOnlyUsers = function (req, res) {
  var query={};
//query.status='active';
query.roles={
$eq:["user"]

}
  User.find(query).sort('_id').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      console.log("error")
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
console.log("Successful")
console.log(users);
    res.json(users);
  });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password -providerData').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
