/**
 * @author Yugandhar Gangu
 * 
 * To include in changepassword.jade view
 */
var chPwdApp = angular.module('chPwdApp', []);
chPwdApp.directive('ngMatch',[ function() {
	return {
		require : 'ngModel',
		link : function($scope, $elem, $attrs, $ctrl) {
			$elem.add($scope.chPwdForm.new_password).on('keyup',function() {
				$scope.$apply(function() {
					var v = $elem.val() === $scope.chPwdForm.new_password.$viewValue;
					$ctrl.$setValidity('match', v);
				});
			});
		}
	};
} ]);

// controller
chPwdApp.controller('chPwdController', function($scope, $http) {
	// update password ajax
	$scope.processForm = function() {
		$scope.formData = $('#chPwdForm').serialize();
		$http({
			method : 'POST',
			url : '/notes/changepassword.html',
			data : $scope.formData,
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			}
		}).then(function(response) {
			var data = response.data;
			if (data.code == 0) { // success
				alert('Password updated successfully.');
			} else {
				alert(data.message);
			}
		}, function(err) {
			alert('Error occurred. Please try after some time.');
		});
	};
});