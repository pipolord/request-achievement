//AMODIFIER
var urlAPI = "https://localhost:8081";


var app = angular.module('achievement',['ngResource']);
app.config(['$httpProvider', function($httpProvider) {        $httpProvider.defaults.useXDomain = true;        delete $httpProvider.defaults.headers.common['X-Requested-With'];    }]);app.controller('achievementController',function($http, $scope, $rootScope, newGroupIdAchievement){  initDOM();  $http.get('json/data.json').then(function(response) {      data = response.data;  });	$scope.seekAchievement = function(){		if (_.isUndefined(data) ||_.isUndefined($scope.someVal)) {			return;		}		var valueSearch = $scope.someVal.toLowerCase();		$scope.resultsAchievements = [];		_.each(data.achievements, function(results) {				checkIsAchievement(results);			_.each(results.categories, function(results) {					checkIsAchievement(results);	  	});			function checkIsAchievement(results) {				_.each(results.achievements, function(results) {					var title 		  = results.title.toLowerCase();					var description = results.description.toLowerCase();					if(_.isUndefined(results) && _.isUndefined(title)) {						return;			    }					if (title.indexOf(valueSearch) >= 0 || description.indexOf(valueSearch) >= 0) {			    		$scope.resultsAchievements.push(results);			    }				});			}		});		var refreshGroupsForAchievement = function(idAchievement) {			$http.get(urlAPI+'/groupsachievement/' + idAchievement).success(function(response) {				$scope.groups = response;				$scope.group 	= "";				$scope.emptyGroupAchievement = "";        $scope.achievementCliked = idAchievement;        if (!response.length) {					$scope.emptyGroupAchievement = idAchievement;          $scope.achievementCliked = "";        }			});		};    $rootScope.$on('refreshGroupsForAchievement', function (event, data) {      refreshGroupsForAchievement(data);    });		$scope.getGroups = function(id) {			refreshGroupsForAchievement(id);		};		$scope.newGroupIdAchievement =  function(id) {			newGroupIdAchievement.set(id);		};	}});
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
app.service('userService', function () {
    var user;
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

app.controller('loginController',function($http, $scope, $rootScope, userService){
      $http({
        method: 'GET',
        url: urlAPI +'/user',
        withCredentials: true
      }).success(function(data) {
          if(!data == "" && !_.isUndefined(data.battletag)) {
              $scope.user = data;
              userService.set(data);
                      console.log(data);
          }
        })
        .error(function() {
        });

        $rootScope.$on('refreshUser', function (event, data) {
          console.log("here");
          $scope.user = data;
        });

        $scope.getCharacterFromUser =  function(user) {
          $rootScope.$emit('refreshCharacters');
		    };
});

app.controller('charactersController',function($http, $scope, $rootScope, userService){
      $rootScope.$on('refreshCharacters', function (event) {
        $scope.characters = userService.get().characters;
      });

      $scope.updateDefaultCharacter =  function(indexCharacter) {
        var character = {};
        character.defaultcharacter = indexCharacter;
        $http.post(urlAPI+'/userdefaultcharacter/' + userService.get()._id, character).success(function(response) {
          userService.set(response);
          $rootScope.$emit('refreshUser', response);
        });
      };
});
