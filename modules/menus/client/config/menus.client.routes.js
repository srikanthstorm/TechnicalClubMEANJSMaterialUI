(function () {
  'use strict';

  angular
    .module('menus')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('createstudent', {
        url: '/createstudent',
        templateUrl: 'modules/menus/client/views/createstudent.client.view.html',
        controller: 'CreatestudentController',
        controllerAs: 'vm'
      })
      .state('menus', {
        abstract: true,
        url: '/menus',
        template: '<ui-view/>'
      })
      .state('menus.list', {
        url: '',
        templateUrl: 'modules/menus/client/views/list-menus.client.view.html',
        controller: 'MenusListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Menus List'
        }
      })
      .state('menus.create', {
        url: '/create',
        templateUrl: 'modules/menus/client/views/form-menu.client.view.html',
        controller: 'MenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: newMenu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Menus Create'
        }
      })
      .state('menus.createparticipant', {
        url: '/createparticipant',
        templateUrl: 'modules/menus/client/views/createstudent.client.view.html',
        controller: 'CreatestudentController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Menus Create'
        }
      })
      .state('menus.edit', {
        url: '/:menuId/edit',
        templateUrl: 'modules/menus/client/views/form-menu.client.view.html',
        controller: 'MenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: getMenu
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Menu {{ menuResolve.name }}'
        }
      })
      .state('menus.view', {
        url: '/:menuId',
        templateUrl: 'modules/menus/client/views/view-menu.client.view.html',
        controller: 'MenusController',
        controllerAs: 'vm',
        resolve: {
          menuResolve: getMenu
        },
        data: {
          pageTitle: 'Menu {{ menuResolve.name }}'
        }
      });
  }

  getMenu.$inject = ['$stateParams', 'MenusService'];

  function getMenu($stateParams, MenusService) {
    return MenusService.get({
      menuId: $stateParams.menuId
    }).$promise;
  }

  newMenu.$inject = ['MenusService'];

  function newMenu(MenusService) {
    return new MenusService();
  }
}());
