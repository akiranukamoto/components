var components = angular.module("components",["components.pick"]);
var ngPick = angular.module('components.pick', []).directive('ngPick', function() {
   return {
      priority: 1200,
      restrict: 'E',
      compile: function(elements, attributes){
      if (attributes.orderControlVisible == 'false') {
         attributes.orderControlVisible = false;
      } else {
         attributes.orderControlVisible = true;
      }
         attributes.columns = elements.find('column');
      },
      controller: ['$attrs', function($attrs) {
         this.columns = $attrs.columns;
      }]
   };
}).directive('ngPick', function() {
   return {
      priority: 1100,
      restrict: 'E',
      replace: true,
      scope:{
      inputTitle:"@",
      outputTitle:"@",
      listHeight:"@",
      listWidth:"@",
      varr:"@var",
      addAllLabel:"@",
      addLabel:"@",
      removeLabel:"@",
      removeAllLabel:"@",
      orderControlVisible:"@",
      firstLabel:"@",
      upLabel:"@",
      downLabel:"@",
      lastLabel:"@",
      input:"=",
      output:"="
   },
   link: function(scope) {
      scope.inputItem = null;
      scope.outputItem = null;
      var remove = function(item, array) {
         var index = array.indexOf(item);
         if (index > -1) {
            array.splice(index, 1);
        }
      };
      var moveItem = function(item, array, pos) {
         var index = array.indexOf(item);
         array.splice(index+pos, 0, array.splice(index, 1)[0]);
      };

      scope.selectInputItem = function(item) {
         scope.inputItem = item;
         scope.outputItem = null;
      };

      scope.selectOutputItem = function(item) {
         scope.outputItem = item;
         scope.inputItem = null;
      };

      scope.selectAndAddInputItem = function(item) {
         scope.inputItem = item;
         scope.add();
      };

      scope.selectAndRemoveOutputItem = function(item) {
         scope.outputItem = item;
         scope.remove();
      };

      scope.addAll = function() {
         scope.output = scope.output.concat(scope.input);
         scope.input = [];
         scope.inputItem = null;
      };

      scope.add = function() {
         remove(scope.inputItem, scope.input);
         scope.output.push(scope.inputItem);
         scope.inputItem = null;
      };

      scope.remove = function() {
         remove(scope.outputItem, scope.output);
         scope.input.push(scope.outputItem);
         scope.outputItem = null;
      };

      scope.removeAll = function() {
         scope.input = scope.input.concat(scope.output);
         scope.output = [];
         scope.outputItem = null;
      };

      scope.hasInput = function() {
         return scope.input.length;
      };

      scope.hasOutput = function() {
         return scope.output.length;
      };

      scope.hasInputItem = function() {
         return scope.inputItem !== null;
      };

      scope.hasOutputItem = function() {
         return scope.outputItem !== null;
      };

      scope.isFirst = function() {
          return !scope.hasOutputItem() || scope.output[0] ===  scope.outputItem;
      };

      scope.isLast = function() {
         return !scope.hasOutputItem() || scope.output[scope.output.length-1] ===  scope.outputItem;
      };

      scope.first = function() {
         remove(scope.outputItem, scope.output);
         scope.output.unshift(scope.outputItem);
      };

      scope.up = function() {
         moveItem(scope.outputItem, scope.output, -1);
      };

      scope.down = function() {
         moveItem(scope.outputItem, scope.output, 1);
      };

      scope.last = function() {
         remove(scope.outputItem, scope.output);
         scope.output.push(scope.outputItem);
      };
   },
   template:
      '<table class="ng-pick">' + //tabel de conteudo
         '<tr>' +
            '<td><strong>{{inputTitle}}</strong></td>' +
            '<td></td>' +
            '<td><strong>{{outputTitle}}</strong></td>'+
            '<td></td>' +
         '</tr>' +
         '<tr>' +
            '<td ng-style="{width: listWidth || \'240px\'}">' +
               '<div class="panel panel-default">' + //inicio da coluna do primeiro conteudo
                  '<table class="table">' + //tabel de conteudo
                     '<thead><tr title-transclude></tr></thead>'+
                  '</table>' +
                  '<div style="overflow-y:auto;overflow-x:hidden;" ng-style="{height: listHeight || \'200px\'}">' + //scrolling
                     '<table class="table table-striped table-hover">' +
                        '<tbody>'+
                           '<tr ng-repeat="item in input" ng-click="selectInputItem(item)" ng-dblclick="selectAndAddInputItem(item)" ng-class="{info:item === inputItem}" row-transclude>' +
                        '</tbody>'+
                     '</table>' +
                  '</div>' +
               '</div>' + //final  da coluna do primeiro conteudo
            '</td>'+
            '<td>' +
               '<div class="btn-group-vertical"  style="min-width:100px;padding:10px;">' +
                  '<button type="button" ng-click="addAll()" ng-disabled="!hasInput()" class="btn btn-primary">{{addAllLabel || "Adicionar Todos"}}</button>' + //Adiciona todos
                  '<button type="button" ng-click="add()" ng-disabled="!hasInputItem()" class="btn btn-primary">{{addLabel || "Adicionar Item"}}</button>' + //Adiciona um
                  '<button type="button" ng-click="remove()" ng-disabled="!hasOutputItem()" class="btn btn-primary">{{removeLabel || "Remover Item"}}</button>' + //Remove todos
                  '<button type="button" ng-click="removeAll()" ng-disabled="!hasOutput()" class="btn btn-primary">{{removeAllLabel || "Remover Todos"}}</button>' + //Remove um
               '</div>' +
            '</td>' +
            '<td ng-style="{width: listWidth || \'240px\'}">' +
               '<div class="panel panel-default">' + //inicio da coluna do primeiro conteudo
                  '<table class="table">' + //tabel de conteudo
                     '<thead><tr title-transclude></tr></thead>'+
                  '</table>' +
                  '<div style="overflow-y:auto;overflow-x:hidden;" ng-style="{height: listHeight || \'200px\'}">' + //scrolling
                     '<table class="table table-striped table-hover">' +
                        '<tbody>'+
                           '<tr ng-repeat="item in output | orderBy:predicateOutput:reverseOutput" ng-click="selectOutputItem(item)" ng-dblclick="selectAndRemoveOutputItem(item)" ng-class="{info:item === outputItem}" row-transclude>' +
                        '</tbody>'+
                     '</table>' +
                  '</div>' +
               '</div>' + //final  da coluna do primeiro conteudo
            '</td>'+
            '<td ng-if="orderControlVisible">' +
               '<div class="btn-group-vertical" style="min-width:100px;padding:10px;">' +
                  '<button type="button" ng-click="first()" ng-disabled="isFirst()" class="btn btn-primary">{{firstLabel || "Primeiro"}}</button>' + //Primeiro
                  '<button type="button" ng-click="up()" ng-disabled="isFirst()" class="btn btn-primary">{{upLabel || "Sobe"}}</button>' + //Sobe
                  '<button type="button" ng-click="down()" ng-disabled="isLast()" class="btn btn-primary">{{downLabel || "Desce"}}</button>' + //Desce
                  '<button type="button" ng-click="last()" ng-disabled="isLast()" class="btn btn-primary">{{lastLabel || "Último"}}</button>' + //Ultimo
               '</div>' +
            '</td>' +
         '</tr>' +
      '</table>',
   };
}).directive('titleTransclude', ['$compile', function($compile) {
   return {
      require: '^ngPick',
      link: function(scope, elm, attr, pick) {
         var clones = [];
         angular.forEach(pick.columns, function(col) {
            var th = document.createElement('th');
            if (col && col.attributes && col.attributes.width && col.attributes.width.value) {
               th.style.width = col.attributes.width.value;
            }
            th.innerHTML = col.attributes.caption.value;
            clones.push(th);
         });
         elm.append(clones);
         $compile(clones)(scope);
      }
   };
}]).directive('rowTransclude', ['$compile', function($compile) {
   return {
      require: '^ngPick',
      link: function(scope, elm, attr, pick) {
         var reg = /{{([^}]*)}}/g;
         var clones = [];
         var result;
         var replaced;
         var tag;

         angular.forEach(pick.columns, function(col) {
            var td = document.createElement('td');
            if (col && col.attributes && col.attributes.width && col.attributes.width.value) {
               td.style.width = col.attributes.width.value;
            }
            td.innerHTML = col.innerHTML;
            while ((result = reg.exec(td.innerHTML)) !== null) {
               replaced = result[0];
               tag = result[1];
               tag = tag.replace(scope.varr, 'item');
               td.innerHTML = td.innerHTML.replace(replaced, '{{' + tag + '}}');
            }
            if (td.childNodes !== null && td.childNodes.length > 0) {
               for (var i = 0; i < td.childNodes.length; i++) {
                  if (td.childNodes[i].attributes !==undefined && td.childNodes[i].attributes.length > 0) {
                     for (var j = 0; j < td.childNodes[i].attributes.length; j++) {
                        if (td.childNodes[i].attributes[j].name.indexOf('ng-') === 0) {
                           td.childNodes[i].attributes[j].value = td.childNodes[i].attributes[j].value.replace(scope.varr,"item");
                        }
                     }
                  }
               }
            }
            clones.push(td);
         });
         if (pick.columns === null || pick.columns.length === 0) {
            var td = document.createElement('td');
            td.innerHTML = '{{item}}';
             clones.push(td);
         }
         elm.append(clones);
         $compile(clones)(scope);
      }
   };
}]);
