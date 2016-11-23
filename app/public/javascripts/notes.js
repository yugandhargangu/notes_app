/**
 * @author Yugandhar Gangu
 * 
 * To include in notes.jade view
 */
var notesApp = angular.module('notesApp', []);
// controller
notesApp.controller('notesList', function($scope, $http) {
	// init
	$scope.page = 1;
	$scope.pages = 0;
	$scope.per_page = 5;
	$scope.count = 0;
	// To split note date 
	$scope.getNoteDate = function(date) {
		return date.substring(0, 10);
	};
	$scope.getNoteTime = function(date) {
		return date.substring(11);
	};
	// Number of notes per page list
	$scope.perPageOptions = [ 5, 10, 20, 50, 100 ];
	// To load notes ajax call
	$scope.loadNotes = function(code, reset) {
		
		// reset to init
		if (reset) {
			$scope.page = 1;
			$scope.pages = 0;
			$scope.count = 0;
		}
		// check request type
		switch (code) {
		case -1: // Go to previous
			if ($scope.page <= 1) {
				return;
			}
			break;
		case 1: // Go to next
			if ($scope.pages <= $scope.page) {
				return;
			}
			break;
		default:
			code = 0;
			break;
		}
		$scope.page = $scope.page + code;
		// ajax call to get note list
		$http({
			method : 'POST',
			url : '/notes',
			data : {
				page : $scope.page,
				per_page : $scope.per_page
			}
		}).then(function(response) {
			var data = response.data;
			$scope.count = data.count;
			$scope.pages = parseInt($scope.count / $scope.per_page);
			$scope.current_count = $scope.count % $scope.per_page;
			if ($scope.current_count > 0) {
				$scope.pages++;
			}
			if (data.count > 0) {
				$scope.notes = data.notes;
			} else {
				alert('No notes found. Please add note.');
			}
		}, function(error) {
			alert('Error occurred. Please try again.');
		});
	};
	// To delete note
	$scope.deleteNote = function(id) {
		var yes = confirm('Do want to delete note?');
		if (yes) {
			$http({
				method : 'POST',
				url : '/notes/delete.html',
				data : {
					id : id
				}
			}).then(function(response) {
				var data = response.data;
				if (data.code == 0) {
					alert('Note deleted successfully.');
					if ($scope.current_count == 1) {
						$scope.page--;
					}
					$scope.loadNotes(0);
				} else {
					alert(data.message);
				}
			}, function(error) {
				alert('Error occurred. Please try again.');
			});
		}
	};
	// Go to view note
	$scope.viewNote = function(id) {
		window.location.href = '/notes/view.html?id=' + id;
	};
	// Go to edit note
	$scope.editNote = function(id) {
		window.location.href = '/notes/edit.html?id=' + id;
	};
	// load notes on page load
	$scope.loadNotes(0, false);
});