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
   link: function(scope) {
      var interval,
      stepTime = 250;
      var toDecimals = function(value, decimals) {
         if (decimals) {
            return value.toFixed(decimals);
         }
         return value;
      };

      var doClick = function(sum,init) {
         if (sum) {
            if(scope.max && (scope.varrReal + scope.realStep) > scope.max) {
               return;
            }
            scope.varrReal += scope.realStep;
            clearInterval(interval);
            interval = setInterval(doClick, stepTime, true,false);
         } else {
            if(scope.min && (scope.varrReal - scope.realStep) < scope.min) {
               return;
            }
            scope.varrReal -= scope.realStep;
            clearInterval(interval);
            interval = setInterval(doClick, stepTime, false,false);
         }
         scope.varr = toDecimals(scope.varrReal, scope.decimals);

         if (stepTime > 50) {
            stepTime -= 20;
         }

         if (!init) {
            scope.$apply();
         }
      };

      scope.sum = function() {
         doClick(true, true);
      };

      scope.sub = function() {
         doClick(false, true);
     };

      scope.up = function() {
         clearInterval(interval);
         stepTime = 250;
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
            '<button class="btn btn-default" type="button" ng-mousedown="sub()" ng-mouseup="up()" ng-mouseleave="up()">-</button>'+
         '</span>'+
         '<span class="input-group-addon" ng-If="prefix" ng-bind="prefix"></span>'+
         '<input type="text" class="form-control" style="display: block;" ng-model="varr">'+
         '<span class="input-group-addon" ng-If="postfix" ng-bind="postfix"></span>'+
         '<span class="input-group-btn">'+
            '<button class="btn btn-default" type="button" ng-mousedown="sum()" ng-mouseup="up()" ng-mouseleave="up()">+</button>'+
         '</span>'+
      '</div>',
   };
});
