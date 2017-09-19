import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui-grid';
import './../../node_modules/angular-ui-grid/ui-grid.css';
import './aroma.css';

import './../../services/services';

let aromaModule = angular.module('views.aroma', [
    'services',
    'ngResource',
    'ui.router',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.resizeColumns'
]);

aromaModule.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('aroma', {
            url: '/aroma',
            templateUrl: 'views/aroma/aroma.list.html',
            resolve: {
                aromas: (AromaService) => {
                    return AromaService.query().$promise;

                }
            },
            controller: function($scope, $state, AromaService, aromas, $mdDialog) {
                console.log(aromas);
                $scope.dataGrid = aromas;

                $scope.gridOptions = {
                    data: $scope.dataGrid,
                    //columnDefs
                    enableRowSelection: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    enableRowHashing: false
                }; // $scope.gridOptions

                $scope.gridOptions.onRegisterApi = function(gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();

                    gridApi.selection.on.rowSelectionChanged($scope, row => {

                        $scope.mySelectedRows = row;
                        //    console.log($scope.mySelectedRows);
                        // debugger;
                    });
                };

                $scope.removing = function() {
                    $scope.aroma = $scope.mySelectedRows.entity;
                    console.log($scope.aroma);

                    if (!$scope.aroma) {
                        alert('Запись не выбрана'); // -- TODO: потом нужно будет заменить на нормальный аллерт

                    } else {
                        $mdDialog.show({
                                templateUrl: 'views/aroma/aroma.del.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true,
                                locals: {

                                    aroma: $scope.aroma
                                },
                                controller: ($scope, $mdDialog, aroma) => {
                                    $scope.aroma = aroma;

                                    $scope.cancel = function() {
                                        console.log('cancel');
                                        $mdDialog.cancel('user pressed canceled');
                                    };

                                    $scope.ok = function() {
                                        console.log('Delete');
                                        $mdDialog.hide({ message: 'here is some result data' });
                                    };
                                }
                            })
                            .then(
                                function(data) {
                                    $scope.aroma.$delete();
                                    $state.reload();
                                },
                                function(data) {
                                    //   console.log(data);
                                    // $state.go('^');
                                }
                            );
                    }
                }

            }
        })
        .state('aroma.add', {
            url: '/add',
            template: '<ui-view>',
            controller: function($scope, $state, $mdDialog, AromaService) {

                console.log('добавляем аромку');

                $scope.aroma = new AromaService();

                $mdDialog.show({
                        templateUrl: 'views/aroma/aroma.add.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            aTitle: 'Добавить новую арому',
                            aroma: $scope.aroma
                        },
                        controller: ($scope, $mdDialog, aTitle, aroma) => {
                            $scope.title = aTitle;
                            $scope.aroma = aroma;

                            $scope.cancel = function() {
                                console.log('cancel');
                                $mdDialog.cancel('user pressed canceled');
                            };

                            $scope.ok = function() {
                                console.log('Add');
                                $mdDialog.hide({ message: 'here is some result data' });
                            };
                        }
                    })
                    .then(
                        function(data) {
                            // console.log(data);
                            $scope.aroma.$save();
                            $state.go('^', null, { reload: true });
                        },
                        function(data) {
                            //   console.log(data);
                            $state.go('^');
                        }
                    );



            }
        })
        .state('aroma.edit', {
            url: '/edit/{id:int}',
            template: '<ui-view>',
            resolve: {
                aromaid: function(AromaService, $stateParams) {
                    return AromaService.get({ id: $stateParams.id }).$promise;
                },
                listMan: function(AromaService) {
                    return AromaService.getMnufacturer({ man: true }).$promise;
                }
            },
            controller: function($scope, $state, $mdDialog, AromaService) {
                $scope.aromaid = $scope.$resolve.aromaid;
                $scope.listMan = $scope.$resolve.listMan;

                $mdDialog.show({
                        templateUrl: 'views/aroma/aroma.edit.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            aromaid: $scope.aromaid,
                            listMan: $scope.listMan
                        },
                        controller: ($scope, $mdDialog, aromaid, listMan) => {
                            $scope.aromaid = aromaid;
                            ///--загружаем данные в дропдаун
                            $scope.listMan = listMan;

                            //  debugger;

                            $scope.cancel = function() {
                                // console.log('cancel');
                                $mdDialog.cancel('user pressed canceled');
                            };

                            $scope.ok = function() {
                                //console.log('Edit');
                                $mdDialog.hide({ message: 'here is some result data' });
                            };

                        }
                    })
                    .then(
                        function(data) {
                            // console.log(data);
                            $scope.aromaid.$update();
                            $state.go('^', null, { reload: true });
                        },
                        function(data) {
                            //   console.log(data);
                            $state.go('^');
                        }
                    );
            }
        });

    //--
    //--
    $urlRouterProvider.otherwise('/aroma');
});



export default aromaModule;