import 'angular-resource';
import 'angular-ui-router';
import './../../services/services';

let aromaModule = angular.module('views.aroma', [
    'services',
    'ngResource',
    'ui.router'
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
        .state('list', {
            url: '/list',
            templateUrl: 'views/aroma/aroma.list.html',
            resolve: {
                aromas: (AromaService) => {
                    return AromaService.query().$promise;

                }
            },
            controller: function($scope, $state, AromaService, aromas) {
                console.log(aromas);

                //   debugger;


            }
        })

    //--
    //--
    $urlRouterProvider.otherwise('/list');
});



export default aromaModule;