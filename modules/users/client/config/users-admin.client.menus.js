(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users',
      roles: ['clubadmin','admin','coordinator']
    });
   
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Register User',
      state: 'admin.createusers',
      roles: ['admin','clubadmin','coordinator']
    });
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Dialy Status',
      state: 'admin.managedailystatus',
      roles: ['admin','clubadmin','coordinator']
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Dialy Status',
      state: 'admin.dailystatus',
      roles: [,'clubadmin','admin']
    });
   
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Clubs',
      state: 'admin.clubs',
      roles: ['user']
    });
    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Add Clubs',
      state: 'admin.clubs',
      roles: ['user']
    });
  }
 

}());
