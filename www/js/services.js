angular.module('starter.services', ['ngCordova'])


.service('AuthService', function($q, $http, USER_ROLES) {

  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
  var resultemail = '';
  var resultpassword = '';
  this.objj2 = '';
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;
 
    if (username == 'admin') {
      role = USER_ROLES.admin
    }
    if (username == 'user') {
      role = USER_ROLES.public
    }
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(name, pw, estado) {

    
/*
var dataObj2 = {
        email : name,
        password : pw,
        headoffice : 'kkkk'
    };  



        $http.post("http://localhost:9090/webservice/userLogin.php", dataObj2).success(function(data, status) {
           this.objj2 = angular.fromJson(data);
            console.log(this.objj2);
        });


    var res = $http.post('http://www.saeta-erp.com/webservice/userLogin.php', dataObj2);
console.log(res);
*/
               /* var request = $http({
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    method: "POST",
                    url: "http://localhost:9090/webservice/userLogin.php",
                    dataType: "jsonp",
ContentType: "application/json",
data: JSON.stringify(dataObj)
                    
                   
                });
                console.log(request);
var objj = angular.fromJson({'uno':'1','dos':'2'});
console.log(objj.uno);*/

/*$http.post("http://localhost:9090/webservice/userLogin.php", dataObj).success(function(result) {
            console.log("Success", result);

            //$scope.result = result;
        }).error(function() {
            console.log("error");
        });*/


    /*$http.get("http://www.saeta-erp.com/webservice/userLogin.php").success(function(result) {
            console.log("Success", result);

            //$scope.result = result;
        }).error(function() {
            console.log("error");
        });
*/



/*

    $http.get('js/data.json').success(function(data){
 //$scope.artists = data;
  console.log(data);
}).error(function(error) {
  //console.log(error);
});
*/





    //console.log('loginnnnn'+name+pw);
    return $q(function(resolve, reject) {

console.log(estado);

        //if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
        if(estado=='User is registered'){
        // Make a request and receive your auth token from your server
        storeUserCredentials(name + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login Failed.');
      }
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});
