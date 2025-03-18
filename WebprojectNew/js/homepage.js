var homeApp = angular.module('homeApp', ['ngMaterial']);

homeApp.controller('HomeController', ['$scope', '$http', '$window', '$mdToast', function($scope, $http, $window, $mdToast) {
    // Fetch users function
    $scope.fetchusers = function() {
        $http.post('http://localhost:1405/fetchUsers')
            .then(function(response) {
                $scope.userDetails = response.data.users;
                $scope.userDetailsbk = $scope.userDetails;
            })
            .catch(function(error) {
                console.error("Error fetching users:", error);
            });
    };

    $scope.fetchusers();

    $scope.availableYears = [2021, 2022, 2023, 2024, 2025];

    // Filter without API
    $scope.filterRecord = function(selectedYearswithoutapi) {
         $scope.userDetails = $scope.userDetailsbk;
        if (selectedYearswithoutapi === 'all') return;
        $scope.userDetails = $scope.userDetails.filter(user => new Date(user.entereddate).getFullYear().toString() === selectedYearswithoutapi);
    };

    // Logout function
    $scope.logout = function() {
        sessionStorage.clear();
        localStorage.clear();
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        $window.location.href = 'http://127.0.0.1:5501';
        $window.history.replaceState({}, 'Login', 'http://127.0.0.1:5501');
    };

    // Show view popup and when pressing esc to Open popup
    $scope.viewUser = function(user) {
        $scope.selectedUser = angular.copy(user);
        document.getElementById('viewModal').style.display = 'block';
        document.addEventListener('keydown', escKeyListener);
    };

    // Close view popup and when pressing esc to close popup
    $scope.closeViewPopup = function() {
        document.getElementById('viewModal').style.display = 'none';
        document.removeEventListener('keydown', escKeyListener);
    };

    // Show update popup and when pressing esc to open popup
    $scope.showUpdatePopup = function(user) {
        $scope.selectedUser = angular.copy(user);
        document.getElementById('updateModal').style.display = 'block';
        document.addEventListener('keydown', escKeyListenerForUpdate);
    };

    // Close update popup when pressing esc to close popup
    $scope.closeUpdatePopup = function() {
        document.getElementById('updateModal').style.display = 'none';
        document.removeEventListener('keydown', escKeyListenerForUpdate);
    };

    // ESC key listener functions
    function escKeyListener(event) {
        if (['Escape', 'Esc', 27].includes(event.key || event.keyCode)) {
            $scope.closeViewPopup();
            $scope.$apply();
        }
    }

    function escKeyListenerForUpdate(event) {
        if (['Escape', 'Esc', 27].includes(event.key || event.keyCode)) {
            $scope.closeUpdatePopup();
            $scope.$apply();
        }
    }

    // Update user
    $scope.updateuser = function(selectedUsernew) {
        $http.post('http://localhost:1405/updateuser', selectedUsernew)
            .then(function(response) {
                if (response.data.status === 1) {
                    showToast('User updated successfully!', 'bottom left', 'OK', 'my-snackbar');
                    $scope.fetchusers();
                    $scope.closeUpdatePopup();
                } else {
                    showToast('Something went wrong.', 'top right');
                }
            })
            .catch(function(error) {
                console.error('Error updating user:', error);
            });
    };

    // Delete user
    $scope.deleteUser = function(userId) {
        $http.post('http://localhost:1405/deleteUser', { id: userId })
            .then(function(response) {
                if (response.data.status === 1) {
                    showToast('User deleted successfully!', 'top right');
                    $scope.fetchusers();
                } else {
                    showToast('Something went wrong.', 'top right');
                }
            })
            .catch(function(error) {
                console.error('Error deleting user:', error);
            });
    };

    // Toggle user status Active Inactive
    $scope.toggleUserStatus = function(user) {
        const newStatus = user.Status === 'A' ? 'IN' : 'A';
        const apiUrl = newStatus === 'A' ? 'http://localhost:1405/activateUser' : 'http://localhost:1405/inactiveuser';
        const successMessage = newStatus === 'A' ? 'User activated successfully!' : 'User inactivated successfully!';
        $http.post(apiUrl, { id: user.personid })
            .then(function(response) {
                if (response.data.status === 1) {
                    showToast(successMessage, 'top right');
                    user.Status = newStatus;
                } else {
                    user.Status = user.Status === 'A' ? 'IN' : 'A';
                }
            })
            .catch(function(error) {
                console.error('Error updating user status:', error);
            });
    };

    // Toggle password visibility
    $scope.togglePasswordVisibility = function() {
        var passwordField = document.getElementById('password');
        passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
    };

    // Show toast message
    function showToast(message, position, action, toastClass) {
        let toast = $mdToast.simple().textContent(message).position(position).hideDelay(3000);
        if (action) toast.action(action);
        if (toastClass) toast.toastClass(toastClass);
        $mdToast.show(toast);
    }



    // Close modals when clicking outside the popup
    window.onclick = function(event) {
        if (event.target === document.getElementById('updateModal')) {
            $scope.$apply($scope.closeUpdatePopup);
        }
        if (event.target === document.getElementById('viewModal')) {
            $scope.$apply($scope.closeViewPopup);
        }
    };
}]);
