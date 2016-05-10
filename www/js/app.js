// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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


.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/side/login')

  $stateProvider
  
  .state('sidemenu', {
      url: "/side",
      abstract: true,
      templateUrl: "templates/side-menu.html"
  })

  .state('sidemenu.login', {
    url: '/login',
    views: {
      'menuContent' :{
        templateUrl: "templates/login.html",
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
      }
    }
  })

 .state('sidemenu.ejercicio', {
  url: '/Ejercicio/:id_ejercicio',
  views: {
    'menuContent' :{
      templateUrl: "templates/Ejercicio.html",
      controller: 'ControllerDetallesEjercicio'
    }
  }
 })

.state('sidemenu.categorias', {
  url: '/Categorias',
  views: {
    'menuContent' :{
      templateUrl: "templates/Categorias.html",
      controller: 'ControllerMostrarCategorias'
    }
  }
 })

.state('sidemenu.ejerciciosCategoria', {
  url: '/Ejercicios/:id_categoria',
  views: {
    'menuContent' :{
      templateUrl: "templates/ejerciciosCategoria.html",
      controller: 'ControllerEjerciciosCategoria'
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