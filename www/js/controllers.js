angular.module('starter.controllers', [])

.controller('ControllerAgregarEjercicio', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };
    
    $scope.datosEjercicio={};
    $scope.guardarEjercicio = function(){
        if (!scope.datosEjercicio.nombreEjercicio){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el nombre del ejercicio"
            });
        }else if (!scope.datosEjercicio.descripcion){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca la descripcion del ejercicio"
            });
        }else if (!scope.datosEjercicio.categoria){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca la categoria del ejercicio"
            });
        }else if (!scope.datosEjercicio.linkVideo){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el link al video del ejercicio"
            });
        }else{
            servicios.create({
                nombreEjercicio: $scope.datosEjercicio.nombreEjercicio,
                descripcion: $scope.datosEjercicio.descripcion,
                categoria: $scope.datosEjercicio.categoria,
                linkVideo: $scope.datosEjercicio.linkVideo,
            },'Ejercicio').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Auto guardado"
                });
            });
        }  
    };
})

.controller('ControllerDetallesEjercicio',function($scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
  
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_ejercicio,"Ejercicio").success(function(datosEjercicio) {
            $scope.datosEjercicio = datosEjercicio;
        });   
    };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

    $scope.showDataId();

    $scope.delete = function (datosEjercicio){
        servicios.delete(datosEjercicio.id_ejercicio,'Ejercicio').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Ejercicio eliminado"
                });
            });
    };

    $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
  }, {
            scope : $scope,
            animation : 'slide-in-up' 
  });
        
        $scope.showAlert = function(msg) {
            $ionicPopup.alert({
                title: msg.title,
                template: msg.message,
                okText: 'Ok',
                okType: 'button-positive'
            });
          };
    
    $scope.editModal = function(datosEjercicio){
            $scope.nombreEjercicio = datosEjercicio.nombreEjercicio;
            $scope.descripcion = datosEjercicio.descripcion;
            $scope.categoria = datosEjercicio.categoria;
            $scope.linkVideo = datosEjercicio.linkVideo;
            $scope.taskModal.show();
  };
  
  $scope.nulo = function(){
            $scope.taskModal.hide();
            $scope.showDataId();
  };

  //Arreglar que no se tenga que pasar el id para editar 
  $scope.edit = function(id_ejercicio,nombreEjercicio,descripcion,categoria,linkVideo){
            if (!id_ejercicio){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el Id"
                });
            }else if (!nombreEjercicio){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el nombre del ejercicio"
                });
            }else if(!descripcion){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca la descripcion del ejercicio"
                });
            }else if(!categoria){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca la categoria del ejercicio"
                });
            }else if(!linkVideo){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el link al video del ejercicio"
                });
            }else{
                $scope.id_ejercicio = id_ejercicio;
                $scope.nombreEjercicio = nombreEjercicio;
                $scope.categoria = categoria;
                $scope.descripcion = descripcion;
                $scope.linkVideo = linkVideo;
                servicios.update({
                    'id_ejercicio' : id_ejercicio,
                    'nombreEjercicio': nombreEjercicio,
                    'categoria': categoria,
                    'descripcion': descripcion,
                    'linkVideo': linkVideo,
                },'Ejercicio').then(function(resp) {
                  console.log('Exito', resp);
                  $scope.showAlert({
                        title: "Info",
                        message: "Los datos has sido actualizados"
                    });
                },function(err) {
                  console.error('Error', err);
                }); 
            }
  };
})

.controller('ControllerMostrarCategorias', function($scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getAll('Categorias').success(function(data) {
            $scope.datosCategorias = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

.controller('ControllerEjerciciosCategoria', function($scope,$stateParams,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getCategoria($stateParams.id_categoria).success(function(data) {
            $scope.datosEjercicios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

.controller('ControllerRegistro', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };
    
    $scope.datosUsuario={};
    $scope.guardarEjercicio = function(){
        if (!scope.datosUsuario.nombre){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su nombre"
            });
        }else if (!scope.datosUsuario.apPaterno){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su apellido paterno"
            });
        }else if (!scope.datosUsuario.apMaterno){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su apellido materno"
            });
        }else if (!scope.datosUsuario.email){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su email"
            });
        }else if (!scope.datosUsuario.usuario){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su usuario"
            });
        }else if (!scope.datosUsuario.contraseña){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su contraseña"
            });
        }else{
            servicios.create({
                nombre: $scope.datosUsuario.nombre,
                apPaterno: $scope.datosUsuario.apPaterno,
                apMaterno: $scope.datosUsuario.apMaterno,
                email: $scope.datosUsuario.email,
                usuario: $scope.datosUsuario.usuario,
                contraseña: $scope.datosUsuario.contraseña
            },'Usuario').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Auto guardado"
                });
            });
        }  
    };
})

.controller('AppCtrl', function($scope,$state, $ionicModal,$ionicPopup, $timeout, servicioVendedor) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };

//Funcion que guarda los datos del vendedor
  $scope.datosVendedor={};
    $scope.guardarVendedor = function (){
        if (!$scope.datosVendedor.nombre){
            $scope.showAlert({
                title: "Info",
                message: "Introduzca el nombre del vendedor"
            });
        }else if(!$scope.datosVendedor.apellidos){
            $scope.showAlert({
                title: "Info",
                message: "Introduzca sus apellidos"
            });
        }else if(!$scope.datosVendedor.email){
            $scope.showAlert({
                title: "Info",
                message: "Introduzca su email"
            });
    }else if(!$scope.datosVendedor.password){
            $scope.showAlert({
                title: "Info",
                message: "Introduzca su contraseña"
            });
        }else{
            servicioVendedor.create({
                nombre: $scope.datosVendedor.nombre,
                apellidos: $scope.datosVendedor.apellidos,
                email: $scope.datosVendedor.email,
                password: $scope.datosVendedor.password
            }).success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Vendedor Registrado"
                });
                $state.go('app.inicio');
            });
        }  
    };

//Funcion que comprueba la identidad del usuario de acuerdo a la base de datos
    $scope.comprobarLogin = function (email,password){
        servicioVendedor.getPassword(email).success(function(data) {
            $scope.datosVendedor = data;
        })
        if ($scope.datosVendedor.password == password){
          $state.go('app.inicio');
        }
        else{
          $scope.showAlert({
                    title: "Info",
                    message: "Acceso Inválido" + $scope.datosVendedor.password
                });
        }
    }
})