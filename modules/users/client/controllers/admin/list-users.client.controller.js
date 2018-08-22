(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService','Authentication','myservice'];

  function UserListController($scope, $filter, AdminService,Authentication,myservice) {
    var vm = this;
    $scope.roles=["All","Admin","ClubAdmin","Coordinator","User"]
    console.log(Authentication)
    $scope.buildPager = buildPager;
    $scope.figureOutItemsToDisplay = figureOutItemsToDisplay;
    $scope.pageChanged = pageChanged;


  if(Authentication.user.roles.indexOf('admin') != -1)
{
  $scope.isAdmin=true;
  console.log("Admin");
  AdminService.query(function (data) {
    $scope.users = data;
    $scope.buildPager();
  });  
}
else{
  if(Authentication.user.roles.indexOf('clubadmin') != -1)
  console.log("ClubAdmin")  
  myservice.getUsers().then(function (response) {
    $scope.users = response;
    $scope.buildPager();

  });

}

    

    function buildPager() {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    }

    $scope.filterByRole=function() {
      if($scope.selectedrole=="All")
      $scope.selectedrole='';
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.selectedrole
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }
  }
}());
