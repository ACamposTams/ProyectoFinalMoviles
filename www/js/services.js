angular.module('starter.services', [])

//Servicios conectados a la base de datos en base a los archivos .php
.factory('servicios', function($http) {
    var baseUrl = 'http://ubiquitous.csf.itesm.mx/~pddm-1020939/content/final/Final/';
    return {
        getAll: function(tipo) {
            return $http.get(baseUrl+tipo+'.php?op=selectAll');
        },
        getId: function(id,tipo){
            return $http.get(baseUrl+tipo+'.php?op=selectId&id='+id); 
        },
        getCategoria: function(idCategoria){
             return $http.get(baseUrl+'Ejercicio.php?op=selectCategoria&idCat='+idCategoria); 
        },
        create: function(datos,tipo){
            return $http.post(baseUrl+tipo+'.php?op=insert',datos,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        update: function(datos,tipo){
            return $http.post(baseUrl+tipo+'.php?op=update',datos,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        delete: function(id,tipo){
            return $http.get(baseUrl+tipo+'.php?op=delete&id='+id);
        },
        getWorkouts: function(id) {
            return $http.get(baseUrl+'Rutinas.php?op=getWorkouts&id='+id);
        }
    };
})