// Menus service used to communicate Menus REST endpoints
(function () {
  'use strict';

  angular
    .module('menus')
    .factory('MenusService', MenusService);

  MenusService.$inject = ['$resource'];

  function MenusService($resource) {
    return $resource('api/menus/:menuId', {
      menuId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
