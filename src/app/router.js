angular.module('router', []).

provider('routes', function() {
	var routes = [
		{title: 'home', path: '/', icon: 'icon-home', selected: true},
		{title: 'gallery', path: '/gallery', icon: 'icon-gallery', selected: false},
		{title: 'about', path: '/about', icon: 'icon-about', selected: false},
		{title: 'contact', path: '/contact', icon: 'icon-contact', selected: false}
	],
	defaultRoute = routes[0];

	this.$get = function() {
		return {
			register: function($routeProvider) {
			    var routeProvider = $routeProvider;
			    for(var i = 0; i < routes.length; i++)
			    	routeProvider = routeProvider.when(routes[i].path, { idx: i });	
			    routeProvider.otherwise({ redirectTo: '/' })
			},
			select: function(route) {
				for(var i = 0; i < routes.length; i++)
					routes[i].selected = false;
				route.selected = true;				
			},
			getList: function() {
				return routes;
			}
		}
	}
}).

config(['$routeProvider', '$locationProvider', 'routesProvider',
  function($routeProvider, $locationProvider, routesProvider) {
    routesProvider.$get().register($routeProvider);
    $locationProvider.html5Mode(true);
}]).

directive('router', ['routes', '$location', function(routes, $location) {
	return {
		restrict: 'A',
		controller: ['$scope', '$attrs', function($scope, $attrs) {
			var model = $scope[$attrs.router] || {},
				routesList = routes.getList();
			
			$scope.$on('$routeChangeSuccess', function(evt, routeData) {
				if (!routeData.$$route)
					return; 
				$scope[$attrs.router] = routesList[routeData.$$route.idx];
				routes.select($scope[$attrs.router]);
			});

			this.setRoute = function(route) {
				$scope[$attrs.router] = route;
				routes.select(route);
				$location.path(route.path);
			}
		}]
	}
}]).	

directive('routeTo', function() {
	return {
		restrict: 'A',
		require: '^router',
		scope: {
			item: '=routeTo',
			initCombo: '@'
		},
		link: function($scope, $element, $attrs, routerCtrl) {
			var evt = "ontouchstart" in document.documentElement ? 'touchstart' : 'mousedown';
			$element.bind(evt, function() {
				if($attrs.initCombo === "") {
					$scope.$root.initTransactionCombo();
				}
				routerCtrl.setRoute($scope.item);
				$scope.$apply();
			});
		}
	}
});