// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

//Se agregó ngCordova para manejar el acceso al carrete para agregar fotos
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
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
  var usuarioTotal = [id_usuario,usuario,admin];

  id_usuario.getId = function (idNuevo) {
    id_usuario = idNuevo;
  }

  usuario.getUsuario = function (usuarioNuevo) {
    usuario = usuarioNuevo;
  }

  admin.getAdmin = function (adminNuevo) {
    admin = adminNuevo;
  }

  return usuarioTotal;

})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/side/splash')

  $stateProvider
  
  .state('sidemenu', {
      url: "/side",
      abstract: true,
      templateUrl: "templates/side-menu.html",
      controller: 'ControllerHome'
  })

  .state('sidemenu.login', {
    url: '/login',
    views: {
      'menuContent' :{
        templateUrl: "templates/login.html",
        controller: 'ControllerLogin'
      }
    }
  })

  .state('sidemenu.splash', {
    url: '/splash',
    views: {
      'menuContent' :{
        templateUrl: "templates/splash.html",
        controller: 'ControllerSplash'
      }
    }
  })

  .state('sidemenu.registro', {
    url: '/registro',
    views: {
      'menuContent' :{
        templateUrl: "templates/registro.html",
        controller: 'ControllerRegistro'
      }
    }
  })
 
 .state('sidemenu.home', {
    url: '/home',
    views: {
      'menuContent' :{
        templateUrl: "templates/Home.html",
        controller: 'ControllerHome'
      }
    }
  })

 .state('sidemenu.ejercicioRutina', {
  url: '/EjercicioRutina/:id_rutina/:id_ejercicio',
  views: {
    'menuContent' :{
      templateUrl: "templates/EjercicioRutina.html",
      controller: 'ControllerDetallesEjercicioRutina'
    }
  }
 })

 .state('sidemenu.ejercicioCategoria', {
  url: '/EjercicioCategoria/:id_categoria/:id_ejercicio',
  views: {
    'menuContent' :{
      templateUrl: "templates/EjercicioCategoria.html",
      controller: 'ControllerDetallesEjercicioCategoria'
    }
  }
 })

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

.state('sidemenu.nuevaRutina', {
  url: '/nuevaRutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevaRutina.html",
      controller: 'ControllerAgregarRutina'
    }
  }
 })

.state('sidemenu.ejerciciosNuevaRutina', {
  url: '/ejerciciosNuevaRutina/:id_rutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/ejerciciosNuevaRutina.html",
      controller: 'ControllerAgregarEjerciciosRutina'
    }
  }
 })

.state('sidemenu.nuevaCategoria', {
  url: '/nuevaCategoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevaCategoria.html",
      controller: 'ControllerAgregarCategoria'
    }
  }
 })

.state('sidemenu.nuevoEjercicio', {
  url: '/nuevoEjercicio/:id_categoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/nuevoEjercicio.html",
      controller: 'ControllerAgregarEjercicio'
    }
  }
 })

.state('sidemenu.rutinasUsuario', {
  url: '/rutinasUsuario',
  views: {
    'menuContent' :{
      templateUrl: "templates/rutinasUsuario.html",
      controller: 'ControllerRutinasUsuario'
    }
  }
 })

.state('sidemenu.usuariosRutina', {
  url: '/usuariosRutina/:id_rutina',
  views: {
    'menuContent' :{
      templateUrl: "templates/usuariosRutina.html",
      controller: 'ControllerUsuariosRutina'
    }
  }
 })

 // .state('sidemenu.registro', {
 //  url: '/registro',
 //  views: {
 //    'menuContent' :{
 //      templateUrl: "templates/registro.html"
 //    }
 //  }
 // })

 // .state('sidemenu.inicio', {
 //  url: '/inicio',
 //  views: {
 //    'menuContent' :{
 //      templateUrl: "templates/inicio.html"
 //    }
 //  }
 // })

//  .state('sidemenu.pedido', {
//   url: '/pedido', 
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/pedido.html",
//       controller: 'mostrarPlatillosCtrl'
//     }
//   }
//  })

//  .state('sidemenu.platillo', {
//   url: '/platillo/:idPlatillo',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/platillo.html",
//       controller: 'detallesPlatilloCtrl'
//     }
//   }
//  })

//   .state('sidemenu.orden', {
//   url: '/orden',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/orden.html"
//       // controller: 'mostrarPlatillosOrdenCtrl'
//     }
//   }
//  })

//   .state('sidemenu.pago', {
//   url: '/pago',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/pago.html"
//     }
//   }
//  })

// .state('sidemenu.ordenes', {
//   url: '/ordenes',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/ordenes.html",
//       controller: 'mostrarPlatillosCtrl'
//     }
//   }
//  })

// .state('sidemenu.info-orden', {
//   url: '/info-orden',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/info-orden.html",
//       controller: 'mostrarPlatillosCtrl'
//     }
//   }
//  })

// .state('sidemenu.platillos', {
//   url: '/platillos',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/platillos.html",
//       controller: 'mostrarPlatillosCtrl'
//     }
//   }
//  })

// .state('sidemenu.info-platillo', {
//   url: '/info-platillo/:idPlatillo',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/info-platillo.html",
//       controller: 'detallesPlatilloCtrl'
//     }
//   }
//  })

// .state('sidemenu.crear-platillo', {
//   url: '/crear-platillo',
//   views: {
//     'menuContent' :{
//       templateUrl: "templates/crear-platillo.html",
//       controller: 'agregarPlatilloCtrl'
//     }
//   }
//  })


 })