//AMODIFIER
var urlAPI = "https://91.121.168.68:3001";


var app = angular.module('achievement',['ngResource']);
app.config(['$httpProvider', function($httpProvider) {        $httpProvider.defaults.useXDomain = true;        delete $httpProvider.defaults.headers.common['X-Requested-With'];    }]);app.controller('achievementController',function($http, $scope, $rootScope, newGroupIdAchievement){  initDOM();  $http.get('json/data.json').then(function(response) {      data = response.data;  });	$scope.seekAchievement = function(){		if (_.isUndefined(data) ||_.isUndefined($scope.someVal)) {			return;		}		var valueSearch = $scope.someVal.toLowerCase();		$scope.resultsAchievements = [];		_.each(data.achievements, function(results) {				checkIsAchievement(results);			_.each(results.categories, function(results) {					checkIsAchievement(results);	  	});			function checkIsAchievement(results) {				_.each(results.achievements, function(results) {					var title 		  = results.title.toLowerCase();					var description = results.description.toLowerCase();					if(_.isUndefined(results) && _.isUndefined(title)) {						return;			    }					if (title.indexOf(valueSearch) >= 0 || description.indexOf(valueSearch) >= 0) {			    		$scope.resultsAchievements.push(results);			    }				});			}		});		var refreshGroupsForAchievement = function(idAchievement) {			$http.get(urlAPI+'/groupsachievement/' + idAchievement).success(function(response) {				$scope.groups = response;				$scope.group 	= "";				$scope.emptyGroupAchievement = "";				if (!response.length) {					$scope.emptyGroupAchievement = idAchievement;				}			});		};    $rootScope.$on('refreshGroupsForAchievement', function (event, data) {      console.log("here");      refreshGroupsForAchievement(data);    });		$scope.getGroups = function(id) {			refreshGroupsForAchievement(id);		};		$scope.newGroupIdAchievement =  function(id) {			newGroupIdAchievement.set(id);		};	}});
app.service('newGroupIdAchievement', function () {
    var newGroupIdAchievement;
    return {
        get: function () {
            return property;
        },
        set: function(value) {
            property = value;
        }
    };
});
app.controller('newGroupController',function($http, $scope, $rootScope, newGroupIdAchievement){
  		$scope.addGroup = function() {
  			var newGroup =  $scope.newGroup;
  			newGroup.idAchievement = newGroupIdAchievement.get();
  			newGroup.dateCreate = new Date();

  			$http.post(urlAPI+'/groups', newGroup).success(function(response) {
          $scope.newGroup = "";
          $rootScope.$emit('refreshGroupsForAchievement', newGroupIdAchievement.get());
  			});
		  };
});

function initDOM() {
  var positions = ["top","center","bottom"];
  var selected = Math.floor(Math.random()*3);
  document.getElementById('#navbar-custom').style.backgroundPosition = positions[selected];
  var backgrounds = ["test2.jpg","test3.jpg","test7.jpg"];
  var selectB = Math.floor(Math.random()*3);
  document.getElementById('#navbar-custom').style.backgroundImage = "url(images/nav/"+backgrounds[selectB]+")";
  $('#datetimepicker1').datetimepicker();
}




//////////////////TEST AUTHENTICAITON PASSPORTBNET
app.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout
    });

}]);

function isLoggedIn() {
  if(user) {
    return true;
  } else {
    return false;
  }
}

function getUserStatus() {
  return user;
}

function login(username, password) {

  // create a new instance of deferred
  var deferred = $q.defer();

  // send a post request to the server
  $http.post('/user/login',
    {username: username, password: password})
    // handle success
    .success(function (data, status) {
      if(status === 200 && data.status){
        user = true;
        deferred.resolve();
      } else {
        user = false;
        deferred.reject();
      }
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;
}
function logout() {

  // create a new instance of deferred
  var deferred = $q.defer();

  // send a get request to the server
  $http.get('/user/logout')
    // handle success
    .success(function (data) {
      user = false;
      deferred.resolve();
    })
    // handle error
    .error(function (data) {
      user = false;
      deferred.reject();
    });

  // return promise object
  return deferred.promise;
}

app.controller('loginController',function($http, $scope, $rootScope, AuthService){

  }
});
