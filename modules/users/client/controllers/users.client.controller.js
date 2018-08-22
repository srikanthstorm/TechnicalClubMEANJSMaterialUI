(function() {
  'use strict';

  angular
    .module('users')
    .controller('UsersController2', UsersController2);

  UsersController2.$inject = ['$scope'];

  function UsersController2($scope) {
    var vm = this;

    // Users controller logic
    // ...

    init();

    function init() {
    }
  }
})();
