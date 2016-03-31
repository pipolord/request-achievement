var app = angular.module('achievement',[]);

app.controller('achievementController',function($scope){
	var data = {};
	$.getJSON('https://eu.api.battle.net/wow/data/character/achievements?locale=fr_FR&apikey=xyzcvd8sfjx5sketq27e8ttsvdbnttgm', function(dataJSON) {     
			data = dataJSON;
	    });
	$scope.seekAchievement = function(){
        $scope.resultsAchievement = "";
		_.each(data.achievements[0].achievements, function(results) {
    		if(!_.isUndefined(data) && !_.isUndefined(results) && !_.isUndefined(results.title)) {
    			if (results.title.indexOf($scope.someVal) >= 0 || results.description.indexOf($scope.someVal) >= 0) {
    			     $scope.resultsAchievement = results.title + " - " + results.description;
    			}
    		}
    	});
	}
});