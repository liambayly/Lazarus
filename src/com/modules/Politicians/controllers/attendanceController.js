'use strict';

angular.module('myApp.module.Politician.Attendance.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/attendance', {
						controller: 'AttendanceController',
						templateUrl: 'com/modules/Politicians/views/attendance.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Attendance Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/attendance',title:'Attendance Main'}]
			});
		}])


.controller('AttendanceController',// jshint ignore:line
		['$scope', '$rootScope',
		function ($scope, $rootScope) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.message = 'tmp';

			
			


		}]);
