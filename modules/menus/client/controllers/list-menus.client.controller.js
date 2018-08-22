(function () {
  'use strict';

  angular
    .module('menus')
    .controller('MenusListController', MenusListController);

  MenusListController.$inject = ['MenusService'];

  function MenusListController(MenusService) {
    var vm = this;

    vm.menus = MenusService.query();
  }
}());
