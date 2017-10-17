import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui-grid';
import './../../node_modules/angular-ui-grid/ui-grid.css';
import './manufacturer.css';

import './../../services/services';

let manufactureModule = angular.module('views.manufacturer', [
    'services',
    'ngResource',
    'ui.router',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.selection',
    'ui.grid.resizeColumns',
    'ui.grid.autoResize'
]);

manufactureModule.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider
        .state('manufacturer', {
            url: '/manufacturer',
            templateUrl: 'views/manufacturer/manufacturer.list.html',
            resolve: {
                mans: (ManufacturerService) => {
                    return ManufacturerService.query().$promise;

                }
            },
            controller: function($scope, $state, ManufacturerService, mans, $mdDialog) {
                console.log(mans);
                $scope.dataGrid = mans;

                $scope.gridOptions = {
                    data: $scope.dataGrid,
                    //columnDefs
                    enableRowSelection: true,
                    showGridFooter: true,
                    enableRowHeaderSelection: false,
                    multiSelect: false,
                    enableRowHashing: false,
                    enableFiltering: true,
                    columnDefs: [
                        { field: 'id', displayName: '#', enableFiltering: false },
                        { field: 'name', displayName: 'Название' },
                        { field: 'url', displayName: 'URL' }

                    ]


                }; // $scope.gridOptions

                $scope.gridOptions.onRegisterApi = function(gridApi) {
                        $scope.gridApi = gridApi;

                        $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();

                        gridApi.selection.on.rowSelectionChanged($scope, row => {

                            $scope.mySelectedRows = row;
                            $scope.mans = $scope.mySelectedRows.entity;
                            console.log($scope.mySelectedRows);
                            // debugger;
                        });
                    }
                    //--удаляем производителя //-- надо сделать проверку на связанные сущности, пока без нее
                $scope.manRemoving = () => {
                    if (!$scope.mans) {
                        let dlgConst = $mdDialog
                            .alert()
                            .title("Внимание!")
                            .textContent("Запись не выбрана!")
                            .ok("Закрыть")

                        $mdDialog.show(dlgConst);
                    } else {
                        $mdDialog.show({
                                templateUrl: 'views/manufacturer/manufacturer.del.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true,
                                locals: {

                                    mans: $scope.mans
                                },
                                controller: ($scope, $mdDialog, mans) => {
                                    $scope.mans = mans;

                                    $scope.cancel = function() {
                                        //  console.log('cancel');
                                        $mdDialog.cancel({ message: 'Отменили удаление производителя' });
                                    };

                                    $scope.ok = function() {
                                        //console.log('Delete');
                                        $mdDialog.hide({ message: 'Удалили производителя' });
                                    };
                                }
                            })
                            .then(
                                function(data) {
                                    $scope.mans.$delete();
                                    $state.reload();
                                },
                                function(data) {

                                }
                            );

                    }
                }
            }



        })
        .state('manufacturer.add', {
            url: '/add',
            template: '<ui-view>',

            controller: function($scope, $state, $mdDialog, ManufacturerService) {
                $scope.manufacturer = new ManufacturerService();
                $mdDialog.show({
                        templateUrl: 'views/manufacturer/manufacturer.add.html',
                        parentr: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            aTitle: 'Добавить нового производителя аромок',
                            manufacturer: $scope.manufacturer
                        },
                        controller: ($scope, manufacturer, $mdDialog, aTitle) => {
                            $scope.title = aTitle;
                            $scope.manufacturer = manufacturer;

                            $scope.cancel = () => {
                                console.log('cancel');
                                $mdDialog.cancel({ message: 'Отменили добавление производителя' });
                            };

                            $scope.ok = () => {
                                console.log('add');
                                $mdDialog.hide({ message: 'Добавили нового производителя' });
                            }
                        }
                    })
                    .then(
                        data => {
                            $scope.manufacturer.$save();
                            $state.go('^', null, { reload: true });
                        },
                        data => {
                            $state.go('^')
                        });
            }
        })
        .state('manufacturer.edit', {
            url: '/edit/{id:int}',
            template: '<ui-view>',
            resolve: {
                manid: function(ManufacturerService, $stateParams) {
                    return ManufacturerService.get({ id: $stateParams.id }).$promise
                }
            },
            controller: function($scope, $state, $mdDialog, ManufacturerService) {
                $scope.manid = $scope.$resolve.manid;
                $mdDialog.show({
                        templateUrl: 'views/manufacturer/manufacturer.edit.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            manid: $scope.manid
                        },

                        controller: ($scope, $mdDialog, manid) => {
                            $scope.manid = manid;
                            $scope.cancel = () => {
                                $mdDialog.cancel({ message: 'Отменили редактирование производителя' });
                            };
                            $scope.ok = () => {
                                $mdDialog.hide({ message: 'Редактируем производителя' });
                            }
                        }

                    })
                    .then(
                        data => {
                            $scope.manid.$update();
                            $state.go('^', null, { reload: true });
                        },
                        data => {
                            $state.go('^');
                        }
                    )

            }
        })

});
export default manufactureModule;