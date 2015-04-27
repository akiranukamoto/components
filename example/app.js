var app = angular.module("app",["ngRoute","components"])
   .config(function($routeProvider) {
      $routeProvider
         .when('/', {
            templateUrl : 'init.html',
            controller  : 'initController'
         })
         .when('/grid', {
            templateUrl : 'grid.html',
            controller  : 'gridController'
         })
         .when('/pick', {
            templateUrl : 'pick.html',
            controller  : 'pickController'
         })
         .when('/spinner', {
            templateUrl : 'spinner.html',
            controller  : 'spinnerController'
         })
         .when('/loader', {
            templateUrl : 'loader.html',
            controller  : 'loaderController'
         })
         .otherwise({
            templateUrl : 'init.html',
            controller  : 'initController'
         });
   }).controller('initController', function($scope) {
   }).controller('gridController', function($scope) {
      $scope.entrada1 =[];
      for (var i = 1; i <= 10; i++) {
          $scope.entrada1.push({id: i, name: 'name ' + i, value: 'value value' + i});
      }
      $scope.entrada2 =[];
      $scope.saida2 =[];
      for (var i = 1; i <= 100; i++) {
          $scope.entrada2.push({id: i, name: 'name ' + i, value: 'value value' + i});
      }
   }).controller('pickController', function($scope) {
      $scope.exemplo_entrada_1 = ['Exemplo 1','Exemplo 2','Exemplo 3','Exemplo 4'];
      $scope.exemplo_saida_1 = [];
      $scope.entrada =[
                   { id: 1, name: 'Asterisk', value: 'glyphicon-asterisk' },
                   { id: 2, name: 'Plus',    value: 'glyphicon-plus' },
                   { id: 3, name: 'Euro',    value: 'glyphicon-euro' },
                   { id: 4, name: 'Minus',      value: 'glyphicon-minus' },
                   { id: 5, name: 'Cloud',      value: 'glyphicon-cloud' },
                   { id: 6, name: 'Envelope', value: 'glyphicon-envelope' },
                   { id: 7, name: 'Pencil',   value: 'glyphicon-pencil' },
                   { id: 8, name: 'Glass',      value: 'glyphicon-glass' },
                   { id: 9, name: 'Music',      value: 'glyphicon-music' },
                   { id:10, name: 'Search',   value: 'glyphicon-search' },
                   { id:11, name: 'Heart',      value: 'glyphicon-Heart' },
                   { id:12, name: 'Star',    value: 'glyphicon-star' }
               ];
      $scope.saida =[];
      $scope.entrada2 =[
                   { id: 1, name: 'Asterisk', value: 'glyphicon-asterisk' },
                   { id: 2, name: 'Plus',    value: 'glyphicon-plus' },
                   { id: 3, name: 'Euro',    value: 'glyphicon-euro' },
                   { id: 4, name: 'Minus',      value: 'glyphicon-minus' },
                   { id: 5, name: 'Cloud',      value: 'glyphicon-cloud' },
                   { id: 6, name: 'Envelope', value: 'glyphicon-envelope' },
                   { id: 7, name: 'Pencil',   value: 'glyphicon-pencil' },
                   { id: 8, name: 'Glass',      value: 'glyphicon-glass' },
                   { id: 9, name: 'Music',      value: 'glyphicon-music' },
                   { id:10, name: 'Search',   value: 'glyphicon-search' },
                   { id:11, name: 'Heart',      value: 'glyphicon-Heart' },
                   { id:12, name: 'Star',    value: 'glyphicon-star' }
               ];
      $scope.saida2 =[];
   }).controller('spinnerController', function($scope) {
      $scope.spinnerEntrada = 10;
      $scope.spinnerDecimal = 6;
      $scope.spinnerPrefix = 1230;
   }).controller('loaderController', function($scope) {
      $scope.spinnerEntrada = 10;
      $scope.spinnerDecimal = 6;
      $scope.spinnerPrefix = 1230;
   });
