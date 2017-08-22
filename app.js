import angular from 'angular';
import 'angular-resource';

import './services/services';
import './views/aroma/aromaCtrl';

let app = angular.module('app', ['views.aroma']);

app.config(($urlRouterProvider) => {
    $urlRouterProvider.otherwise('/list');
});