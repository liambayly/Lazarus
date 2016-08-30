'use strict';

angular.module('myApp.module.Bills.Category.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/category', {
						controller: 'CategoryController',
						templateUrl: 'com/modules/Bills/views/categories.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Category Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/category',title:'Category Main'}]
			});
		}])


.controller('CategoryController',// jshint ignore:line
		['$scope', '$rootScope','$location', 
		function ($scope, $rootScope, $location) {

            if(angular.isUndefined($scope.tabActive)){// jshint ignore:line
              $scope.tabActive = 'category';  
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
