(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm',
        data: {
          roles: ['clubadmin','admin']
        }
      })
      
      .state('admin.managedailystatus', {
        url: '/managedailystatus',
        templateUrl: '/modules/users/client/views/admin/manage-dailystatus.client.view.html',
        controller: 'DailyStatusController',
        data: {
          roles: ['clubadmin','admin','coordinator']
        }
     
      })
      .state('admin.dailystatus', {
        url: '/listdailystatus',
        templateUrl: '/modules/users/client/views/admin/list-dailystatus.client.view.html',
        controller: 'ListDailyStatusController',
        data: {
          roles: ['clubadmin','admin']
        }
     
      })
      .state('admin.createusers', {
        url: '/createusers',
        templateUrl: '/modules/users/client/views/admin/create-user.client.view.html',
        controller: 'CreateUsersController',
        controllerAs: 'vm',
        data: {
          roles: ['clubadmin','admin','coordinator']
        }
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['clubadmin','admin']
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          roles: ['clubadmin','admin']
        }
      });

    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return AdminService.get({
        userId: $stateParams.userId
      }).$promise;
    }
  }
}());
