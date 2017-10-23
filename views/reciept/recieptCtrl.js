import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui-grid';
import './../../node_modules/angular-ui-grid/ui-grid.css';
//import './aroma.css';

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
            controller: function($scope, $state, RecieptService, reciepts) {
                console.log(reciepts);
                //-- настраиваем грид

                $scope.dataGrid = reciepts;
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
                        { field: 'id', displayName: '#' },
                        { field: 'name', displayName: 'Название' },
                        { field: 'tag', displayName: 'Тег' }
                    ]

                }; // gridOptions
                $scope.gridOptions.onRegisterApi = function(gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.mySelectedRows = $scope.gridApi.selection.getSelectedRows();

                    gridApi.selection.on.rowSelectionChanged($scope, row => {

                        $scope.mySelectedRows = row;
                        $scope.mans = $scope.mySelectedRows.entity;
                        console.log($scope.mySelectedRows);
                        // debugger;
                    });
                }; //onRegisterApi
            }
        })
})