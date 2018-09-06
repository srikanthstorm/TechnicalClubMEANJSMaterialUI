(function () {
    'use strict';
  
    angular
      .module('users.admin')
      .controller('DailyStatusController', DailyStatusController);
  
      DailyStatusController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification','myservice'];
  
    function DailyStatusController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, myservice) {
      $scope.user=Authentication.user;
      console.log($scope.user.displayName);
      $scope.year = ["I", "II", "III","IV"];
      $scope.branch = ["CSE", "ECE", "MECH","CIVIL","EEE"];
      $scope.section = ["A", "B", "C","D"];
      $scope.clubs = ["Technical Club", "Orators Club", "Audio Visual Club","Samskruthi Club","Photoshop Club"];
      $scope.domains = ["MEAN Stack", "Ionic", "Cloud","IoT","Cognitive / Chatbots","Design","Communications"];
      $scope.roles = ["user","coordinator","clubadmin","admin"]
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
    
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
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
    $scope.postDailyStatus = function(){
      
console.log("I am triggered",$scope.data);


$scope.data.displayName=$scope.user.displayName;
$scope.data.email=$scope.user.email;
$scope.data.club=$scope.data.club;
console.log($scope.data);
myservice.postDailyStatus($scope.data).then(function (response) {

alert("Saved Successfully");

})

    }


  

    
    }
  })();
  