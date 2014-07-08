var app = angular.module("app",["ngRoute","components"])
   .config(function($routeProvider) {
      $routeProvider
         .when('/', {
            templateUrl : 'init.html',
            controller  : 'initController'
         })
         .when('/pick', {
            templateUrl : 'pick.html',
            controller  : 'pickController'
         })
         .otherwise({
            templateUrl : 'init.html',
            controller  : 'initController'
         });
   }).controller('initController', function($scope) {
      $scope.home = 'false';
   }).controller('pickController', function($scope) {
      $scope.home = 'false';
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
   });
