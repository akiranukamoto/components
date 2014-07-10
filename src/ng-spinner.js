var ngPick = angular.module('components.spinner', []).directive('ngSpinner', function() {
   return {
      restrict: 'E',
      replace: true,
      scope:{
      min:"@",
      max:"@",
      step:"@",
      prefix:"@",
      postfix:"@",
      decimals:"@",
      varr:"=var"
   },
   controller: ['$attrs', function($attrs) {

   }] ,
   link: function(scope) {
         var toDecimals = function(value, decimals) {
         if (decimals) {
            return value.toFixed(decimals);
         }
         return value;
      };

      scope.sum = function() {
         if(scope.max && (scope.varrReal + scope.realStep) > scope.max) {
            return;
         }

         scope.varrReal += scope.realStep;
         scope.varr = toDecimals(scope.varrReal, scope.decimals);
      };

      scope.sub = function() {
         if(scope.min && (scope.varrReal - scope.realStep) < scope.min) {
            return;
         }
         scope.varrReal -= scope.realStep;
         scope.varr = toDecimals(scope.varrReal, scope.decimals);
      };

      if (scope.step) {
         scope.realStep = parseFloat(scope.step);
      }
      else {
         scope.realStep = 1;
      }

      scope.varrReal = parseFloat(scope.varr);
      scope.varr = toDecimals(scope.varrReal, scope.decimals);
   },
   template:
      '<div class="input-group">'+
         '<span class="input-group-btn">'+
            '<button class="btn btn-default" type="button" ng-click="sub()">-</button>'+
         '</span>'+
         '<span class="input-group-addon" ng-If="prefix" ng-bind="prefix"></span>'+
         '<input type="text" class="form-control" style="display: block;" ng-model="varr">'+
         '<span class="input-group-addon" ng-If="postfix" ng-bind="postfix"></span>'+
         '<span class="input-group-btn">'+
            '<button class="btn btn-default" type="button" ng-click="sum()">+</button>'+
         '</span>'+
      '</div>',
   };
});
