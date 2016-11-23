/**
 * @author Yugandhar Gangu
 * 
 * To include in login.jade view
 */
var loginApp = angular.module('loginApp', []);
// controller
loginApp.controller('loginController', function($scope, $http) {
	// login ajax call
	$scope.processForm = function() {
		$scope.formData = $('#loginForm').serialize();
		$http({
			method : 'POST',
			url : 'login.html',
			data : $scope.formData,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(response) {
			var data = response.data;
			if (data.code == 0) { // success
				window.location.href = '/notes';
			} else {
				alert(data.message);
			}
		}, function(data, status, headers, config) {
			alert('Error occurred. Please try after some time.');
		});
	};
});