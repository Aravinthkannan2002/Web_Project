var app = angular.module('myApp', ['ngMaterial']);

app.controller('LoginController', ['$scope', '$http','$mdToast', function ($scope, $http,$mdToast) {
    $scope.Showlogin = true;
    $scope.showsignup = false;
    $scope.btnName = "Login";

    $scope.usernameError = false;
    $scope.passwordError = false;
    $scope.emailError = false;
    $scope.userExistsError = false;
    $scope.loginError =false;

    ///////////Username capital 

    $scope.capitalizeUsername = function() {
        if ($scope.username && $scope.username.length > 0) {
            $scope.username = $scope.username.charAt(0).toUpperCase() + $scope.username.slice(1);
        }
    };
    //////valide username

    $scope.validateUsername = function() {
        if ($scope.username) {
            const usernameRegex = /^[A-Z]/;
            $scope.usernameError = !$scope.username.match(usernameRegex);
        } else {
            $scope.usernameError = true;
        }
    
        // Automatically hide the error message if the username starts with an uppercase letter
        if ($scope.username && $scope.username.charAt(0) === $scope.username.charAt(0).toUpperCase()) {
            $scope.usernameError = false;
        }
    };
    
    //////valid pswd with special characters and along with 6 character only

    $scope.validatePassword = function() {
        if ($scope.password) {
            const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
            $scope.passwordError = !$scope.password.match(passwordRegex);
        } else {
            $scope.passwordError = true;
        }
    };
    //////////////valid email with @ and .com

    $scope.validateEmail = function() {
        if ($scope.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            $scope.emailError = !$scope.email.match(emailRegex);
        } else {
            $scope.emailError = true;
        }
    };

    //////////when in login page the button remains Login button

    $scope.loginpage = function() {
        $scope.showsignup = false;
        $scope.Showlogin = true;
        $scope.btnName = "Login";
        $scope.resetErrors();
    };
 
    /////////error are in the the function 

    $scope.resetErrors = function() {
        $scope.usernameError = false;
        $scope.passwordError = false;
        $scope.emailError = false;
        $scope.userExistsError = false;
        $scope.loginError = '';
    };

   ///////////////////submit form only check ussrname,pwd,email are valid and errror checking and input data can be strored in the variable userdatasignup

    $scope.submitForm = function() {
        $scope.validatePassword();
        $scope.validateEmail();

        ////if showsighup true
        if ($scope.showsignup) {
            $scope.validateUsername();

        }
/// we want to check all the conditions are satisfy to login without any error in these fields.

// and operator means both are true and check qwith email and paswd all fields are true it will be executed error toast/false it cannot check if directly hit api

        if($scope.emailError || $scope.passwordError || ($scope.showsignup && $scope.usernameError)){
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Please check your credentials.Try again.')
                    .position('top right')
                    .hideDelay(3000)
            );
             return
        }
       ////if showsighup true

        if ($scope.showsignup) {
            var userDataSignup = {
                username: $scope.username,
                pswwword: $scope.password,
                email: $scope.email
            };
            $scope.signup(userDataSignup);
    
        } 
         ////if showsighup false
        else {
            var userDataLogin = {
                email: $scope.email,
                pswwword: $scope.password
            };
            $scope.login(userDataLogin);
        }
    };

   $scope.checkLoggedIn = function() {
    // Check if the user is logged in
    if (localStorage.getItem('loggedIn') === 'true') {
        // Redirect to homepage
        window.location.href = "http://127.0.0.1:5501/partials/homepage.html";
    }
};
    ///////////login api perform when login button onpressed

    $scope.login = function(userDataLogin) {
        $http.post('http://localhost:1405/login', userDataLogin)
        .then(function(response) {
            $scope.user_data = response.data;  
    
            if ($scope.user_data.success) {
                // Set logged in flag in local storage
                localStorage.setItem('loggedIn', 'true');
    
                // Redirect to homepage
                window.location.href = "http://127.0.0.1:5501/partials/homepage.html";
            } else {
                // Show toast message for unsuccessful login
                $mdToast.show(
                    $mdToast.simple()
                        .textContent($scope.user_data.msg)
                        .position('top right')
                        .hideDelay(3000)
                );
            }
        })
       
    };
    


// Call checkLoggedIn when the login page is loaded
$scope.checkLoggedIn();


   ///////////////when in signup page the login button chnaged to Signup Button 

   $scope.signuppage = function() {
    $scope.user_data=[]
    $scope.username = ""
    $scope.password = ""
    $scope.email = ""
    $scope.showsignup = true;
    $scope.Showlogin = false;
    $scope.btnName = "Sign up";
    $scope.resetErrors();
};


    
    ///////signup api  perform  using signup button on pressed

    $scope.signup = function(userDataSignup) {

        //  $scope.userExistsError = false;
       
        $http.post('http://localhost:1405/userinsert', userDataSignup)
        .then(function(res) {
            // store the response in signin data
            $scope.sign_data = res.data;  
if( $scope.sign_data.success){
    $scope.showsignup = false;
    $scope.Showlogin = true;
    ////////Stroring Res.data in User_data
$scope.user_data=res.data;
$scope.btnName = "Login";
$mdToast.show(
    $mdToast.simple()
        .textContent($scope.sign_data.msg)
        .position('top right')
        .hideDelay(3000)
);

}else{
    $mdToast.show(
        $mdToast.simple()
            .textContent($scope.sign_data.msg)
            .position('top right')
            .hideDelay(3000)
    );
}
          
            
        }).catch(function(error) {
            console.error("Error registering user:", error);
        });

    };
}]);




