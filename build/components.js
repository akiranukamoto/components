var components = angular.module("components",["components.grid","components.pick","components.spinner"]);

var ngGrid = angular.module('components.grid', []).directive('ngGrid', function() {
   return {
      priority: 1200,
      restrict: 'E',
      compile: function(elements, attributes){
         attributes.columns = elements.find('column');
      },
      controller: ['$attrs', function($attrs) {
         this.columns = $attrs.columns;
      }]
   };
}).filter('gridSlice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
}).directive('ngGrid', function() {
   return {
      priority: 1100,
      restrict: 'E',
      replace: true,
      scope:{
      title:"@",
      rows:"@",
      varr:"@var",
      input:"=",
      output:"=",
   },
   link: function(scope,element) {
      scope.index = 1;
      scope.predicate = "name";
      scope.reverse = false;
      scope.firstItem = 0;
      scope.lastItem = scope.input.length;
      scope.filteredList = [];
      scope.selectedAll = false;
      scope.indeterminate = false;
      scope.paginate = [];
      var numPages;
      var verifyOutput = function() {
         var idx;
         angular.forEach(scope.output, function(line) {
            idx = scope.input.indexOf(line);
            if (idx == -1) {
               scope.output.splice(idx, 1);
            }
         });
      }();

      scope.pagesCount = function() {
         var numPagesLabels = [];
         var first = scope.index - 2;
         var last;
         if (scope.rows) {
            numPages = Math.ceil(scope.filteredList.length / parseInt(scope.rows));

            if (first > numPages - 4) {
               first = numPages - 4;
            }
            if (first <= 0) {
               first = 1;
            }
            last  = first + 5;
            if (last > numPages) {
               last = numPages + 1;
            }
            for(var i = first; i < last; i++) {
               numPagesLabels.push(i);
            }
         }
         return numPagesLabels;
      };

      scope.goPage = function(page) {
         if (scope.rows) {
            scope.firstItem = (page - 1) * parseInt(scope.rows);
            scope.lastItem  = scope.firstItem  + parseInt(scope.rows);
            if (scope.lastItem > scope.input.length) {
               scope.lastItem = scope.input.length;
            }
            scope.index = page;
         }
      };

      scope.getFirstItem = function() {
         var firstItem = (scope.index - 1) * parseInt(scope.rows);
         if (firstItem > scope.filteredList.length) {
            return 0;
         }
         return firstItem + 1;
      };

      scope.getLastItem = function() {
         var lastItem  = scope.getFirstItem(scope.filteredList.length)  + parseInt(scope.rows) - 1;
         if (!scope.getFirstItem(scope.filteredList.length)) {
            return 0;
         }
         if (lastItem > scope.filteredList.length) {
            return scope.filteredList.length;
         }
         return lastItem;
      };

      scope.disabledLeft = function() {
         if (scope.index == 1) {
            return 'disabled';
         }
         return '';
      };
      scope.disabledRight = function() {
         if (scope.index == numPages) {
            return 'disabled';
         }
         return '';
      };
      scope.first = function() {
         scope.goPage(1);
      };
      scope.last = function() {
         scope.goPage(numPages);
      };
      scope.prev = function() {
         if (scope.index == 1) {
            return;
         }
         scope.goPage(--scope.index);
      };
      scope.next = function() {
         if (scope.index == numPages)
         {
            return;
         }
         scope.goPage(++scope.index);
      };
      scope.currentPage = function(page) {
         if (scope.index == page) {
            return 'active';
         }
         return '';
      };
      scope.orderBy = function(column) {
         if (scope.predicate == column) {
            scope.reverse = !scope.reverse;
         }
         else {
            scope.predicate = column;
            scope.reverse = false;
         }
      };
      scope.orderIcon = function(column) {
         if (scope.predicate == column) {
            if (scope.reverse) {
               return 'glyphicon glyphicon-chevron-down';
            } else {
               return 'glyphicon glyphicon-chevron-up';
            }
         }
         return '';
      };

      scope.toggleSelection = function(item, inputFiltered) {

         var idx;
         idx = scope.output.indexOf(item);
         if (idx > -1) {
           scope.output.splice(idx, 1);
         }
         else {
           scope.output.push(item);
         }

      };

      scope.toggleSelectionAll = function(inputFiltered) {
         scope.selectedAll = !scope.selectedAll;
         angular.forEach(inputFiltered, function(line) {
            idx = scope.output.indexOf(line);
            if (scope.selectedAll) {
               if (idx == -1) {
                  scope.output.push(line);
               }
            } else {
               if (idx > -1) {
                  scope.output.splice(idx, 1);
               }
            }
         });
      };

      var compareArrays = function(input, output) {
         var idx;
         var checked = false;
         var unchecked = false;
         if (!output) {
            return;
         }
         angular.forEach(input, function(line) {
            idx = output.indexOf(line);
            if (idx > -1) {
               checked = true;
            } else {
               unchecked = true;
            }
            if (checked && unchecked) {
               scope.selectedAll = true;
               scope.indeterminate = true;
               return;
            }
         });

         if (checked && !unchecked) {
            scope.selectedAll = true;
            scope.indeterminate = false;
            return;
         }

         if (!checked && unchecked) {
            scope.selectedAll = false;
            scope.indeterminate = false;
            return;
         }
      };

      scope.$watch('input | filter:search:strict', function (value) {
         scope.filteredList = value;
         compareArrays(value, scope.output);
      }, true);

      scope.$watch('output', function (value) {
         compareArrays(scope.filteredList, value);
      }, true);



         var resizeFixed = function() {
            angular.forEach(element.find('tr')[1].childNodes, function(th,key) {
               element.find('thead')[0].childNodes[0].childNodes[key].style.width = th.offsetWidth + 'px';
            });
            scrollFixed();
         };

         var scrollFixed = function() {
            var offset = document.body.scrollTop,
            tableOffsetTop = element.find('table')[0].getBoundingClientRect().top + 20,
            tableOffsetBottom = tableOffsetTop + element.find('table')[0].offsetHeight - 100;

            if(tableOffsetTop <= 0 && tableOffsetBottom > 0) {
               element.find('thead')[0].childNodes[0].style.display = '';
            }
            else {
               element.find('thead')[0].childNodes[0].style.display = 'none';
            }
         };

         var init = function() {
            resizeFixed();
         }();

         scope.$watch(function(){
            resizeFixed();
         }, true);

         angular.element(window).bind("resize", function() {
            scope.$apply();
            resizeFixed();
         });

         angular.element(window).bind("scroll", function() {
            scope.$apply();
            scrollFixed();
         });

      scope.goPage(1);
   },
   template:
      '<div class="ng-table panel panel-default">' +
         '<div class="panel-heading" ng-if="title"><label ng-bind="title"></label></div>' +
         '<table class="table table-striped table-hover">' +
            '<thead title-grid-transclude></thead>'+
            '<tbody>'+
               '<tr ng-repeat="item in input | orderBy:predicate:reverse | filter:search:strict | gridSlice:firstItem:lastItem" ' +
                  'ng-class="{info:output.indexOf(item) > -1}" row-grid-transclude>' +
            '</tbody>'+
            //'<tfoot>' +
            //   '<tr>' +
            //      '<td colspan="3" style="text-align: center;">'+

            //      '</td>' +
            //   '</tr>' +
            //'</tfoot>' +
         '</table>' +
         '<div class="panel-footer">' +
            '<div class="row">' +
               '<div class="col-md-4">' +
                  '<p class="text-muted" style="margin: 4px;">' +
                     '<span class="label label-default" ng-if="rows">{{getFirstItem();}}/{{getLastItem();}}</span>' +
                     '<span> {{filteredList.length}}</span>' +
                     '<span ng-hide="!output.length">/</span>' +
                     '<span ng-hide="!output.length">{{output.length}}</span>' +
                  '</p>' +
               '</div>' +
               '<div class="col-md-8" style="text-align:right;" ng-if="rows">' +
                  '<ul class="pagination pagination-sm" style="margin:0px;">' +
                     '<li ng-class="disabledLeft();"><a href="javascript:;" ng-click="first()">&laquo;&laquo;</a></li>' +
                     '<li ng-class="disabledLeft();"><a href="javascript:;" ng-click="prev()">&laquo;</a></li>' +
                     '<li ng-repeat="i in pagesCount()" ng-class="currentPage(i);"><a href="javascript:;" ng-click="goPage(i)" ng-bind="i"></a></li>' +
                     '<li ng-class="disabledRight();"><a href="javascript:;" ng-click="next()">&raquo;</a></li>' +
                     '<li ng-class="disabledRight();"><a href="javascript:;" ng-click="last()">&raquo;&raquo;</a></li>' +
                  '</ul>' +
               '</div>' +
            '</div>' +
         '</div>' +
      '</div>',
   };
}).directive('ngIndeterminate', [function() {
   return {
      scope: true,
      require: '^ngGrid',
      restrict: 'A',
      link: function(scope, element, attrs, modelCtrl) {
            scope.$watch(attrs.ngIndeterminate, function (value) {
                element.prop('indeterminate', value);
            });
      }
   };
}]).directive('titleGridTransclude', ['$compile', function($compile) {
   return {
      require: '^ngGrid',
      link: function(scope, elm, attr, grid) {
         var clones = [];
         var spanOrder;
         var spanFilter;
         var caption;
         var hasFilter = false;
         var th = document.createElement('th');
         var tr = document.createElement('tr');
         var thFilter = document.createElement('th');
         var trFilter = document.createElement('tr');
         var trClone;
         if (scope.output) {
            th.innerHTML = '<p><input class="btn text-center" ng-indeterminate="indeterminate" type="checkbox" ng-model="selectedAll" ng-click="toggleSelectionAll((input | filter:search:strict))"></p>';
            th.style.width = '50px';
            th.style.textAlign = 'center';
            tr.appendChild(th);
            trFilter.appendChild(thFilter);
         }

         angular.forEach(grid.columns, function(col) {
            spanCaption = "";
            spanFilter = "";
            caption = "";
            th = document.createElement('th');
            thFilter = document.createElement('th');
            if (col && col.attributes && col.attributes.width && col.attributes.width.value) {
               th.style.width = col.attributes.width.value;
               thFilter.style.width = col.attributes.width.value;
            }
            if (col && col.attributes && col.attributes.caption && col.attributes.caption.value) {
               caption = col.attributes.caption.value;
               spanCaption =  '<p>' +
                                 '<span>' + caption + '</span>' +
                              '</p>';
            }

            if (col && col.attributes && col.attributes.order && col.attributes.order.value) {
               spanCaption = '<p>' +
                              '<span ng-click="orderBy(\'' + col.attributes.order.value +  '\');"><a href="">' + caption +
                                 ' <span ng-class="orderIcon(\'' + col.attributes.order.value + '\');"></span></a>' +
                              '</span>' +
                           '</p>';
            }
            if (col && col.attributes && col.attributes.filter && col.attributes.filter.value) {
               spanFilter = '<p><input class="form-control" ng-model="search.' + col.attributes.filter.value + '">' +
                            '</p>';
               hasFilter = true;
            }

            th.innerHTML = spanCaption;
            thFilter.innerHTML = spanFilter;
            trFilter.appendChild(thFilter);
            tr.appendChild(th);
         });

         trClone = tr.cloneNode(true);
         trClone.className = 'scrollHeader';
         trClone.style.display = 'none';
         trClone.style.background = 'white';
         trClone.style.top = '0';
         trClone.style.position = 'fixed';
         clones.push(trClone);
         clones.push(tr);
         if (hasFilter) {
            clones.push(trFilter);
         }
         elm.append(clones);
         $compile(clones)(scope);
      }
   };
}]).directive('rowGridTransclude', ['$compile', function($compile) {
   return {
      require: '^ngGrid',
      link: function(scope, elm, attr, grid) {
         var reg = /{{([^}]*)}}/g;
         var clones = [];
         var result;
         var replaced;
         var tag;

         var td = document.createElement('td');
         if (scope.output) {
            td.innerHTML = '<p><input class="btn text-center" type="checkbox" value="{{item}}" ng-checked="output.indexOf(item) > -1" ng-click="toggleSelection(item, (input | filter:search:strict))"></p>';
            td.style.textAlign = 'center';
            clones.push(td);
         }
         angular.forEach(grid.columns, function(col) {
            td = document.createElement('td');
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
            if (td.childNodes && td.childNodes.length > 0) {
               for (var i = 0; i < td.childNodes.length; i++) {
                  if (td.childNodes[i].attributes && td.childNodes[i].attributes.length > 0) {
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

         elm.append(clones);
         $compile(clones)(scope);
      }
   };
}]);

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
         return scope.inputItem;
      };

      scope.hasOutputItem = function() {
         return scope.outputItem;
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
            if (td.childNodes && td.childNodes.length > 0) {
               for (var i = 0; i < td.childNodes.length; i++) {
                  if (td.childNodes[i].attributes && td.childNodes[i].attributes.length > 0) {
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
         if (!pick.columns || pick.columns.length === 0) {
            var td = document.createElement('td');
            td.innerHTML = '{{item}}';
             clones.push(td);
         }
         elm.append(clones);
         $compile(clones)(scope);
      }
   };
}]);

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
