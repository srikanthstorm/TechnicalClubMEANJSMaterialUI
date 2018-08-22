(function () {
  'use strict';

  // Menus controller
  angular
    .module('menus')
    .controller('MenusController', MenusController);

  MenusController.$inject = ['$scope', '$state', '$window', 'Authentication', 'menuResolve'];

  function MenusController ($scope, $state, $window, Authentication, menu) {
    var vm = this;

    vm.authentication = Authentication;
    vm.menu = menu;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Menu
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.menu.$remove($state.go('menus.list'));
      }
    }

    // Save Menu
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.menuForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.menu._id) {
        vm.menu.$update(successCallback, errorCallback);
      } else {
        vm.menu.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('menus.view', {
          menuId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
