angular.module('MargoSim', [
    /*'ngAnimate', */
    'ngRoute',
    'home',
    'gallery',
    'about',
    'router',
    'dataSource',
    'ngTouch',
    'hideMenu',
    'ui.bootstrap',
    'tile',
    'appAnimations',
    'fileService',
    'ngEnter'
])
.controller('AppCtrl', ['$scope', '$route', 'routes', 'dataSource', '$location',
    function($scope, $route, routes, dataSource, $location) {
        $scope.routes = routes.getList();
    }
])
.controller('CarouselCtrl', ['$scope', 
    function ($scope) {
      $scope.myInterval = 3000;
      $scope.slides = [
      {
        image: 'http://lorempixel.com/400/200/'
      },{
        image: 'http://lorempixel.com/400/200/food'
      },{
        image: 'http://lorempixel.com/400/200/sports'
      },{
        image: 'http://lorempixel.com/400/200/people'
      }
      ];
  }
]);

