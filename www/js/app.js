
//Se agregó ngCordova para manejar el acceso al carrete para agregar fotos
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {

      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('usuario', function() {
  var id_usuario = 0;
  var usuario = "";
  var admin = 0;
  var imagenUsuario = "";
  var usuarioTotal = [id_usuario,usuario,admin,imagenUsuario];

  id_usuario.getId = function (idNuevo) {
    id_usuario = idNuevo;
  }

  usuario.getUsuario = function (usuarioNuevo) {
    usuario = usuarioNuevo;
  }

  admin.getAdmin = function (adminNuevo) {
    admin = adminNuevo;
  }

  imagenUsuario.getImagenUsuario = function (imagenNueva) {
    imagenUsuario = imagenNueva;
  }

  return usuarioTotal;

})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/side/splash')

  $stateProvider
  
  //estado encargado del menú lateral
  .state('sidemenu', {
      url: "/side",
      abstract: true,
      templateUrl: "templates/side-menu.html",
      controller: 'ControllerHome'
  })

  //estado encargado del login
  .state('sidemenu.login', {
    url: '/login',
    views: {
      'menuContent' :{
        templateUrl: "templates/login.html",
        controller: 'ControllerLogin'
      }
    }
  })

  //estado encargado del splash de video inicial
  .state('sidemenu.splash', {
    url: '/splash',
    views: {
      'menuContent' :{
        templateUrl: "templates/splash.html",
        controller: 'ControllerSplash'
      }
    }
  })

  //estado encargado del registro
  .state('sidemenu.registro', {
    url: '/registro',
    views: {
      'menuContent' :{
        templateUrl: "templates/registro.html",
        controller: 'ControllerRegistro'
      }
    }
  })
 
 //estado encargado de la pantalla principal de la aplicación
 .state('sidemenu.home', {
    url: '/home',
    views: {
      'menuContent' :{
        templateUrl: "templates/Home.html",
        controller: 'ControllerHome'
      }
    }
  })

 //estado encargado del ejercicio de una rutina
 .state('sidemenu.ejercicioRutina', {
  url: '/EjercicioRutina/:id_rutina/:id_ejercicio',
  views: {
    'menuContent' :{
      templateUrl: "templates/EjercicioRutina.html",
      controller: 'ControllerDetallesEjercicioRutina'
    }
  }
 })

 //estado encargado del ejercicio de una categoria
 .state('sidemenu.ejercicioCategoria', {
  url: '/EjercicioCategoria/:id_categoria/:id_ejercicio',
  views: {
    'menuContent' :{
      templateUrl: "templates/EjercicioCategoria.html",
      controller: 'ControllerDetallesEjercicioCategoria'
    }
  }
 })

//estado encargado de mostrar todas las categorias
.state('sidemenu.categorias', {
  cache: false,
  url: '/Categorias',
  views: {
    'menuContent' :{
      templateUrl: "templates/Categorias.html",
      controller: 'ControllerMostrarCategorias'
    }
  }
 })

//estado encargado de mostrar todos los ejercicios de una categoria
.state('sidemenu.ejerciciosCategoria', {
  cache: false,
  url: '/Ejercicios/:id_categoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/ejerciciosCategoria.html",
      controller: 'ControllerEjerciciosCategoria'
    }
  }
 })

//estado encargado de mostrar todas las rutinas
.state('sidemenu.rutinas', {
  cache: false,
  url: '/Rutinas',
  views: {
    'menuContent' :{
      templateUrl: "templates/Rutinas.html",
      controller: 'ControllerMostrarRutinas'
    }
  }
 })

//estado encargado de mostrar una rutina
.state('sidemenu.rutina', {
  cache: false,
  url: '/Rutina/:id_rutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/Rutina.html",
      controller: 'ControllerDetallesRutina'
    }
  }
 })

//estado encargado de mostrar los campos apra agregar una nueva rutina
.state('sidemenu.nuevaRutina', {
  url: '/nuevaRutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevaRutina.html",
      controller: 'ControllerAgregarRutina'
    }
  }
 })

//estado encargado de agregar ejercicios a una rutina
.state('sidemenu.ejerciciosNuevaRutina', {
  url: '/ejerciciosNuevaRutina/:id_rutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/ejerciciosNuevaRutina.html",
      controller: 'ControllerAgregarEjerciciosRutina'
    }
  }
 })

//estado encargado de agregar una categoria
.state('sidemenu.nuevaCategoria', {
  url: '/nuevaCategoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevaCategoria.html",
      controller: 'ControllerAgregarCategoria'
    }
  }
 })

//estado encargado de agregar un ejercicio
.state('sidemenu.nuevoEjercicio', {
  url: '/nuevoEjercicio/:id_categoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevoEjercicio.html",
      controller: 'ControllerAgregarEjercicio'
    }
  }
 })

//estado encargado de mostrar las rutinas de un usuario
.state('sidemenu.rutinasUsuario', {
  cache: false,
  url: '/rutinasUsuario',
  views: {
    'menuContent' :{
      templateUrl: "templates/rutinasUsuario.html",
      controller: 'ControllerRutinasUsuario'
    }
  }
 })

//estado encargado de agregar rutinas a un usuario
.state('sidemenu.usuariosRutina', {
  url: '/usuariosRutina/:id_rutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/usuariosRutina.html",
      controller: 'ControllerUsuariosRutina'
    }
  }
 })

//estado encargado de modificar la información del usuario
.state('sidemenu.modificarUsuario', {
  url: '/modificarUsuario/:id_usuario',
  views: {
    'menuContent' :{
      templateUrl: "templates/modificarUsuario.html",
      controller: 'ControllerModificarUsuario'
    }
  }
 })

 })