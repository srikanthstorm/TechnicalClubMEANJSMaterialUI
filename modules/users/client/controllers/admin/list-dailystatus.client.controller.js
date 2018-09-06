(function () {
    'use strict';
  
    angular
      .module('users.admin')
      .controller('ListDailyStatusController', ListDailyStatusController);
  
    ListDailyStatusController.$inject = ['$scope', '$filter', 'AdminService','myservice'];
  
    function ListDailyStatusController($scope, $filter, AdminService,myservice) {

      var vm = this;
      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();
    
      $scope.clear = function () {
        $scope.dt = null;
      };
    
      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };
    
      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);
    
      $scope.open = function($event) {
        $scope.status.opened = true;
      };
    
      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };
    
      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };
    
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[1];
    
      $scope.status = {
        opened: false
      };
    
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 2);
      $scope.events =
        [
          {
            date: tomorrow,
            status: 'full'
          },
          {
            date: afterTomorrow,
            status: 'partially'
          }
        ];
    
      $scope.getDayClass = function(date, mode) {
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);
    
          for (var i=0;i<$scope.events.length;i++){
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);
    
            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }
    
        return '';
      };
      myservice.getDailyStatus().then(function (data) {
          console.log(data);
        $scope.users = data;
        $scope.buildPager();
      });
  
      $scope.buildPager=function () {
        $scope.pagedItems = [];
        $scope.itemsPerPage = 15;
        $scope.currentPage = 1;
        $scope.figureOutItemsToDisplay();
      }
  
      $scope.figureOutItemsToDisplay=function () {
        $scope.filteredItems = $filter('filter')($scope.users, {
          $: $scope.search
        });
        $scope.filterLength = $scope.filteredItems.length;
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.pagedItems = $scope.filteredItems.slice(begin, end);
        console.log("Paged Items",$scope.pagedItems)
      }

      $scope.dateFilter=function () {
        $scope.filteredItems = $filter('filter')($scope.users, {
          $: $scope.startDate
           
        });
        $scope.filterLength = $scope.filteredItems.length;
        var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
        var end = begin + $scope.itemsPerPage;
        $scope.pagedItems = $scope.filteredItems.slice(begin, end);
        console.log("Paged Items",$scope.pagedItems)
    }

  
      $scope.pageChanged=function () {
        $scope.figureOutItemsToDisplay();
      }
    }
  }());
  