angular.module('starter.services', [])

//Servicios conectados a la base de datos en base a los archivos .php para poder aprovecharlos se envían desde el
//controlador los parámetros requerido y además el nombre del archivo específico al que se desea acceder en algunos
//casos. En otros casos el servicio requerido es demasiado específico y se accede directamente al archivo php requerido
.factory('servicios', function($http) {
    var baseUrl = 'http://ubiquitous.csf.itesm.mx/~pddm-1020939/content/final/Final/';
    return {
        //funcion para obtener todos los datos de una tabla
        getAll: function(tipo) {
            return $http.get(baseUrl+tipo+'.php?op=selectAll');
        },
        //funcion para obtener los datos de un elemento específico buscandolo por su id
        getId: function(id,tipo){
            return $http.get(baseUrl+tipo+'.php?op=selectId&id='+id); 
        },
        //funcion para obtener los ejercicios de una categoria específica
        getCategoria: function(idCategoria){
             return $http.get(baseUrl+'Ejercicio.php?op=selectCategoria&idCat='+idCategoria); 
        },
        //funcion que permite insertar datos de un nuevo objeto creado en la base de datos
        create: function(datos,tipo){
            return $http.post(baseUrl+tipo+'.php?op=insert',datos,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        //funcion encargada de validar los datos del login
        login: function(email,password,tipo){
            return $http.get(baseUrl+tipo+'.php?op=login&email='+email+'&password='+password)
        },
        //funcion encargada de actuzliar la información que se edita en campos específicos
        update: function(datos,tipo){
            return $http.post(baseUrl+tipo+'.php?op=update',datos,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        //función encargada de eliminar un elemento específico de la base de datos
        delete: function(id,tipo){
            return $http.get(baseUrl+tipo+'.php?op=delete&id='+id);
        },
        //función encargada de obtener todos los ejercicios de una rutina
        getWorkouts: function(id) {
            return $http.get(baseUrl+'Rutinas.php?op=getWorkouts&id='+id);
        },
        //función encargada de obtener el id de una rutina en específico
        getIdRutina: function(nombre){
            return $http.get(baseUrl+'Rutinas.php?op=getIdByName&name='+nombre); 
        },
        //función encargada de agregar un ejercicio a una rutina
        agregarEjercicioRutina: function(id_ejercicio,id_rutina,especificaciones){
            return $http.get(baseUrl+'Rutinas.php?op=addExerciseRoutine&id_routine='+id_rutina+'&id_exercise='+id_ejercicio+'&specifications='+especificaciones); 
        },
        //funcion encargada de eliminar un ejercicio de una rutina
        deleteEjercicio: function(id_ejercicio,id_rutina){
            return $http.get(baseUrl+'Rutinas.php?op=deleteExerciseRoutine&id_routine='+id_rutina+'&id_exercise='+id_ejercicio); 
        },
        //funcion encargada de obtener las rutinas de un usuario en específico
        getRoutinesUser: function(id_usuario) {
            return $http.get(baseUrl+'Rutinas.php?op=getRoutinesUser&id_usuario='+id_usuario);
        },
        //función encargada de agregar rutinas a un usuario
        agregarRutinaUsuario: function(id_usuario,id_rutina) {
            return $http.get(baseUrl+'Rutinas.php?op=addRoutineUser&id_usuario='+id_usuario+'&id_rutina='+id_rutina);
        },
        //función encargada de borrar una rutina de un usuario
        deleteRutinaUsuario: function(id_rutina,id_usuario) {
            return $http.get(baseUrl+'Rutinas.php?op=deleteRoutineUser&id_usuario='+id_usuario+'&id_rutina='+id_rutina);
        },
        //función encargada de obtener el id del ejercicio con su nombre
        getIdEjercicio: function(nombre){
            return $http.get(baseUrl+'Ejercicio.php?op=getIdByName&name='+nombre); 
        },
        guardarImagenEjercicio: function(linkImagen,id_ejercicio,latitud,longitud){
            return $http.get(baseUrl+'Ejercicio.php?op=guardarImagenEjercicio&link='+linkImagen+'&id_exercise='+id_ejercicio+'&latitud='+latitud+'&longitud='+longitud);
        }
    };
})