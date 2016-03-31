//seekAchievement.js

var app = angular.module('achievement',[]);

app.controller('achievementController',function($scope){
	var data = {};
	$.getJSON('https://eu.api.battle.net/wow/data/character/achievements?locale=fr_FR&apikey=xyzcvd8sfjx5sketq27e8ttsvdbnttgm', function(dataJSON) {     
			data = dataJSON;
	    });
	$scope.seekAchievement = function(){

    		/*console.log(data); */
    		// $scope.resultsAchievement = _.where(data,{title:$scope.someVal});
    		var results = _.where(data.achievements[0].achievements,{title: $scope.someVal});
    		if(!_.isUndefined(data) && !_.isUndefined(results) && !_.isUndefined(results[0]) ) {
    			$scope.resultsAchievement = results.description;

    		}

		
	}
});

