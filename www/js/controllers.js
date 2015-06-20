angular.module('starter.controllers', ['ngCordova'])



.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.username = AuthService.username();
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('sign-in');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 
  $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };
})


.controller('ListController', ['$scope','$http', function ($scope,$http) {

//$http.get('js/data.json').success(function(data){
  $http.get('http://www.saeta-erp.com/webservice/clientes.php').success(function(data){
    //$http.get('http://www.saeta-erp.com/webservice/clientes.php').success(function(data){
 $scope.artists = data;
console.log(data);
$scope.onItemDelete = function(item){
  $scope.artists.splice($scope.artists.indexOf(item),1);
}

 $scope.moveItem = function(item, fromIndex, toIndex){
  $scope.artists.splice(fromIndex, 1);
  $scope.artists.splice(toIndex, 0, item);
 };
  //console.log(cards);
}).error(function(error) {
  //console.log(error);
});

}])


.controller('ClientesFormCtrl', function($scope, $http, $ionicPopup, $firebaseArray, $rootScope, $state, $cordovaCamera, $cordovaGeolocation) {


    $scope.cliente = {name: '', sale_price: '', content: {description: ''}, photo: '', lat: -17.37, long: -66.15};


      var myLatlng = new google.maps.LatLng(-17.37, -66.15);

      var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);


      var marker = new google.maps.Marker({
              position: new google.maps.LatLng(-17.37, -66.15),
              map: map,
              title: "Mi locacion",
              options: { draggable: true }
      });







    var posOptions = {timeout: 10000, enableHighAccuracy: false};

    $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      console.log(position);
      $scope.cliente.lat  = position.coords.latitude
      $scope.cliente.long = position.coords.longitude

      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
          
      marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    }, function(err) {
        console.log(err);
    });


    var watchOptions = {
      frequency : 1000,
      timeout : 3000,
      enableHighAccuracy: false // may cause errors if true
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);
    watch.then(
      null,
      function(err) {
        console.log(err);
      },
      function(position) {
        console.log(position);
        $scope.cliente.lat  = position.coords.latitude;
        $scope.cliente.long = position.coords.longitude;

        marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

    });

    google.maps.event.addListener(marker, 'dragend', function() {
        $scope.$apply(function(){
          //Stop listening changes
          watch.clearWatch();
          var pos = marker.getPosition();
          console.log(pos);
          $scope.cliente.lat  = pos.A;
          $scope.cliente.long = pos.F;
        });
    });


    //document.addEventListener("deviceready", function () {

    $scope.takePicture = function() {
          var options = {
              quality : 75,
              destinationType : Camera.DestinationType.DATA_URL,
              sourceType : Camera.PictureSourceType.CAMERA,
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              popoverOptions: CameraPopoverOptions,
              targetWidth: 500,
              targetHeight: 500,
              saveToPhotoAlbum: false
          };
          $cordovaCamera.getPicture(options).then(function(imageData) {
              //syncArray.$add({image: imageData}).then(function() {
              //    alert("Image has been uploaded");
              //});
              console.log(imageData);
              $scope.cliente.photo = imageData;

          }, function(error) {
              console.error(error);
          });
      }
    //}, false);

    $scope.uploadProduct = function(cliente) {
      //var productRef =  $rootScope.refirebase.child("products").push($scope.product);
      //var productId = productRef.key();
      //console.log(productId);
var clientes = {
        name : cliente.name,
        reknown : cliente.reknown,
        image : cliente.photo,
        bio : cliente.bio
    }


$http.post("http://www.saeta-erp.com/webservice/clienteRegistration.php", clientes).success(function(data, status) {
        //$http.post("http://localhost:9090/webservice/userLogin.php", dataObj2).success(function(data, status) {
         //$scope.pp(angular.fromJson(data));
           //return  angular.fromJson(data);
           $scope.cc = angular.fromJson(data);

$state.go('tab.clientes-detail',{clientesId: $scope.cc.idd});
      //$state.go('tab.clientes-detail', {}, {reload: true});
      $scope.setCurrentUsername(data.username);






        }).error(function(error) {
          var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
  //console.log(error);
});

      //$state.go('tab.dash-detail',{productId: productId});
    }


})



.controller('ClientesDetailCtrl', ['$scope','$http','$stateParams', function ($scope,$http, $stateParams) {

//$http.get('js/data.json').success(function(data){
  $http.get('http://www.saeta-erp.com/webservice/clientes.php?cliente='+$stateParams.clientesId).success(function(data){
    //$http.get('http://www.saeta-erp.com/webservice/clientes.php').success(function(data){
 $scope.clientes = data;
//console.log(data);
loadMap();
 
  //console.log(cards);
}).error(function(error) {
  //console.log(error);
});


function loadMap(){

   
var myLatlng = new google.maps.LatLng(-17.37, -66.15);
    //var myLatlng = new google.maps.LatLng($scope.product.lat, $scope.product.long);

    console.log(myLatlng);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map2"), mapOptions);

    var marker = new google.maps.Marker({
            position: new google.maps.LatLng(-17.37, -66.15),
            map: map,
            title: 'mi mapa de ariel'
    });
  }


}])


.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('sign-in');
  };
 
  /*$scope.performValidRequest = function() {
    $http.get('http://localhost:8100/valid').then(
      function(result) {
        $scope.response = result;
        $state.go('clientes', {}, {reload: true});

      });
  };*/
 $scope.performValidRequest = function() {
    
        //$scope.response = result;
        $state.go('clientes', {}, {reload: true});

      
  };
  $scope.performUnauthorizedRequest = function() {
    $http.get('http://localhost:8100/notauthorized').then(
      function(result) {
        
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
 
  $scope.performInvalidRequest = function() {
    $http.get('http://localhost:8100/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = err;
      });
  };
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.config(function($httpProvider) {
      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;

      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

.controller('LoginCtrl', function($scope,$rootScope, $http, $state, $ionicPopup, AuthService) {
  //console.log('AQUI');
  $scope.emailp = '';
  $scope.passwordp = '';
  $scope.papa = '';

/*
var dataObj2 = {
        email : $scope.emailp,
        password : $scope.passwordp,
        headoffice : 'kkkk'
    };  



        $http.post("http://localhost:9090/webservice/userLogin.php", dataObj2).success(function(data, status) {
         $scope.pp(angular.fromJson(data));
            
        });
*/

$scope.pp = function(m){
  //console.log(m);
  $scope.papa = m.message;
};

 $scope.get = function() {
  //console.log('gettttt');
        $http.get("http://www.saeta-erp.com/webservice/userLogin.php").success(function(result) {
            console.log("Success", result);
            $scope.result = result;
        }).error(function() {
            console.log("error");
        });
    };


  $scope.data = {};
 $scope.setCurrentUsername = function(name) {
    $scope.username = name;
  };

  $scope.login = function(data) {


var dataObj2 = {
        email : data.username,
        password : data.password,
        headoffice : 'kkkk'
    }


$http.post("http://www.saeta-erp.com/webservice/userLogin.php", dataObj2).success(function(data, status) {
        //$http.post("http://localhost:9090/webservice/userLogin.php", dataObj2).success(function(data, status) {
         //$scope.pp(angular.fromJson(data));
           //return  angular.fromJson(data);
           $scope.papa = angular.fromJson(data);

AuthService.login(data.username, data.password,$scope.papa.message).then(function(authenticated) {
      $state.go('tab.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });





        })


/*
      AuthService.login(data.username, data.password,$scope.papa).then(function(authenticated) {
      $state.go('tab.dash', {}, {reload: true});
      $scope.setCurrentUsername(data.username);
    }, function(err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
*/


  };
})



.controller('SignInCtrl', ['$scope', '$rootScope', '$window', '$localstorage' , '$ionicUser', 
  function ($scope, $rootScope, $window, $localstorage, $ionicUser) {
     // check session
     //$rootScope.checkSession();
     $scope.user = {
        email: "",
        password: ""
     };



     $scope.validateUser = function () {
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
        function authHandler(error, authData) {
          //console.log('----ariel---'+authData);
          if (error) {
                $rootScope.hide();
                if (error.code == 'INVALID_EMAIL') {
                  $rootScope.notify('Invalid Email Address');
                }
                else if (error.code == 'INVALID_PASSWORD') {
                  $rootScope.notify('Invalid Password');
                }
                else if (error.code == 'INVALID_USER') {
                  $rootScope.notify('Invalid User');
                }
                else {
                  $rootScope.notify('Oops something went wrong. Please try again later');
                }
              }
            else {
              $rootScope.hide();
              //console.log(authData);
              $rootScope.token = authData.token;
              $localstorage.set('token', authData.token);
              //console.log($localstorage.get('token', authData.token));
              //console.log($window.localStorage);

              $ionicUser.identify({
                user_id: authData.uid,
                email: email              
              }).then(function() {
                console.log("Success identify User");
              }, function(err) {
                  console.log("Error identify User");
                  console.log(err);
              });;
              $window.location.href = ('#/tabs/dash');
          }
        }



        $rootScope.refirebase.authWithPassword({
          email    : email,
          password : password
        }, authHandler);
    
     }
  }
])

.controller('MapCtrl', function($scope, $rootScope, $state, $cordovaGeolocation, $stateParams, $firebaseObject) {
  console.log('ingresa a mapa');


  
    loadMap();





function loadMap(){

   
var myLatlng = new google.maps.LatLng(-17.37, -66.15);
    //var myLatlng = new google.maps.LatLng($scope.product.lat, $scope.product.long);

    console.log(myLatlng);

    var mapOptions = {
        center: myLatlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map2"), mapOptions);

    var marker = new google.maps.Marker({
            position: new google.maps.LatLng(-17.37, -66.15),
            map: map,
            title: 'mi mapa de ariel'
    });
  }
    });