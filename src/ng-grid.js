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
