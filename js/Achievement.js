//AMODIFIER
var urlAPI = "https://91.121.168.68:3000";


var app = angular.module('achievement',['ngResource']);
app.config(['$httpProvider', function($httpProvider) {        $httpProvider.defaults.useXDomain = true;        delete $httpProvider.defaults.headers.common['X-Requested-With'];    }]);app.controller('achievementController',function($http, $scope){  initDOM();  $http.get('json/data.json').then(function(response) {      data = response.data;  });	$scope.seekAchievement = function(){		if (_.isUndefined(data) ||_.isUndefined($scope.someVal)) {			return;		}		var valueSearch = $scope.someVal.toLowerCase();		$scope.resultsAchievements = [];		_.each(data.achievements, function(results) {				checkIsAchievement(results);			_.each(results.categories, function(results) {					checkIsAchievement(results);	  	});			function checkIsAchievement(results) {				_.each(results.achievements, function(results) {					var title 		  = results.title.toLowerCase();					var description = results.description.toLowerCase();					if(_.isUndefined(results) && _.isUndefined(title)) {						return;			    }					if (title.indexOf(valueSearch) >= 0 || description.indexOf(valueSearch) >= 0) {			    		$scope.resultsAchievements.push(results);			    }				});			}		});		var refreshGroupsForAchievement = function(idAchievement) {			$http.get(urlAPI+'/groupsachievement/' + idAchievement).success(function(response) {				$scope.groups = response;				$scope.group 	= "";				$scope.newGroup = "";				$scope.emptyGroupAchievement = "";				if (!response.length) {					$scope.emptyGroupAchievement = idAchievement;				}			});		};		$scope.getGroups = function(id) {			refreshGroupsForAchievement(id);		};		//Arevoir		var newGroupIdAchievementvar;		$scope.newGroupIdAchievement =  function(id) {			newGroupIdAchievementvar = id;		};		$scope.addGroup = function() {			var newGroup =  $scope.newGroup;			newGroup.idAchievement = newGroupIdAchievementvar;			newGroup.dateCreate = new Date();			console.log(newGroup);			$http.post(urlAPI+'/groups', newGroup).success(function(response) {				refreshGroupsForAchievement(newGroupIdAchievementvar);			});		};	}});

function initDOM() {
  var positions = ["top","center","bottom"];
  var selected = Math.floor(Math.random()*3);
  document.getElementById('#navbar-custom').style.backgroundPosition = positions[selected];
  var backgrounds = ["test2.jpg","test3.jpg","test7.jpg"];
  var selectB = Math.floor(Math.random()*3);
  document.getElementById('#navbar-custom').style.backgroundImage = "url(images/nav/"+backgrounds[selectB]+")";
  $('#datetimepicker1').datetimepicker();
}
