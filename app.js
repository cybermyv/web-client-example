import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';



import './services/services';
import './views/aroma/aromaCtrl';
import './views/manufacturer/manufacturerCtrl';
import './views/reciept/recieptCtrl';

let app = angular.module('app', ['views.aroma', 'views.manufacturer', 'views.reciept', 'ngMaterial']);