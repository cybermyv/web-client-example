import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';



import './services/services';
import './views/aroma/aromaCtrl';

let app = angular.module('app', ['views.aroma', "ngMaterial"]);

