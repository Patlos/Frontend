app.controller('signIn', function code($scope, $timeout, user){
	$scope.showSignIn = false;
	$scope.takedUsername = false;

	function present(field){
		return angular.isDefined(field) && field.length > 0
	}

	function defined(field){
		return angular.isDefined(field) && field !== null;
	}

	$scope.cancel = function(){
		$scope.showSignIn = false;
		user.logout();
	}

	$scope.save = function(){
		var u = {};
		if($scope.signUp.$valid){
			u.userName = $scope.userName;
			if(present($scope.email)) {
				u.email = $scope.email;
			}
			user.save(u).$promise.then(function(){
				$scope.showSignIn = false;
			});
		}
	}

	user.get().$promise.then(function(u){
		if(angular.isDefined(u.secureSocialUser)){
			$timeout(function(){
				$scope.$apply(function(){
					$scope.showSignIn = true;
				});
			});
			
			// use email as starting username
			if(defined(u.secureSocialUser.email)){
				$scope.userName = u.secureSocialUser.email.split("@")[0];
				$scope.email = u.secureSocialUser.email;
			}

			// validate if username exists
			$scope.$watch('userName', function(){
				if(present($scope.userName)){
					user.exists($scope.userName).$promise.then(function(d){
						var exists = d.result;
						if(exists) {
							$scope.signUp.userName.$valid = false;
							$scope.signUp.userName.$error.taken = true;
						} else {
							$scope.signUp.userName.$error.taken = false;
						}
					});
				} else {
					$scope.signUp.userName.$error.taken = false;
				}
			});
		} else {
			$scope.showSignIn = false;
		}
	});
});