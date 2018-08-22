(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      },
      
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
     
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }

  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    return $resource('/api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }




  
}());




angular.module('users.services').service('myservice', [ '$window', '$http','$q' , function( $window , $http, $q) {



  this.createUser = function (newUser) {

    var data = {};
 
    data.user = newUser;
    
    var deferred = $q.defer();
 
 console.log("Data",data);
    $http.post('/api/users/create', data)
            .success(function (response) {
              deferred.resolve(response);
            })
            .error(function (msg,code) {
              deferred.reject(msg);
 
            });
 
    return deferred.promise;
  }
 

  this.postDailyStatus = function (newUser) {

    var data = {};
 console.log(newUser);
    data.status = newUser;
    
    var deferred = $q.defer();
 
 console.log("Data",data);
    $http.post('/api/users/dailystatus', data)
            .success(function (response) {
              deferred.resolve(response);
            })
            .error(function (msg,code) {
              deferred.reject(msg);
 
            });
 
    return deferred.promise;
  }
  this.updateUser = function (newUser) {

    var data = {};
 console.log(newUser);
    data.user = newUser;
    
    var deferred = $q.defer();
 
 console.log("Data",data);
    $http.post('/api/users/updateUser', data)
            .success(function (response) {
              deferred.resolve(response);
            })
            .error(function (msg,code) {
              deferred.reject(msg);
 
            });
 
    return deferred.promise;
  }


  this.getUsers = function () {

    var deferred = $q.defer();
 

    $http.get('/api/users/getUsers')
            .success(function (response) {
              deferred.resolve(response);
            })
            .error(function (msg,code) {
              deferred.reject(msg);
 
            });
 
    return deferred.promise;
  }


  this.getDailyStatus = function () {

   
    var deferred = $q.defer();
 
 
    $http.get('/api/users/getDailyStatus')
            .success(function (response) {
              console.log(response);
              deferred.resolve(response);
            })
            .error(function (msg,code) {
              console.log("error")
              deferred.reject(msg);
 
            });
 
    return deferred.promise;
  }


}
]);