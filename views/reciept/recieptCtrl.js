import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui-grid';
import './../../node_modules/angular-ui-grid/ui-grid.css';
import './reciept.css';

import './../../services/services';


let recieptModule = angular.module('views.reciept', [
    'services',
    'ngResource',
    'ui.router',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize',
    'ui.grid.treeView',
    'ui.grid.expandable'
]);

recieptModule.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('reciept', {
            url: '/reciept',
            templateUrl: 'views/reciept/reciept.list.html',
            resolve: {
                reciepts: RecieptService => {
                    return RecieptService.query().$promise;
                }
            },
            controller: function($scope, $state, RecieptService, reciepts, $mdSidenav) {
                console.log(reciepts);

                //-- оживляем панельку редактирования

                // $scope.toggleRight = buildToggler('right');
                // $scope.isOpenRight = function() {
                //     return $mdSidenav('right').isOpen();
                // };

                // function buildToggler(navID) {
                //     return function() {

                //         $mdSidenav(navID)
                //             .toggle()
                //             .then(function() {
                //                 console.log("toggle " + navID + " is done");
                //             });
                //     };
                // };


                // $scope.close = function() {
                //     // Component lookup should always be available since we are not using `ng-if`
                //     $mdSidenav('right').close()
                //         .then(function() {
                //             console.log("close RIGHT is done");
                //         });
                // };



            }
        })
        .state('reciept.add', {
            url: '/add',
            template: '<ui-view>',
            //resolve - потом определимся, что тут надо возвращать. может быть список аромок
            controller: function($scope, $state, $mdDialog, RecieptService) {
                console.log('Добавить рецепт');
                $scope.reciept = new RecieptService();

                $mdDialog.show({
                        templateUrl: 'views/reciept/reciept.add.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            aTitle: 'Добавить новый рецепт',
                            reciept: $scope.reciept
                                //-- надо добавить вывод аромок -- Автокомплит
                        }, //locals
                        controller: ($scope, $mdDialog, aTitle, reciept) => {
                                $scope.title = aTitle;
                                $scope.reciept = reciept;
                                $scope.cancel = function() {
                                    console.log('cancel');
                                    $mdDialog.cancel('user pressed canceled');
                                };

                                $scope.ok = function() {
                                    console.log('Add');
                                    $mdDialog.hide({ message: 'here is some result data' });
                                };
                            } //controller
                    })
                    .then(
                        function(data) {
                            // console.log(data);
                            $scope.reciept.$save();
                            $state.go('^', null, { reload: true });
                        },
                        function(data) {
                            //   console.log(data);
                            $state.go('^');
                        }
                    );
            }
        })

});

export default recieptModule;