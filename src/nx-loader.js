(function () {
    /**
     * diretiva para adicionar ao componenete anotado um loader.
     * atributos aceitos:
     * nxLoader: true para visivel, false para nao visivel e function para reload;
     * nxLoaderReloadMessage: mensagem de reload;
     * nxLoaderReloadButton: mensagem do botao de reload;
     * nxLoaderElement: elemento em html para o load;
     * 
     * wellington.nukamoto
     */
    'use strict';
    angular.module('components.loader', []).directive('nxLoader', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                nxLoader: '=',
                nxLoaderReloadMessage: '@',
                nxLoaderReloadButton: '@',
                nxLoaderElement: '@'

            },
            link: function (scope, element) {
                var reloadFunction;
                var nxLoaderElement;
                var nxLoaderReloadElement;
                var estiloCentralizado = 'position:absolute;top:50%;left:50%;margin-right:-50%;transform:translate(-50%,-50%);';
                var estiloTotal = 'position: absolute;left:0;top:0;width: 100%;height: 100%;';
                var criarHTMLLoad = function () {
                    var img = "<img src='http://localhost:8383/gerador/gerador/ajax-loader.gif' style='" + estiloCentralizado + "'>";
                    var retorno = scope.nxLoaderElement || "<div id='load-component' style='" + estiloTotal + "'>" + img + "</div>";
                    return angular.element(retorno);
                };
                var criarHTMLReloadModal = function () {
                    var botaoLabel = scope.nxLoaderReloadButton || "Recarregar dados";
                    var mensagem = scope.nxLoaderReloadMessage || "<h4>Erro na requisição, tentar novamente.</h4>";
                    var botao = "<p style='text-align:center;'><a class = 'btn btn-success' ng-click='executar()' nx-keep-enabled='true'> " + botaoLabel + " </a></p>";
                    var modal = "<div class='panel panel-default'style='" + estiloCentralizado + "'><div class='panel-body'>" + mensagem + botao + "</div></div>";
                    return angular.element("<div id='load-component' style='" + estiloTotal + "'>" + modal + "</div>");
                };
                scope.executar = function () {
                    reloadFunction();
                };
                var habilitarElemento = function (elemento) {
                    if (!elemento) {
                        return;
                    }
                    if (!elemento.attr('nxLoaderDisabled')) {
                        return;
                    }
                    elemento.removeAttr('disabled');
                    elemento.removeAttr('nxLoaderDisabled');
                };
                var desabilitarElemento = function (elemento) {
                    if (!elemento) {
                        return;
                    }
                    if (elemento.attr('disabled') || elemento.attr('nx-keep-enabled')) {
                        return;
                    }
                    elemento.attr('disabled', true);
                    elemento.attr('nxLoaderDisabled', true);
                };
                var alternarElementos = function (nodes, disabled) {
                    angular.forEach(nodes, function (node) {
                        try {
                            if (disabled) {
                                desabilitarElemento(angular.element(node));
                            } else {
                                habilitarElemento(angular.element(node));
                            }
                        } catch (msg) {
                        }
                        alternarElementos(node.childNodes, disabled);
                    });
                };
                var alternarElemento = function (disabled) {
                    if (disabled) {
                        desabilitarElemento(element);
                    } else {
                        habilitarElemento(element);
                    }
                    alternarElementos(element[0].childNodes, disabled);
                };
                nxLoaderElement = criarHTMLLoad();
                nxLoaderReloadElement = criarHTMLReloadModal();
                element[0].style.position = "relative";
                
                scope.$watch('nxLoader', function (value) {
                    nxLoaderElement.remove();
                    nxLoaderReloadElement.remove();
                    alternarElemento(false);
                    
                    if (typeof value === 'function') {
                        reloadFunction = value;
                        element.append(nxLoaderReloadElement);
                        $compile(nxLoaderReloadElement)(scope);
                        alternarElemento(true);
                        return;
                    }

                    if (value) {
                        element.append(nxLoaderElement);
                        alternarElemento(true);
                        return;
                    }
                });
            }
        };
    });
})();