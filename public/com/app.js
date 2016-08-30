'use strict';

//This is the only item you need to edit within the app.js this will change it application wide 
//This will also allow you to use 'app' to tie it to the application and it will inherit everything from the application core
var appName = 'Viper';

//Define the Application in one spot and have an alias that doesn't call all the requirements 
var globalApp = angular.module(appName,[// jshint ignore:line
                                        //'vsGoogleAutocomplete',
                                        'ngAnimate',
                                        'ngCookies',
                                        'ngNotify',
                                        'ngRoute',
                                        'angularCharts',
                                        'mwl.calendar', 
                                        'ui.bootstrap',
                                        'myApp.module.Company.Home.Controller',
                                        'myApp.module.Main.Home.Controller',
                                        'myApp.module.Profile.Main.Controller',
                                        'myApp.module.Wiki.Main.Controller',
                                        'myApp.module.Messaging.Main.Controller',
                                        'myApp.module.Administration.Main.Controller',
                                        'myApp.module.Support.Main.Controller',
                                        'myApp.module.Reporting.Main.Controller',

                                        'myApp.module.Global.Profile.Factory',
                                        'myApp.module.Global.400.Controller',
                                        'myApp.module.Global.401.Controller',
                                        'myApp.module.Global.403.Controller',
                                        'myApp.module.Global.404.Controller',
                                        'myApp.module.Global.500.Controller',
                                        'myApp.module.Global.Authentication.Controller',
                                        'myApp.module.Global.Authentication.Factory',
                                        'myApp.module.Global.Error.Controller',
                                        'myApp.module.Global.Header.Controller',
                                        'myApp.module.Global.Logout.Controller',
                                        'myApp.module.Global.sessionInjector.Factory',
                                        'myApp.module.Bills.Category.Controller',
                                        'myApp.module.Voting.Main.Controller',
                                        'myApp.module.Politician.Title.Controller',
                                        'myApp.module.Politician.Attendance.Controller',
                                        'myApp.module.Contributors.Main.Controller',
                                        'myApp.module.Bills.Main.Controller',
                                        'myApp.module.Politician.main.Controller',
                                        'myApp.module.Notifications.Main.Controller',
                                        'myApp.module.Activity.Main.Controller'

                                       ]);


//Europaapp is used by items that don't require modules loaded, mostly directives that allow it to be part of the application without the need to log the dependencies needed by the application
//overall
var europaApp = angular.module(appName);// jshint ignore:line


//This is the run command within angular and it houses items that are needed to on running the application
//This is the second function to run after .config in the application instantiation
globalApp.run(['$rootScope','$location','$cookieStore', '$cookies', '$http', '$timeout', 'MessageFactory','ngNotify','ProfileFactory','AuthenticationService', 
    function ($rootScope, $location, $cookieStore, $cookies, $http, $timeout, MessageFactory, ngNotify, ProfileFactory,AuthenticationService) {
        
        
        //Setting Global Variables
        $rootScope.authkey = '0';
        $rootScope.loginErrorFlag = false;
        $rootScope.loginError = '';
        $rootScope.userEmail = '';
        $rootScope.preLoader = false;
        $rootScope.errorMessageFlag = false;
        $rootScope.maintenanceMessageFlag = false;
        $rootScope.systemMessageFlag = false;
        $rootScope.recentlyViewed = [];
        $rootScope.comparedProducts = [{id: 0,pic:'', name: '', set: false},{id: 0,pic:'', name: '', set: false},{id: 0,pic:'', name: '', set: false}];
        $rootScope.compareIsFull = false;
        //$rootScope.itemsinCart = 0;
        //$rootScope.totalCart = 0;
        //$rootScope.Cart = [];
        $rootScope.mainNavActive = {};
        // keep user logged in after page refresh
        //This sets the user credentials to the cookieStore allowing the user to stay logged in even after they close the browse
        $rootScope.globals = $cookieStore.get('globals') || {};
        $rootScope.rememberMe = $cookies.get('rememberme') || {};
        $rootScope.sso = $cookies.get('sso') || {};
		



        //-----------------FUNCTIONS-----------------
        //-------------------------------------------

        //Add items to the breadcrumb trail, this allows us the ability to append the breadcrumb system link
        $rootScope.appendBreadCrumb = function(view, title){
            $rootScope.breadCrumb = $rootScope.breadCrumb.concat([{view: view,title: title}]);
            return $rootScope.breadcrumb;
        };

		$rootScope.loginWToken = function(authKey){
            AuthenticationService.LoginWithToken(authKey, function(response) {
                
                var user = response.data[0];
                
                if(user.isauth) {
                    $rootScope.authkey = user.authkey;
                    $rootScope.salesRepId = user.salesrepid;
                    $rootScope.userEmail = user.email;
                    AuthenticationService.SetCredentials(user, $rootScope.rememberMe);

                }else {
                    $rootScope.loginErrorFlag = true;
                    $rootScope.loginError = user.retmessage;
                }
                
            });
            
		};
        
        
        //This is the range function , this is global since it can be used to run an ng-repeat or other item 
        //Using this to allow us to do ng-repeat on a numeric step index. 
        $rootScope.range = function(min, max, step){
            step = step || 1;
            var input = [];
            for (var i = min; i <= max; i += step) input.push(i);// jshint ignore:line
            return input;
          };
        
        $rootScope.checkErrorMessage = function(){
            MessageFactory.getErrorMessage(function(dataResponse) {
            $rootScope.errorMessage = dataResponse.data[0];
                if($rootScope.errorMessageFlag === false){
                    if($rootScope.errorMessage.success === 1){
                        $rootScope.errorMessageFlag = true;
                        ngNotify.addType('europaError', 'message__error');
                        ngNotify.set($rootScope.errorMessage.message, {type: 'europaError', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
        
        $rootScope.checkMaintenanceMessage = function(){
            MessageFactory.getMaintenanceMessage(function(dataResponse) {
            $rootScope.MaintenanceMessage = dataResponse.data[0];
                if($rootScope.maintenanceMessageFlag === false){
                    if($rootScope.MaintenanceMessage.success === 1){
                        $rootScope.maintenanceMessageFlag = true;
                        ngNotify.addType('europaMaintance', 'message__maintenance');
                        ngNotify.set($rootScope.MaintenanceMessage.message, {type: 'europaMaintance', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
        
        $rootScope.checkSystemMessage = function(){
            MessageFactory.getSystemMessage(function(dataResponse) {
            $rootScope.SystemMessage = dataResponse.data[0];
                if($rootScope.systemMessageFlag === false){
                    if($rootScope.SystemMessage.success === 1){
                        $rootScope.systemMessageFlag = true;
                        ngNotify.addType('europaSystem', 'message__system');
                        ngNotify.set($rootScope.SystemMessage.message, {type: 'europaSystem', position: 'top', html: true, sticky: true, duration: 4000});   
                    }
                }
            });
        };
		
		
        //-----------------INIT PROCESSING-----------------
        //-------------------------------------------------

        //IE 11 has not console object unless you open the dev tools this is so when you open the website without dev tools we can call the console.log function without 
        // Avoid `console` errors in browsers that lack a console.
        (function() {
            var methods = [
                'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
                'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
                'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
                'timeStamp', 'trace', 'warn'
            ];
            window.console = window.console || {};
            for( var index = 0; index < methods.length; index++){
                // Only stub undefined methods.
                if (!window.console[ methods[index] ]) {
                    window.console[ methods[index] ] = function () {};
                }
            }
        }());

        //check auth info
        if ($rootScope.sso.length) {
            $rootScope.loginWToken($cookies.get('sso'));
            $http.defaults.headers.common['Authorization'] = 'Verification ' + ' Anonymous'; // jshint ignore:line
            globalApp.value('user', {
                authKey: $rootScope.sso
            });
        }

        //This is the call to set the profile information 
        ProfileFactory.getProfile(function(dataResponse) {
            $rootScope.serverProfile = dataResponse.data[0];
        });
                
        $timeout(function killPreLoader() {
            $rootScope.preLoader = true;
            //There is an issue with the screen flashing on the init load.
            //It flashes as the ng-if and ng-show will not happen until angular and all the modules load. So to hide this we can't use angular.
            //We attached a hide class to the main content to hide the content when th app loads we remove the class so the ng-show will be able to do it's thing
            $('#indexHTMLContent').removeClass('hide');// jshint ignore:line
            $( "#indexHTMLContent" ).fadeIn( 700, function() {// jshint ignore:line
              // Animation complete
            });
            //$( "#indexHTMLLoader" ).fadeOut( "slow", function() {});// jshint ignore:line
        }, 2000);
        
        //End of the compare functions that run the compare object
 
        //Once all of the dependencies are resolved $routeChangeSuccess is fired.
        //This has a few functions that the application uses including setting the active for the menu and the dynamic title
        $rootScope.$on('$routeChangeSuccess', function(event, current, previous){// jshint ignore:line
                //Change page title, based on Route information
                $rootScope.pageTitle = current.$$route.title;
                $rootScope.menuGroup = current.$$route.menuGroup;
                $rootScope.protected = current.$$route.protectedArea;
                $rootScope.metaDescription = current.$$route.description;
                $rootScope.keywords = current.$$route.metaKeywords;
                $rootScope.breadCrumb = current.$$route.breadcrumbList;

                $rootScope.checkErrorMessage();
                $rootScope.checkMaintenanceMessage();
                $rootScope.checkSystemMessage();

                //Redirects the user from protected areas if they are not logged in.
                if(current.$$route.protectedArea && !$rootScope.globals.currentUser){
                    $location.path('/');
                }
                
                /*
                    This handles the mainNavbar highlighting
                    The controller should have either menuGroup='Store' 
                    or an chain in an array menuGroup=['company', 'companyEvents']
                    the string will only highlight the main navbar section but if you want
                    to highlight a deeper set use the array method these names should match
                    with the ng-class assigned to the element in question
                */
                $rootScope.mainNavActive = {};
                if(typeof current.$$route.menuGroup === 'object'){
                    for (var index = 0; index < current.$$route.menuGroup.length; index++) {
                        $rootScope.mainNavActive[current.$$route.menuGroup[index]] = 'mainNav--active';
                    }
                }else if(typeof current.$$route.menuGroup === 'string'){
                    $rootScope.mainNavActive[current.$$route.menuGroup] = 'mainNav--active';
                }

                $rootScope.isActive = function (viewLocation) { 
                    return viewLocation === current.$$route.menuGroup;
                };
        });
        
        
    }]);


//This is the default route all routes are located within the modules thus making them stand alone objects so to speak 
//setting this will change the default location that the spa points to . 
europaApp.config(['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider',  function ($routeProvider, $locationProvider, $httpProvider, $compileProvider) {// jshint ignore:line

    $httpProvider.interceptors.push('sessionInjector');
    
    $routeProvider.otherwise({ redirectTo: '/' });
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    

    //http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';// jshint ignore:line



    $compileProvider.debugInfoEnabled(true); //change this to false for production
    // enable html5Mode for pushstate ('#'-less URLs)
    $locationProvider.html5Mode({
        enabled : true,
        requireBase: false
    });
        
    //This is the global interceptor that will handle the 401 error and reload the page 
    $httpProvider.interceptors.push(function ($q) {
        return {
            'response': function (response) {
                //Will only be called for HTTP up to 300
                return response;
            },
            'responseError': function (rejection) {
                if(rejection.status === 401) {
                    //location.reload();
                    //location.path('/401');
                }
                if(rejection.status === 404) {
                    //location.path('/404');
                }
                if(rejection.status === 405) {
                    //Put Error Handling Here
                }
                if(rejection.status === 400) {
                    //location.path('/400');
                }
                if(rejection.status === 304) {
                    //Put Error Handling Here
                }
                if(rejection.status === 500) {
                    //location.reload();
                    //location.path('/500');
                }
                return $q.reject(rejection);
            }
        };
    });
    
    //End of the interceptor
}]);

'use strict';

//This is the directive specification pulling in the view template and restricting the use of the directive. 
europaApp.directive('breadcrumb', function() {// jshint ignore:line
  return {
    restrict: 'A',
    controller: 'breadcrumbController',
    templateUrl: '/com/directives/views/breadcrumb.html',
    scope : {breadcrumb : '@'}
  };
});

//This is the controller with functions that are specific to the pagination, because some of those functions are global they have been added into the 
//application wide scope for use in the application. if you need to debug them you can do that in the app.js but they should be working fine and not require 
//editing 
europaApp.controller('breadcrumbController',// jshint ignore:line
    ['$scope','$rootScope', function ($scope, $rootScope) {// jshint ignore:line
        $scope.breadcrumbData = $rootScope.breadCrumb;
        $scope.pageTitle = $rootScope.pageTitle;
    	if($scope.breadcrumb === undefined){
    		$scope.breadcrumb = 'content';
    	}
        
    	$scope.check = function(value){
    		return (value === $scope.breadcrumb);
    	};
        
    }]);
/* jshint ignore:start */
'use strict';

europaApp.directive("loadMoreData", [function() {
        return {
            restrict: 'ACE',
            link: function($scope, element, attrs, ctrl) {
                var raw = element[0];
                element.scroll(function() {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight){
                        $scope.$apply("loadMoreData()");
                    }
                });
            }
        };
 
}])
/* jshint ignore:end */
//This is the paginate directive , this directive also pulls a template to show the pagination bar 
//with a few variables this directive will control pagination on the specified page, this is an attribute
//restriction so you can use it like this <span paginate></span> and by setting currPage and pageSize (number of items per page)
//this will show and paginate through items on the page . view the events.html for a full example of it. 
'use strict';

//This is the directive specification pulling in the view template and restricting the use of the directive. 
europaApp.directive('paginate', function() {// jshint ignore:line
	return {
		restrict: 'A',
		controller: 'paginationController',
		templateUrl: '/com/directives/views/paginate.html'
	};
});


//This is the filter that filters the information on the ng-repeat to show only the items per page. 
europaApp.filter('pagination', function(){// jshint ignore:line
	return function(input, start){
		start =+ start;
		//return input.slice(start);
	};
	
});


//This is the controller with functions that are specific to the pagination, because some of those functions are global they have been added into the 
//application wide scope for use in the application. if you need to debug them you can do that in the app.js but they should be working fine and not require 
//editing 
europaApp.controller('paginationController', ['$scope','$rootScope', function ($scope,$rootScope) { // jshint ignore:line
		
		//This function will calculate the number of pages based on pageSize by dividing the data by it. 
		//This is used to tell you how many pages total are going to be displayed 
		//This function checks the total pages to see if you have gone beyond the beginning or end allowing you to disable the prev and next button

		$scope.pageNumber = 1;
		
		//This updates outside sources such as the rootScope
		$scope.$watch('pageNumber', $scope.update);
		$rootScope.$watch('pageSize', function(){
			//This will reset the page number to 1 when the user changed the amount shown on each page.
			$scope.pageNumber = 1;
			$scope.update(1, 1);
		});

		$scope.update = function(newValue){
			$scope.pageNumber = Number.parseInt($scope.pageNumber);
			if($scope.pageNumber > $scope.pagPageCount($scope.dataList,$scope.pageSize) ){
				$scope.pageNumber = $scope.pagPageCount($scope.dataList,$scope.pageSize);
			}
			if(!$scope.pageNumber || $scope.pageNumber < 1){
				$scope.pageNumber = 1;
			}
			$rootScope.pstart =  $rootScope.pageSize * (newValue - 1) + 1;
			$rootScope.pend =  $rootScope.pageSize * newValue;
			$rootScope.curPage = newValue - 1;
			return $rootScope.curPage;
		};

		$scope.numberOfPages = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		//This gives you the PageCount minus one to show the pages on the pagination
		$scope.pagPageCount = function(dataList,pageSize) {
			return Math.ceil(dataList.length / pageSize);
		};
		
		$scope.getCurrPage = function(){
			return $rootScope.curPage + 1;
		};
		$scope.addPageNumberBy = function(value){
			$scope.pageNumber+=value;
			return $scope.pageNumber;
		};
		

//-----------------------

		$scope.checkTotalPages = function(thisPage,dataList,pageSize) {
			var tmpTotal = Math.ceil(dataList.length / pageSize);
			var tmpReturn = false;
				if(thisPage <= tmpTotal){
					tmpReturn = true;
				}
			return tmpReturn;
		};
		
		$scope.checkBeginningPage = function(page) {
			 var tmpret = true;
			if(page <= 0){
				   tmpret = false;
			}
			return tmpret;
		};
		
		//This tells you wether you are on the current page , allowing you to activate the page number on pagination 
		$scope.isCurrentPage = function(thisPage) {
			var tmpReturn = false;
			if (thisPage === $rootScope.curPage){
				tmpReturn = true;   
			}
			return tmpReturn;
		};
		
		$scope.showPage = function(ind){
			var tmpRet = false;
			if(ind >=5){
				tmpRet = true;
			}else{
				tmpRet = false;
			}
			return tmpRet;
		};

		$scope.SetElipses = function(){
			if(!$scope.showElipses){
			   $scope.showElipses = true;
			}
		};
		
		$scope.setPaginationClass = function(tmp){
			var tmpClass = '';
		  if(tmp){
			  tmpClass = 'pagination__link pagination--current';
		  }else{
			  tmpClass = 'pagination__link'; 
		  }
			return tmpClass;
		};
		
	}]);



//This is a simple directive example that showcases how to create a basic directive. 
//This is a mouseover directive 
'use strict';

europaApp.directive('showsMessageWhenHovered', function() {// jshint ignore:line
  return function(scope, element, attributes) {
    var originalMessage = scope.message;
    element.bind('mouseenter', function() {
      scope.message = attributes.message;
      scope.$apply();
    });
    element.bind('mouseleave', function() {
      scope.message = originalMessage;
      scope.$apply();
    });
  };
});


/* jshint ignore:start */
'use strict';
europaApp.directive('slick', [
  '$timeout',
  function ($timeout) {
    return {
      restrict: 'AEC',
      scope: {
        initOnload: '@',
        data: '=',
        currentIndex: '=',
        accessibility: '@',
        adaptiveHeight: '@',
        arrows: '@',
        asNavFor: '@',
        appendArrows: '@',
        appendDots: '@',
        autoplay: '@',
        autoplaySpeed: '@',
        centerMode: '@',
        centerPadding: '@',
        cssEase: '@',
        customPaging: '&',
        dots: '@',
        draggable: '@',
        easing: '@',
        fade: '@',
        focusOnSelect: '@',
        infinite: '@',
        initialSlide: '@',
        lazyLoad: '@',
        onBeforeChange: '&',
        onAfterChange: '&',
        onInit: '&',
        onReInit: '&',
        onSetPosition: '&',
        pauseOnHover: '@',
        pauseOnDotsHover: '@',
        responsive: '=',
        rtl: '@',
        slide: '@',
        slidesToShow: '@',
        slidesToScroll: '@',
        speed: '@',
        swipe: '@',
        swipeToSlide: '@',
        touchMove: '@',
        touchThreshold: '@',
        useCSS: '@',
        variableWidth: '@',
        vertical: '@',
        prevArrow: '@',
        nextArrow: '@'
      },
      link: function (scope, element, attrs) {
        var destroySlick, initializeSlick, isInitialized;
        destroySlick = function () {
          return $timeout(function () {
            var slider;
            slider = $(element);
            slider.slick('unslick');
            slider.find('.slick-list').remove();
            return slider;
          });
        };
        initializeSlick = function () {
          return $timeout(function () {
            var currentIndex, customPaging, slider;
            slider = $(element);
            if (scope.currentIndex != null) {
              currentIndex = scope.currentIndex;
            }
            customPaging = function (slick, index) {
              return scope.customPaging({
                slick: slick,
                index: index
              });
            };
            slider.slick({
              accessibility: scope.accessibility !== 'false',
              adaptiveHeight: scope.adaptiveHeight === 'true',
              arrows: scope.arrows !== 'false',
              asNavFor: scope.asNavFor ? scope.asNavFor : void 0,
              appendArrows: scope.appendArrows ? $(scope.appendArrows) : $(element),
              appendDots: scope.appendDots ? $(scope.appendDots) : $(element),
              autoplay: scope.autoplay === 'true',
              autoplaySpeed: scope.autoplaySpeed != null ? parseInt(scope.autoplaySpeed, 10) : 3000,
              centerMode: scope.centerMode === 'true',
              centerPadding: scope.centerPadding || '50px',
              cssEase: scope.cssEase || 'ease',
              customPaging: attrs.customPaging ? customPaging : void 0,
              dots: scope.dots === 'true',
              draggable: scope.draggable !== 'false',
              easing: scope.easing || 'linear',
              fade: scope.fade === 'true',
              focusOnSelect: scope.focusOnSelect === 'true',
              infinite: scope.infinite !== 'false',
              initialSlide: scope.initialSlide || 0,
              lazyLoad: scope.lazyLoad || 'ondemand',
              beforeChange: attrs.onBeforeChange ? scope.onBeforeChange : void 0,
              onReInit: attrs.onReInit ? scope.onReInit : void 0,
              onSetPosition: attrs.onSetPosition ? scope.onSetPosition : void 0,
              pauseOnHover: scope.pauseOnHover !== 'false',
              responsive: scope.responsive || void 0,
              rtl: scope.rtl === 'true',
              slide: scope.slide || 'div',
              slidesToShow: scope.slidesToShow != null ? parseInt(scope.slidesToShow, 10) : 1,
              slidesToScroll: scope.slidesToScroll != null ? parseInt(scope.slidesToScroll, 10) : 1,
              speed: scope.speed != null ? parseInt(scope.speed, 10) : 300,
              swipe: scope.swipe !== 'false',
              swipeToSlide: scope.swipeToSlide === 'true',
              touchMove: scope.touchMove !== 'false',
              touchThreshold: scope.touchThreshold ? parseInt(scope.touchThreshold, 10) : 5,
              useCSS: scope.useCSS !== 'false',
              variableWidth: scope.variableWidth === 'true',
              vertical: scope.vertical === 'true',
              prevArrow: scope.prevArrow ? $(scope.prevArrow) : void 0,
              nextArrow: scope.nextArrow ? $(scope.nextArrow) : void 0
            });
            slider.on('init', function (sl) {
              if (attrs.onInit) {
                scope.onInit();
              }
              if (currentIndex != null) {
                return sl.slideHandler(currentIndex);
              }
            });
            slider.on('afterChange', function (event, slick, currentSlide, nextSlide) {
              if (scope.onAfterChange) {
                scope.onAfterChange();
              }
              if (currentIndex != null) {
                return scope.$apply(function () {
                  currentIndex = currentSlide;
                  return scope.currentIndex = currentSlide;
                });
              }
            });
            return scope.$watch('currentIndex', function (newVal, oldVal) {
              if (currentIndex != null && newVal != null && newVal !== currentIndex) {
                return slider.slick('slickGoTo', newVal);
              }
            });
          });
        };
        if (scope.initOnload) {
          isInitialized = false;
          return scope.$watch('data', function (newVal, oldVal) {
            if (newVal != null) {
              if (isInitialized) {
                destroySlick();
              }
              initializeSlick();
              return isInitialized = true;
            }
          });
        } else {
          return initializeSlick();
        }
      }
    };
  }
]);
/* jshint ignore:end */
'use strict';
/* jshint ignore:start */
europaApp.filter('firstVendorLetterSearch', function() {
   return function(items, word) {
    var filtered = [];

    angular.forEach(items, function(item) {

        var vendornameLowCase = item.vendorname || "";
        var wordLowCase = word || "";
        vendornameLowCase = vendornameLowCase.toLowerCase();
        wordLowCase = wordLowCase.toLowerCase();

        if(vendornameLowCase.indexOf(wordLowCase) !== -1){
            filtered.push(item);
        }
    });

    filtered.sort(function(a,b){

        var vendornameLowCaseA = a.vendorname || "";
        var vendornameLowCaseB = b.vendorname || "";
        var wordLowCase = word || "";
        vendornameLowCaseA = vendornameLowCaseA.toLowerCase();
        vendornameLowCaseB = vendornameLowCaseB.toLowerCase();
        wordLowCase = wordLowCase.toLowerCase();

        if(vendornameLowCaseA.indexOf(wordLowCase) < vendornameLowCaseB.indexOf(wordLowCase)) return -1;
        else if(vendornameLowCaseA.indexOf(wordLowCase) > vendornameLowCaseB.indexOf(wordLowCase)) return 1;
        else return 0;
    });

    return filtered;
  };
});
/* jshint ignore:end */
'use strict';
/* jshint ignore:start */
europaApp.filter('firstVendorLetter', function() {
    return function(input, letter) {
      return (input || []).filter(function(item) {
      	if(letter === '#'){
      		//checks if the first character is not A-Z or a-z
      		return (item.vendorname.charAt(0).search(/^[a-zA-Z]*$/) === -1);
      	}else{
        	return item.vendorname.charAt(0).toUpperCase() === letter;
      	}
      });
    };
  });
/* jshint ignore:end */
/* jshint ignore:start */
europaApp.filter('showAsHTML', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
/* jshint ignore:end */

'use strict';
/* jshint ignore:start */
europaApp.filter('urlencode', function() {
  return function(input) {
    return window.encodeURIComponent(input);
  }
});
/* jshint ignore:end */
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Administration.Main.Factory', [])// jshint ignore:line

.factory('AdminFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Administration Factory';

            service.message = 'This is the Administration Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Administration.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Administration.Main.Factory',
                                                                                                                'myApp.module.Reporting.Graph.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/administration', {
						controller: 'AdminController',
						templateUrl: 'com/modules/Administration/views/administration.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Administration Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/administration',title:'Administration Main'}]
			});
		}])


.controller('AdminController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'AdminFactory','GraphFactory',
		function ($scope, $rootScope, $location, AdminFactory,GraphFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = AdminFactory.message;

            $scope.chartType = 'bar';
	
	$scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };
	
	
	$scope.config1 = {
		labels: false,
		title: 'Products',
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 110,
		outerRadius: 100
	};

	$scope.config2 = {
		labels: false,
		title: 'HTML-enabled legend',
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'traditional'
	};

	
  //This is the Featured Products System
			GraphFactory.getGraphBanners(function(dataResponse) {
					$scope.data = dataResponse.graph[0];
			});
	
	
			GraphFactory.getGraphBanners2(function(dataResponse) {
					$scope.data1 = dataResponse.graph[0];
			});
	
			GraphFactory.getGraphBanners3(function(dataResponse) {
					$scope.data2 = dataResponse.graph[0];
			});
            
		}]);

'use strict';

angular.module('myApp.module.Company.Home.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Global.Message.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/', {
						controller: 'HomeController',
						templateUrl: 'com/modules/Company/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Welcome',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'Home'}]
			});
		}])


.controller('HomeController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'MessageFactory',
		function ($scope, $rootScope, $location, MessageFactory) {

			$scope.message = 'This is the Home page message from the controller';

			
			//This gets the Initial Error Message
			MessageFactory.getErrorMessage(function(dataResponse) {
					$scope.globalErrorMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/error');
					}
					$rootScope.globalErrorMessage = dataResponse.data;
			});

			//This gets the Maintenance  Message
			MessageFactory.getMaintenanceMessage(function(dataResponse) {
					$scope.globalMaintenanceMessage = dataResponse.data;
					$rootScope.globalMaintenanceMessage = dataResponse.data;
					if(dataResponse.data.Active === 'true'){
							 $location.path('/maintenance');
					}
			});

			
			//This gets the System  Message
			MessageFactory.getSystemMessage(function(dataResponse) {
					$scope.globalSystemMessage = dataResponse.data;
			});


		}]);

'use strict';

angular.module('myApp.module.Bills.Main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/bills', {
						controller: 'BillsMainController',
						templateUrl: 'com/modules/Bills/views/bills.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Bills Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/bills',title:'Bills Main'}]
			});
		}])


.controller('BillsMainController',// jshint ignore:line
		['$scope', '$rootScope','$location',
		function ($scope, $rootScope,$location) {

            if(angular.isUndefined($scope.tabActive)){// jshint ignore:line
              $scope.tabActive = 'initial';  
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

'use strict';

angular.module('myApp.module.Global.400.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/400', {
            controller: '400Controller',
            templateUrl: 'com/modules/Global/views/400.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '400',
            description: 'This is the 400 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '400 Error'}]
      });
    }])


    .controller('400Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 400 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.401.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/401', {
            controller: '401Controller',
            templateUrl: 'com/modules/Global/views/401.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '401',
            description: 'This is the 401 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '401 Error'}]
      });
    }])


    .controller('401Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 401 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.403.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/403', {
            controller: '403Controller',
            templateUrl: 'com/modules/Global/views/403.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '403',
            description: 'This is the 403 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '403 Error'}]
      });
    }])


    .controller('403Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 403 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.404.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/404', {
            controller: '404Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '404',
            description: 'This is the 404 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '404 Error'}]
      });
    }])


    .controller('404Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 404 error!';
    }]);
'use strict';

angular.module('myApp.module.Global.500.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/500', {
            controller: '500Controller',
            templateUrl: 'com/modules/Global/views/404.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'About',
            menuGroup: '500',
            description: 'This is the 500 controller',
            keywords: 'Site Error',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/error', title: '500 Error'}]
      });
    }])


    .controller('500Controller', ['$scope', function($scope) {
        $scope.message = 'This is the 500 error!';
    }]);
//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Authentication.Controller', ['ngRoute',// jshint ignore:line
                                                                 'myApp.module.Global.Authentication.Factory'])


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/login', {
            controller: 'LoginController',
            templateUrl: 'com/modules/Global/views/login.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Login',
            menuGroup: 'Login',
            description: 'This is the Description of the Login page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'},{view: '/login', title: 'Login Main'}]
      });
    }])

.controller('LoginController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        //AuthenticationService.ClearCredentials();
 
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, $scope.rememberme, function(response) {
                
                $scope.user = response.data[0];
                
                if($scope.user.isauth) {
                    $rootScope.authkey = $scope.user.authkey;
                    $rootScope.salesRepId = $scope.user.salesrepid;
                    $rootScope.userEmail = $scope.user.email;
                    AuthenticationService.SetCredentials($scope.user, $scope.rememberme);
                    
                    $scope.username = '';
                    $scope.password = '';
                    $location.path('/main');
                    
                }else {
                    $rootScope.loginErrorFlag = true;
                    $rootScope.loginError = $scope.user.retmessage;
                    $scope.dataLoading = false;
                }
                
            });
            
            
            
            return $rootScope;
        };
        
        $scope.logout = function () {
            
            AuthenticationService.ClearCredentials();
            console.log('LOGGED OUT');
			//$location.path('/loginPage');
        };
    }]);
'use strict';

angular.module('myApp.module.Global.Error.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/error', {
            controller: 'errorController',
            templateUrl: 'com/modules/Global/views/error.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Error Screen',
            menuGroup: 'Error',
            description: 'This is the Error Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/error', title: 'There Has been an Error'}]
      });
    }])


    .controller('errorController', ['$scope', function($scope) {
        $scope.message = 'There has been an error!';
    }]);
//This is the home controller that simply sets a message and returns it to the view.
'use strict';

angular.module('myApp.module.Global.Header.Controller', ['ngRoute', // jshint ignore:line
                                                         ])


.controller('HeaderController',// jshint ignore:line
    ['$scope', '$rootScope','$location', 'AuthenticationService', 
    function ($scope, $rootScope) {
        
      $scope.message = 'This is the Header Message';
      $rootScope.message = 'This is hte test rootscope message';
        
        

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }]);
//This is the Controller for the login process this process brings the service information (Login info)
//Then it takes it and sets the credentials and clears the credentials
'use strict';


angular.module('myApp.module.Global.Logout.Controller', ['ngRoute','myApp.module.Global.Authentication.Factory'])// jshint ignore:line


.config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/logout', {
            controller: 'LogoutController',
            templateUrl: 'com/modules/Global/views/logout.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Logout',
            menuGroup: 'Login',
            description: 'This is the Description of the Logout page',
            keywords: 'Login,Authentication',
            breadcrumbList: [{view: '/',title:'Home'}]
      });
    }])

.controller('LogoutController',// jshint ignore:line
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();
        //$location.path('/');
    }]);
'use strict';

angular.module('myApp.module.Global.Maintenance.Controller', ['ngRoute'])// jshint ignore:line
    

    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider.when('/maintenance', {
            controller: 'maintenanceController',
            templateUrl: 'com/modules/Global/views/maintenance.html',
            hideMenus: true,
            protectedArea: false,
            clearFoundation: true,
            title: 'Maintenance Screen',
            menuGroup: 'Home',
            description: 'This is the Maintenance Screen',
            keywords: 'error,danger,thiserror',
            breadcrumbList: [{view: '/', title: 'Home'}, {view: '/maintenance', title: 'Maintenance'}]
      });
    }])


    .controller('maintenanceController', ['$scope', function($scope) {
        $scope.message = 'The System is in Maintenance Mode!';
    }]);

//This is the Authentication Service, this service returns the login information for the user 
'use strict';

angular.module('myApp.module.Global.Authentication.Factory', [])// jshint ignore:line


.factory('AuthenticationService',// jshint ignore:line
    ['Base64', '$http', '$cookieStore', '$cookies', '$rootScope',
    function (Base64, $http, $cookieStore, $cookies, $rootScope) {
        var service = {};

        service.Login = function (username, password, remme, callback) {


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/Mercury/login/authenticate/', { username: username, password: password })
            //    .success(function (response) {
             //       $rootScope.loginErrorFlag = false;
             //       $rootScope.loginError = '';
             //      callback(response);
             //   }).error(function(){
              //      $rootScope.loginErrorFlag = true;
              //      $rootScope.loginError = 'There was a problem communicating with the server';
              //  });

            
            /*Local Auth Test
            --------------------------------------------------------*/
            
            $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/User/getUser.json'
                     }).success(function(data){
                        $rootScope.loginErrorFlag = false;
                        $rootScope.loginError = '';
                        callback(data);
                    }).error(function(){
                       $rootScope.loginErrorFlag = true;
                        $rootScope.loginError = 'There was a problem communicating with the server';
                    });
            
            
        };
		
		
		service.LoginWithToken = function (token, callback) {


            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/Mercury/login/authenticate2/', { authKey: token })
            //    .success(function (response) {
             //       $rootScope.loginErrorFlag = false;
             //       $rootScope.loginError = '';
             //      callback(response);
              //  }).error(function(){
              //      $rootScope.loginErrorFlag = true;
              //      $rootScope.loginError = 'There was a problem communicating with the server';
              //  });
            
            
            /* local authentication test 
            --------------------------------------------------------*/
            
            $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/User/getUser.json'
                     }).success(function(data){
                        $rootScope.loginErrorFlag = false;
                        $rootScope.loginError = '';
                        callback(data);
                    }).error(function(){
                       $rootScope.loginErrorFlag = true;
                        $rootScope.loginError = 'There was a problem communicating with the server';
                    });

        };
        
        
        //This is the set credentials function this function sets the credentials (after encrypting them) 
        //to a global function that then gets set to a cookie to allow people to come back to the site and
        //log back in. 
        service.SetCredentials = function (user, remme) {
            var authdata = Base64.encode(user.username + ':' + user.firstname+ ':' + user.lastname);
 
            $rootScope.globals = {
                currentUser: {
                    username: user.username,
                    authdata: authdata,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    authkey: user.authkey,
                    franchiseid: user.franchiseid,
                    groupperm: user.groupperm,
                    useraccountid: user.useraccountid,
                    superuser: user.superuser,
                    salesrepid: user.salesrepid,
                    retmessage: user.retmessage,
                    rememberme: remme
                }
            };
			
			$rootScope.sso = user.authkey;
 
            $http.defaults.headers.common['Authorization'] = 'Verification ' + authdata; // jshint ignore:line
            
            //This is the remember me cookie
            $cookies.put('rememberme', remme);
            
            if(remme){
                $cookies.put('sso', $rootScope.globals.currentUser.authkey, ['domain','europa-sports.net']);
				$cookieStore.put('globals', $rootScope.globals);
            }else{
                $cookies.put('sso', $rootScope.globals.currentUser.authkey, ['domain','europa-sports.net']);
            }
        };
 
        
        //This function clears the credentials and removes the cookie to ensure that the person 
        //is logged back out. 
        service.ClearCredentials = function () {
            $rootScope.globals = undefined;
			$rootScope.sso = undefined;
            $cookies.remove('globals');
            $cookies.remove('sso');
			$cookieStore.remove('sso');
			$cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Verification ';
            //Reset the global variables
            $rootScope.authkey = 0;
            $rootScope.salesRepId = 0;
            $rootScope.loginErrorFlag = false;
            $rootScope.loginError = '';
            $rootScope.userEmail = '';
        };
 
        return service;
    }])
 

//This function encrypts a string simulating the BAse64 Encryption of Java
.factory('Base64', function () {
    /* jshint ignore:start */
 
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
 
    //cmment
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
 
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
 
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
 
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
 
            return output;
        },
 
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
 
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
 
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
 
                output = output + String.fromCharCode(chr1);
 
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
 
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
 
            } while (i < input.length);
 
            return output;
        }
    };
 
    /* jshint ignore:end */
});
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Message.Factory', [])// jshint ignore:line

.factory('MessageFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Message Factory';

            service.getErrorMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getError.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
        
        
            service.getMaintenanceMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getMaintenance.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getSystemMessage = function (callbackFunc) {
                $http({
                        method: 'GET',
                        url: '/r/Messages/getSystem.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Profile.Factory', [])// jshint ignore:line

.factory('ProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.getProfile = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/config/profile.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
						console.log('THe profile information was not set you need to ensure that you have a /public/config/profile.json file , if you do not this is required to run the application');
                    });
            };
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Global.Search.Factory', [])// jshint ignore:line

.factory('SearchFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Search Factory';

            service.getResults = function (searchText,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/results.json?searchStr='+searchText;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getCategoryProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?categoryid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
            service.getBrandProducts = function (id,callbackFunc) {
                //var searchURL = '/r/Store/searchResults.json';
                  var searchURL = '/r/Search/read.json?vendorid='+id;
                $http({
                        method: 'GET',
                        url: searchURL
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                        //alert('error');// jshint ignore:line
                    });
            };
        
         return service;
    }]);
'use strict';


angular.module('myApp.module.Global.sessionInjector.Factory', [])// jshint ignore:line

.factory('sessionInjector', ['$rootScope',  function($rootScope) {  
    var sessionInjector = {
        request: function(config) {
            if($rootScope.globals.currentUser){
                 config.headers['authkey'] = $rootScope.globals.currentUser.authkey;// jshint ignore:line
            }else{
                 config.headers['authkey'] = 0;// jshint ignore:line
            }
            return config;
        }
    };
    return sessionInjector;
}]);
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

'use strict';

angular.module('myApp.module.Politician.main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/politicians', {
						controller: 'PoliticianController',
						templateUrl: 'com/modules/Politicians/views/politicians.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Politician Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/politicians',title:'Politicians Main'}]
			});
		}])


.controller('PoliticianController',// jshint ignore:line
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

'use strict';

angular.module('myApp.module.Messaging.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Messaging.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/messaging', {
						controller: 'IMController',
						templateUrl: 'com/modules/Messaging/views/messaging.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Messaging Main',
						menuGroup: 'Home',
						description: 'This is The Messaging Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/messaging',title:'VIPER'},{view: '/messaging',title:'Message Main'}]
			});
		}])


.controller('IMController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'IMFactory',
		function ($scope, $rootScope, $location, IMFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = IMFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Messaging.Main.Factory', [])// jshint ignore:line

.factory('IMFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Wiki Factory';

            service.message = 'This is the Wiki Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Main.Home.Controller', ['ngRoute', // jshint ignore:line
												     'myApp.module.Main.Home.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/main', {
						controller: 'MainController',
						templateUrl: 'com/modules/Main/views/home.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Main Dashboard',
						menuGroup: 'Home',
						description: 'This is the Description of the Home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/',title:'1Nation'},{view: '/main',title:'Main Dashboard'}]
			});
		}])


.controller('MainController',// jshint ignore:line
		['$scope', '$rootScope', 'MainFactory',
		function ($scope, $rootScope, MainFactory) {

			$scope.message = 'This is the Home page message from the controller';
            $rootScope.tmp = MainFactory.message;
            
            //Calendar Variables
            $scope.calendarView = 'month';
            $scope.calendarDate = new Date();
            
            //Calendar Events
            $scope.events = [
              {
                title: 'My event title', // The title of the event
                type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: new Date(2013,5,1,1), // A javascript date object for when the event starts
                endsAt: new Date(2014,8,26,15), // Optional - a javascript date object for when the event ends
                editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: false, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: true, //Allow an event to be dragged and dropped
                resizable: true, //Allow an event to be resizable
                incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
                recursOn: 'year', // If set the event will recur on the given period. Valid values are year or month
                cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
              }
            ];

			
			


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Main.Home.Factory', [])// jshint ignore:line

.factory('MainFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {// jshint ignore:line
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Main Factory';
            service.message = 'This is the placeholder message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Reporting.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Reporting.Graph.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/reporting', {
						controller: 'ReportController',
						templateUrl: 'com/modules/Reporting/views/reporting.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Reporting Main',
						menuGroup: 'Home',
						description: 'This is The Reporting Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/reporting',title:'Reporting Main'}]
			});
		}])


.controller('ReportController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'GraphFactory',
		function ($scope, $rootScope, $location, GraphFactory) {

			$scope.message = 'The Is the Wiki Page';

            	$scope.chartType = 'bar';
	
	$scope.config = {
    title: 'Products',
    tooltips: true,
    labels: false,
    mouseover: function() {},
    mouseout: function() {},
    click: function() {},
    legend: {
      display: true,
      //could be 'left, right'
      position: 'right'
    }
  };
	
	
	$scope.config1 = {
		labels: false,
		title: 'Products',
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 110,
		outerRadius: 100
	};

	$scope.config2 = {
		labels: false,
		title: 'HTML-enabled legend',
		legend: {
			display: true,
			htmlEnabled: true,
			position: 'right'
		},
		lineLegend: 'traditional'
	};

	
  //This is the Featured Products System
			GraphFactory.getGraphBanners(function(dataResponse) {
					$scope.data = dataResponse.graph[0];
			});
	
	
			GraphFactory.getGraphBanners2(function(dataResponse) {
					$scope.data1 = dataResponse.graph[0];
			});
	
			GraphFactory.getGraphBanners3(function(dataResponse) {
					$scope.data2 = dataResponse.graph[0];
			});


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Graph.Factory', [])// jshint ignore:line

.factory('GraphFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope,$http) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Graph Factory';
        
        
        
            service.getGraphBanners = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph1.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners2 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph2.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
		
			service.getGraphBanners3 = function (callbackFunc) {
                $http({
                        cache: true,
                        method: 'GET',
                        url: '/r/graphs/graph3.json'
                     }).success(function(data){
                        // With the data succesfully returned, call our callback
                        callbackFunc(data);
                    }).error(function(){
                       // alert('error');// jshint ignore:line
                    });
            };
  
        
         return service;
    }]);
//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Reporting.Main.Factory', [])// jshint ignore:line

.factory('ReportFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Report Factory';

            service.message = 'This is the Report Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Support.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Support.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/support', {
						controller: 'SupportController',
						templateUrl: 'com/modules/Support/views/support.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Support Main',
						menuGroup: 'Home',
						description: 'This is The Support Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/support',title:'Support Main'}]
			});
		}])


.controller('SupportController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'SupportFactory',
		function ($scope, $rootScope, $location, SupportFactory) {

			$scope.message = 'The Is the Support Page';
            $rootScope.message = SupportFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Support.Main.Factory', [])// jshint ignore:line

.factory('SupportFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Support Factory';

            service.message = 'This is the Support Message';
        
         return service;
    }]);
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

'use strict';

angular.module('myApp.module.Profile.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Profile.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/profile', {
						controller: 'ProfileController',
						templateUrl: 'com/modules/Profile/views/profile.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Profile Main',
						menuGroup: 'Home',
						description: 'This is The Profile Page System',
						keywords: 'Profile , Profile Main, Profile Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/profile',title:'Profile'}]
			});
		}])


.controller('ProfileController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'UserProfileFactory',
		function ($scope, $rootScope, $location, UserProfileFactory) {

			$scope.message = 'The Is the Profile Page';
            $rootScope.message = UserProfileFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Profile.Main.Factory', [])// jshint ignore:line

.factory('UserProfileFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Profile Factory';

            service.message = 'This is the Profile Message';
        
         return service;
    }]);
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

'use strict';

angular.module('myApp.module.Wiki.Main.Controller', ['ngRoute', // jshint ignore:line
																												'myApp.module.Wiki.Main.Factory'])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/wiki', {
						controller: 'WikiController',
						templateUrl: 'com/modules/Wiki/views/wiki.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Wiki Main',
						menuGroup: 'Home',
						description: 'This is The Wiki Page System',
						keywords: 'Profile , Wiki Main, Wiki Edit',
						breadcrumbList: [{view: '/main',title:'VIPER'},{view: '/wiki',title:'Wiki Main'}]
			});
		}])


.controller('WikiController',// jshint ignore:line
		['$scope', '$rootScope', '$location' , 'WikiFactory',
		function ($scope, $rootScope, $location, WikiFactory) {

			$scope.message = 'The Is the Wiki Page';
            $rootScope.message = WikiFactory.message;


		}]);

//This is the example service that shows how to setup and utilize a static service to allow for front end development. 
//This system is very simple and basically returns data. 
'use strict';


angular.module('myApp.module.Wiki.Main.Factory', [])// jshint ignore:line

.factory('WikiFactory',// jshint ignore:line
    ['$rootScope','$http',
    function ($rootScope) {
        var service = {};
        
            $rootScope.serviceMessage = 'This is the Wiki Factory';

            service.message = 'This is the Wiki Message';
        
         return service;
    }]);
'use strict';

angular.module('myApp.module.Voting.Main.Controller', ['ngRoute', // jshint ignore:line
												        ])

.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/voting', {
						controller: 'VotingController',
						templateUrl: 'com/modules/Voting/views/main.html',
						hideMenus: false,
						protectedArea: true,
						clearFoundation: true,
						title: 'Voting Main',
						menuGroup: 'Home',
						description: 'This is the category home page',
						keywords: 'Home,Homey',
						breadcrumbList: [{view: '/main',title:'1Nation'},{view: '/voting',title:'Voting Main'}]
			});
		}])


.controller('VotingController',// jshint ignore:line
		['$scope', '$rootScope','$location',
		function ($scope, $rootScope, $location) {
            
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
