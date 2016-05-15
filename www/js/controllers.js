angular.module('starter.controllers', [])

//$cordovaImagePicker y $ionicPlatform son para escoger la imagen del carrete
//$cordovaGeolocation es para obtener la localización del usuario
.controller('ControllerAgregarEjercicio', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window,$cordovaImagePicker,$ionicPlatform,$cordovaGeolocation){

    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    $scope.localizacion = {
      lat: '',
      long: ''
    };

    //para obtener la localización se utilizó el plugin: 
    //cordova plugin add cordova-plugin-geolocation
    $scope.obtenerLocalizacion = function() {
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $scope.localizacion.lat  = position.coords.latitude
          $scope.localizacion.long = position.coords.longitude
        }, function(err) {
          println("No se pudo accesar a la localización")
      });
    }
    

    //definicion de collection para accesar a la imagen
    $scope.collection = {
      selectedImage: ''
    };

    //funcion para accesar al carrete y seleccionar una imagen
    $ionicPlatform.ready(function() {
 
        $scope.obtenerImagen = function() {       
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80            // Higher is better
            };
 
            $cordovaImagePicker.getPictures(options).then(function (results) {
                //For que recoge las imágenes
                for (var i = 0; i < results.length; i++) {
                    // We loading only one image so we can use it like this
                    $scope.collection.selectedImage = results[i];
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };  
 
    });

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
        if (!$scope.datosEjercicio.nombreEjercicio){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el nombre del ejercicio"
            });
        }else if (!$scope.datosEjercicio.descripcion){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca la descripcion del ejercicio"
            });
        }else if (!$scope.datosEjercicio.linkVideo){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el link al video del ejercicio"
            });
        }else{
            servicios.create({
                nombreEjercicio: $scope.datosEjercicio.nombreEjercicio,
                descripcion: $scope.datosEjercicio.descripcion,
                categoria: $stateParams.id_categoria,
                linkVideo: $scope.datosEjercicio.linkVideo,
            },'Ejercicio').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Ejercicio guardado"
                });
                $window.location.href= '#/side/Ejercicios/'+$stateParams.id_categoria;
            });
        }  
    };
})

.controller('ControllerDetallesEjercicioCategoria',function($scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
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
                $window.location.href= '#/side/Ejercicios/'+$stateParams.id_categoria;
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

.controller('ControllerDetallesEjercicioRutina',function($scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
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
                $window.location.href= '#/side/Rutina/'+$stateParams.id_rutina;
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

.controller('ControllerEjerciciosCategoria', function($scope,$stateParams,$ionicPopup,servicios,$window){
  $scope.showData = function() {
      servicios.getCategoria($stateParams.id_categoria).success(function(data) {
            $scope.datosEjercicios = data;
            $scope.id_categoria = $stateParams.id_categoria;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

  $scope.addExcercises = function() {
    $window.location.href= '#/side/nuevoEjercicio/'+$stateParams.id_categoria;
  }
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
                    message: "Usuario guardado"
                });
            });
        }  
    };
})

.controller('ControllerMostrarRutinas', function($scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getAll('Rutinas').success(function(data) {
            $scope.datosRutinas = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

.controller('ControllerDetallesRutina',function($scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
  
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_rutina,"Rutinas").success(function(datosRutina) {
            $scope.datosRutina = datosRutina;
            $scope.id_rutina = $stateParams.id_rutina;
        });   
    };

  $scope.showRoutineWorkouts = function() {
    servicios.getWorkouts($stateParams.id_rutina).success(function(datosEjercicios){
          $scope.datosEjercicios = datosEjercicios;
    });
  }

  $scope.showDataId();
  $scope.showRoutineWorkouts();

  $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };
    
  $scope.delete = function (datosRutina){
      servicios.delete(datosRutina.id_rutina,'Rutinas').success(function(data){
              $scope.showAlert({
                  title: "Info",
                  message: "Rutina eliminada"
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
    
    $scope.editModal = function(datosRutina){
            $scope.nombreRutina = datosRutina.nombreRutina;
            $scope.descripcion = datosRutina.descripcion;
            $scope.taskModal.show();
            $scope.showRoutineWorkouts();
  };
  
  $scope.nulo = function(){
            $scope.taskModal.hide();
            $scope.showDataId();
            $scope.showRoutineWorkouts();
  };

  //Arreglar que no se tenga que pasar el id para editar 
  $scope.edit = function(id_rutina,nombreRutina,descripcion){
            if (!id_rutina){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el Id"
                });
            }else if (!nombreRutina){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el nombre de la Rutina"
                });
            }else if(!descripcion){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca la descripcion de la rutina"
                });
            }else{
                $scope.id_rutina = id_rutina;
                $scope.nombreRutina = nombreRutina;
                $scope.descripcion = descripcion;
                servicios.update({
                    'id_rutina' : id_rutina,
                    'nombreRutina': nombreRutina,
                    'descripcion': descripcion,
                },'Rutinas').then(function(resp) {
                  console.log('Exito', resp);
                  $scope.showAlert({
                        title: "Info",
                        message: "Los datos has sido actualizados"
                    });
                },function(err) {
                  console.error('Error', err);
                });
                $scope.taskModal.hide();
                $scope.showDataId();
                $scope.showRoutineWorkouts();
            }
  };

  $scope.deleteExercise = function (datosEjercicio){
        servicios.deleteEjercicio(datosEjercicio.id_ejercicio,$stateParams.id_rutina).success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Ejercicio eliminado de la rutina"
                });
                $scope.taskModal.hide();
                $scope.showRoutineWorkouts();
            });
    };

})

.controller('ControllerAgregarRutina', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };
    
    $scope.datosRutina={};
    $scope.guardarRutina = function(){
        if (!$scope.datosRutina.nombreRutina){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el nombre de la rutina"
            });
        }else if (!$scope.datosRutina.descripcion){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca la descripcion del ejercicio"
            });
        }else{
            servicios.create({
                nombreRutina: $scope.datosRutina.nombreRutina,
                descripcion: $scope.datosRutina.descripcion,
            },'Rutinas').success(function(data){
                servicios.getIdRutina($scope.datosRutina.nombreRutina).success(function(data2){
                  console.log(data2[0].id_rutina);
                  $window.location.href= '#/side/ejerciciosNuevaRutina/'+data2[0].id_rutina;
                });
            });
        }  
    };
})

.controller('ControllerAgregarEjerciciosRutina', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
  $scope.showData = function() {
      servicios.getAll('Ejercicio').success(function(data) {
            $scope.datosEjercicios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

  $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };

  $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
  }, {
            scope : $scope,
            animation : 'slide-in-up' 
  });
    
    $scope.editModal = function(datosEjercicio){
            console.log(datosEjercicio.id_ejercicio);
            $scope.id_ejercicio = datosEjercicio.id_ejercicio;
            $scope.nombreEjercicio = datosEjercicio.nombreEjercicio;
            $scope.taskModal.show();
  };
  
  $scope.nulo = function(){
            $scope.taskModal.hide();
  };

  $scope.agregarARutina = function(id_ejercicio,especificaciones) {
    servicios.agregarEjercicioRutina(id_ejercicio,$stateParams.id_rutina,especificaciones).success(function(data){
      $scope.showAlert({
        title: "Info",
        message: "Ejercicio Agregado"
      });
      $scope.taskModal.hide();
    })
  }

  $scope.terminarRutina = function(){
    $scope.showAlert({
        title: "Info",
        message: "Rutina Agregada"
      });
    $state.go('sidemenu.rutinas');
  }

})

.controller('ControllerAgregarCategoria', function($scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };
    
    $scope.datosCategoria={};
    $scope.guardarCategoria = function(){
        if (!$scope.datosCategoria.categoria){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca el nombre de la categoria"
            });
        }else{
            servicios.create({
                categoria: $scope.datosCategoria.categoria
            },'Categorias').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Categoria guardada"
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