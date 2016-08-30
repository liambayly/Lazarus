'use strict';

angular.module('myApp.module.Politician.Title.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/title', {
						controller: 'TitleController',
						templateUrl: 'com/modules/Politicians/views/titles.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Title Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/Title',title:'Title Main'}]
			});
		}])


.controller('TitleController',// jshint ignore:line
		['$scope', '$rootScope','$location', 
		function ($scope, $rootScope,$location) {
            
            if(angular.isUndefined($scope.tabActive)){// jshint ignore:line
              $scope.tabActive = 'congress';  
            }

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.message = 'tmp';

			$scope.checkTab = function(T){
                var tmp = false;
                if($location.$$hash === T){
                    tmp = true;
                }
                if($location.$$hash.length === 0){
                    if(T === $scope.tabActive){
                        tmp = true;
                    }
                }
                return tmp;
            };
			


		}]);
