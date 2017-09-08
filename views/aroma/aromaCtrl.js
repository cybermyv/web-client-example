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
//  .service('Aromaservice', AromaService);

//aromaModule.controller("aromaListCtrl", ($scope, $mdDialog) => {
// контроллер для управления вьюхой
//$scope.listTite = "Каталог аромок";
// $scope.showLSNav = false;
// $scope.toggleLSNav = function() {
//     console.log($scope.showLSNav);
//     $scope.showLSNav = !$scope.showLSNav;

// }


// $scope.showDialog = () => {
//     $mdDialog.show({
//         templateUrl: 'views/aroma/dlg.html',
//         parent: angular.element(document.body),
//         clickOutsideToClose: true,
//         locals: {
//             aTitle: 'Диалог-заглушка'
//         },
//         controller: ($scope, $mdDialog, aTitle) => {
//             $scope.title = aTitle;

//             $scope.closeDialog = function() {
//                 $mdDialog.hide();
//             }
//         }
//     });

// }
//});

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
        .state('aroma.add', {
            url: '/add',
            template: '<ui-view>',
            controller: function($scope, $state, $mdDialog, AromaService) {

                console.log('добавляем аромку');

                $scope.aroma = new AromaService();

                $mdDialog.show({
                        templateUrl: 'views/aroma/dlg.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            aTitle: 'Диалог-заглушка',
                            aroma: $scope.aroma
                        },
                        controller: ($scope, $mdDialog, aTitle, aroma) => {
                            $scope.title = aTitle;
                            $scope.aroma = aroma;

                            $scope.cancel = function() {
                                $mdDialog.cancel('user pressed canceled');
                            };

                            $scope.ok = function() {
                                $mdDialog.hide({ message: 'here is some result data' });
                            };

                            // $scope.closeDialog = function() {
                            //     $mdDialog.hide();
                            // }
                        }
                    })
                    .then(
                        function(data) {
                            console.log(data);
                            $scope.aroma.$save();
                            $state.go('^', null, { reload: true });
                        },
                        function() {
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