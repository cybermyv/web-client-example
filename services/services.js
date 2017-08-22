//--сервисы

let services = angular.module('services', ['ngResource'])
    .service('AromaService',
        function($resource) {

            return $resource('http://localhost\:8080/list/:id', { id: '@id' }, {

                update: { method: 'PUT' }
                // get: { method: 'GET', isArray: false }

            });
        });

export default services;