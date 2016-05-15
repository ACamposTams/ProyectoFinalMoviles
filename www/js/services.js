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
        login: function(email,password,tipo){
            return $http.get(baseUrl+tipo+'.php?op=login&email='+email+'&password='+password)
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
        },
        getIdRutina: function(nombre){
            return $http.get(baseUrl+'Rutinas.php?op=getIdByName&name='+nombre); 
        },
        agregarEjercicioRutina: function(id_ejercicio,id_rutina,especificaciones){
            return $http.get(baseUrl+'Rutinas.php?op=addExerciseRoutine&id_routine='+id_rutina+'&id_exercise='+id_ejercicio+'&specifications='+especificaciones); 
        },
        deleteEjercicio: function(id_ejercicio,id_rutina){
            return $http.get(baseUrl+'Rutinas.php?op=deleteExerciseRoutine&id_routine='+id_rutina+'&id_exercise='+id_ejercicio); 
        }
    };
})