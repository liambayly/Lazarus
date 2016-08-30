'use strict';

angular.module('myApp.module.Notifications.Main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/notification', {
						controller: 'NotificationController',
						templateUrl: 'com/modules/notifications/views/notification.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Notification Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/notification',title:'Notification Main'}]
			});
		}])


.controller('NotificationController',// jshint ignore:line
		['$scope', '$rootScope',
		function ($scope, $rootScope) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.message = 'tmp';

			
			


		}]);
