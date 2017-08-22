import 'angular-resource';
import 'angular-ui-router';
import './../../services/services';

let aromaModule = angular.module('views.aroma', [
    'services',
    'ngResource',
    'ui.router'
]);
//  .service('Aromaservice', AromaService);

aromaModule.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('list', {
            url: '/list',
            templateUrl: 'views/aroma/aroma.list.html',
            resolve: {
                aromas: function(AromaService) {

                    //console.log('resolve');
                    // debugger;
                    // return AromaService.query().$promise;

                }
            }
            //,
            //controller: function($scope, $state, AromaService, list) {

            //}
        })

});

export default aromaModule;