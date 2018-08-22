(function() {
  'use strict';

  angular
    .module('menus')
    .controller('CreatestudentController', CreatestudentController);

  CreatestudentController.$inject = ['$scope'];

  function CreatestudentController($scope) {
    var vm = this;

    // Createstudent controller logic
    // ...

    init();

    function init() {
    }
  }
})();
