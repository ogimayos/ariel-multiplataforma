// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase', 'ionic.service.core'])

.run(function($ionicPlatform, $ionicLoading, $rootScope, $ionicLoading, $window, $localstorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    $rootScope.token = null;


    $rootScope.refirebase = new Firebase("https://shining-inferno-7335.firebaseio.com");


$rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

$rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.hide = function() {
      $ionicLoading.hide();
    };


  });
})

.config(function($stateProvider, $urlRouterProvider,USER_ROLES) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

.state('sign-in', {
    url: '/sign-in',
    templateUrl: 'templates/sign-in.html',
    controller: 'LoginCtrl'
    //controller: 'SignInCtrl'

    
  })


.state('clientes', {
    url: '/clientes',
    templateUrl: 'templates/clientes.html',
    controller: 'ListController'
    //controller: 'SignInCtrl'

    
  })

.state('tab.clientes-detail', {
    url: '/clientes/:clientesId',
    views: {
      //'tab-clientes-detail': {
        'tab-clientes': {
        templateUrl: 'templates/clientes-detail.html',
        controller: 'ClientesDetailCtrl'
        //controller: 'MapCtrl'
        
      }
    }
  })

.state('tab.clientes-registration', {
    url: '/clientes-registration',
    views: {
      //'tab-clientes': {
      'tab-clientes-registration': {       
        templateUrl: 'templates/clientes-registration.html',
        controller: 'ClientesFormCtrl'
      }
    }
  })


  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })

.state('tab.clientes', {
      url: '/clientes',
      views: {
        'tab-clientes': {
          templateUrl: 'templates/clientes.html',
          controller: 'ListController'
        }
      }
    })

    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

.state('tab.admin', {
  url: 'tab/admin',
  views: {
    'admin-tab': {
      templateUrl: 'templates/admin.html',
      
    }
  },
  data: {
    authorizedRoles: [USER_ROLES.admin]
  }
})

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

.run(function($httpBackend){
  /*$httpBackend.whenGET('http://localhost:8100/valid')
        .respond({message: 'This is my valid response!'});
  $httpBackend.whenGET('http://localhost:8100/notauthenticated')
        .respond(401, {message: "Not Authenticated"});
  $httpBackend.whenGET('http://localhost:8100/notauthorized')
        .respond(403, {message: "Not Authorized"});
 */
  //$httpBackend.whenGET(/templates\/\w+.*/).passThrough();
 })

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
 
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
 
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'sign-in') {
        event.preventDefault();
        $state.go('sign-in');
      }
    }
  });
})
