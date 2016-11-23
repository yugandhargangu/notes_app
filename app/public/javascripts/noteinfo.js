/**
 * @author Yugandhar Gangu
 * 
 * To include in noteinfo.jade view
 */
var noteInfoApp = angular.module('noteInfoApp', []);
// controller
noteInfoApp.controller('noteInfoController', function($scope, $http) {
	// to clear note
	$scope.clearNote = function() {
		$scope.note = '';
	};
	// save note ajax call
	$scope.saveNote = function() {
		$scope.formData = $('#noteInfoForm').serialize();
		$http({
			method : 'POST',
			url : 'save.html',
			data : $scope.formData,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
		}).then(function(response) {
			var data = response.data;
			if (data.code == 0) { // success
				alert('Note saved successfully.');
				window.location.href = '/notes';
			} else {
				alert(data.message);
			}
		}, function(data, status, headers, config) {
			alert('Error occurred. Please try after some time.');
		});
	};
});