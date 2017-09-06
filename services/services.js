//--сервисы
import 'angular-resource';

let services = angular.module('services', ['ngResource'])
    .service('AromaService',
        function($resource) {

            return $resource('/api/v01/aroma:id', { id: '@id' }, {
                update: { method: 'PUT' }
            });
        });

export default services;