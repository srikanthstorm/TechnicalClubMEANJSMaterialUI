(function () {
  'use strict';

  angular
    .module('menus')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Menus',
      state: 'menus',
      type: 'dropdown',
      roles: ['hero']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'menus', {
      title: 'List Menus',
      state: 'menus.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'menus', {
      title: 'Create Menu',
      state: 'menus.create',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'menus', {
      title: 'Create Participant',
      state: 'menus.createparticipant',
      roles: ['user']
    });
  }
}());
