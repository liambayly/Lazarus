'use strict';

angular.module('myApp.module.Contributors.Main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/contributors', {
						controller: 'ContributorsController',
						templateUrl: 'com/modules/Contributors/views/contributors.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Contributors Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/contributors',title:'Contributors Main'}]
			});
		}])


.controller('ContributorsController',// jshint ignore:line
		['$scope', '$rootScope',
		function ($scope, $rootScope) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.message = 'tmp';

			
			


		}]);
