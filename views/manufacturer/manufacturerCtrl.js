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
});
export default manufactureModule;