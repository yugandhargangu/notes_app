/**
 * @author Yugandhar Gangu
 * 
 * To include in signup.jade view
 */
var signUpApp = angular.module('signUpApp', []);

// directive to match passwords
signUpApp.directive('ngMatch',[ function() {
	return {
		require : 'ngModel',
		link : function($scope, $elem, $attrs, $ctrl) {
			$elem.add($scope.signupForm.password).on('keyup',function() {
				$scope.$apply(function() {
					var v = $elem.val() === $scope.signupForm.password.$viewValue;
					$ctrl.$setValidity('match', v);
				});
			});
		}
	};
} ]);

// controller
signUpApp.controller('signupController', function($scope, $http) {
	// signup ajax call
	$scope.processForm = function() {
		$scope.formData = $('#signupForm').serialize();
		$http({
			method : 'POST',
			url : 'signup.html',
			data : $scope.formData,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
		}).then(function(response) {
			var data = response.data;
			console.log(data);
			if (data.code == 0) { // success
				alert('Registration successful. Please login.');
				window.location.href = '/login.html';
			} else {
				alert(data.message);
			}
		}, function(data, status, headers, config) {
			alert('Error occurred. Please try after some time.');
		});
	};
});