'use strict';

angular.module('myApp.module.Activity.Main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/activity', {
						controller: 'ActivityController',
						templateUrl: 'com/modules/activity/views/activity.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Activity Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/activity',title:'Activity Main'}]
			});
		}])


.controller('ActivityController',// jshint ignore:line
		['$scope', '$rootScope',
		function ($scope, $rootScope) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.message = 'tmp';

			
			


		}]);
