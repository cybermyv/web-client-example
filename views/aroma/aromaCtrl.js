import 'angular-resource';
import 'angular-ui-router';
import 'angular-ui-grid';
import './../../node_modules/angular-ui-grid/ui-grid.css';

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
//  .service('Aromaservice', AromaService);

aromaModule.controller("aromaListCtrl", $scope => {
    // контроллер для управления вьюхой
    //$scope.listTite = "Каталог аромок";
    $scope.showLSNav = false;
    $scope.toggleLSNav = function() {
        console.log($scope.showLSNav);
        $scope.showLSNav = !$scope.showLSNav;

    }

});

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
            controller: function($scope, $state, AromaService, aromas) {
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

            }
        })
        .state('aroma.add',{
            url : '/add',
            controller : function ($scope, $state, Aromaservice){
                console.log('добавляем аромку');
            }
        })

    //--
    //--
    $urlRouterProvider.otherwise('/aroma');
});



export default aromaModule;