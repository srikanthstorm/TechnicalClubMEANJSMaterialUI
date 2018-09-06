(function () {
    'use strict';
  
    angular
      .module('users.admin')
      .controller('ClubDetailsController', ClubDetailsController);
  
      ClubDetailsController.$inject = ['$scope', '$state', 'UsersService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification','myservice'];
  
    function ClubDetailsController($scope, $state, UsersService, $location, $window, Authentication, PasswordValidator, Notification, myservice) {
      $scope.year = ["I", "II", "III","IV"];
      $scope.branch = ["CSE", "ECE", "MECH","CIVIL","EEE"];
      $scope.section = ["A", "B", "C","D"];
      $scope.clubs = ["Technical Club", "Orators Club", "Audio Visual Club","Samskruthi Club","Photoshop Club"];
      $scope.domains = ["MEAN Stack", "Ionic", "Cloud","IoT","Cognitive / Chatbots","Design","Communications"];
      $scope.clubdata={};
//      $scope.clubdata["club"]=[];
//        
//        console.log(typeof($scope.clubdata))
//        $scope.clubdata["club"].push("hi");
//        console.log($scope.clubdata.club)
     // $scope.clubdata.club.domains = [];
      $scope.addDomain = function(){
          console.log(typeof($scope.clubdata[$scope.club.domain]));
          if(typeof($scope.clubdata[$scope.club.clubname])== "undefined"){
           console.log("true")
              $scope.clubdata[$scope.club.clubname]=[];
          }
         $scope.clubdata[$scope.club.clubname].push($scope.club.domain);
          console.log( "After adding", $scope.clubdata)
            
        }
      if(Authentication.user.roles.indexOf('admin') != -1)
      {
        $scope.roles = ["user","coordinator","clubadmin","admin"];


      }
      if(Authentication.user.roles.indexOf('clubadmin') != -1)
{
        $scope.roles = ["user","coordinator"];

      }
      if(Authentication.user.roles.indexOf('coordinator') != -1)
      {
              $scope.roles = ["user"];
      
            }
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
      $scope.format = $scope.formats[0];
    
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
    $scope.register = function(){
      $scope.credentials.username= $scope.credentials.email;

console.log("I am triggered",$scope.credentials);
$scope.credentials.roles=[];
$scope.credentials.roles.push($scope.credentials.role);
myservice.createUser($scope.credentials).then(function (response) {

Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully created User' });
if(Authentication.user.roles.indexOf('coordinator') != -1)
{
  $state.go('articles.list');

}
else{
  $state.go('admin.users');

}

})
.catch(function (err) {
  console.log(err);
  Notification.error({ message: err.message, title: '<i class="glyphicon glyphicon-remove"></i> User Creation error!' });

});

    }




    
    }
  })();
  