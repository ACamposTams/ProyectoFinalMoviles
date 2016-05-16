angular.module('starter.controllers', [])

//Controller para el splash
.controller('ControllerSplash', function($scope,$stateParams,$state,$cordovaFile) {

  //development
  //$scope.video = '../img/gym.mp4';

  //ruta al file system de Android
  $scope.video = 'file:///android_asset/www/img/gym.mp4';
  
  var vid = document.getElementById("splashVideo"); 

  //funcion para pausar el video 
  function pausarVideo() { 
    vid.pause(); 
  } 

  //se esperan 19 segundos para el video
  setTimeout(function() {
            pausarVideo();
            $state.go('sidemenu.login');
        }, 19000);
})

//Controller para hacer login
.controller('ControllerLogin', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window,$ionicHistory) {

    $scope.comprobarLogin = function(email,password){
      servicios.login(email,password,'Usuarios').success(function(data) {
      if(data.length == 1){
        //esto es para evitar que salga un botón de regreso a la vista anterior
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        //ir al home
        usuario.id_usuario = data[0].id_usuario;
        usuario.usuario = data[0].usuario;
        usuario.admin = data[0].esAdmin;
        $window.location.href= '#/side/home';
      }
      else{
        $scope.showAlert({
          title: "Datos inválidos",
          message: "El email y/o la contraseña son incorrectos"
        });
      }
        
      })
      
    }

})

//$cordovaImagePicker y $ionicPlatform son para escoger la imagen del carrete
//$cordovaGeolocation es para obtener la localización del usuario
.controller('ControllerAgregarEjercicio', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window,$cordovaImagePicker,$ionicPlatform,$cordovaGeolocation){

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
            $scope.nuevoLink = $scope.modificarLink($scope.datosEjercicio.linkVideo);
            servicios.create({
                nombreEjercicio: $scope.datosEjercicio.nombreEjercicio,
                descripcion: $scope.datosEjercicio.descripcion,
                categoria: $stateParams.id_categoria,
                linkVideo: $scope.nuevoLink,
            },'Ejercicio').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Ejercicio guardado"
                });
                $window.location.href= '#/side/Ejercicios/'+$stateParams.id_categoria;
            });
        }  
    };

    $scope.modificarLink = function(linkViejo) {
      var copia = "";
      for (var i = 16; i < linkViejo.length; i++) {
        var copia = copia + linkViejo[i];
      }
      var nuevoLink = "https://youtube.com/embed" + copia;
      return nuevoLink;
    }
})

.controller('ControllerDetallesEjercicioCategoria',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_ejercicio,"Ejercicio").success(function(datosEjercicio) {
            $scope.datosEjercicio = datosEjercicio;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });   
    };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

    $scope.showDataId();

    $scope.delete = function (datosEjercicio){
        servicios.delete(datosEjercicio[0].id_ejercicio,'Ejercicio').success(function(data){
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
                $scope.taskModal.hide(); 
            }
  };
})

.controller('ControllerDetallesEjercicioRutina',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_ejercicio,"Ejercicio").success(function(datosEjercicio) {
            $scope.datosEjercicio = datosEjercicio;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });    
    };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

    $scope.showDataId();

    $scope.delete = function (datosEjercicio){
        servicios.delete(datosEjercicio[0].id_ejercicio,'Ejercicio').success(function(data){
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
                $scope.taskModal.hide(); 
            }
  };

})

.controller('ControllerMostrarCategorias', function(usuario,$scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getAll('Categorias').success(function(data) {
            $scope.datosCategorias = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

})

.controller('ControllerEjerciciosCategoria', function(usuario,$scope,$stateParams,$ionicPopup,servicios,$window){
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

.controller('ControllerRegistro', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios){

    $scope.datosUsuario={};
    $scope.registrarUsuario = function(){
        if (!$scope.datosUsuario.nombre){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su nombre"
            });
        }else if (!$scope.datosUsuario.apPaterno){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su apellido paterno"
            });
        }else if (!$scope.datosUsuario.apMaterno){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su apellido materno"
            });
        }else if (!$scope.datosUsuario.email){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su email"
            });
        }else if (!$scope.datosUsuario.usuario){
            $scope.showAlert({
                tittle: "Info",
                message: "Introduzca su usuario"
            });
        }else if (!$scope.datosUsuario.password){
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
                password: $scope.datosUsuario.password
            },'Usuarios').success(function(data){
                $scope.showAlert({
                    title: "Info",
                    message: "Usuario Creado"
                });
                $state.go('sidemenu.home');
            });
        }  
    };
})

.controller('ControllerMostrarRutinas', function(usuario,$scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getAll('Rutinas').success(function(data) {
            $scope.datosRutinas = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

.controller('ControllerDetallesRutina',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
  
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_rutina,"Rutinas").success(function(datosRutina) {
            $scope.datosRutina = datosRutina;
            $scope.id_rutina = $stateParams.id_rutina;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });   
    };

  $scope.showRoutineWorkouts = function() {
    servicios.getWorkouts($stateParams.id_rutina).success(function(datosEjercicios){
          $scope.datosEjercicios = datosEjercicios;
    });
  }

  $scope.showDataId();
  $scope.showRoutineWorkouts();
    
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

.controller('ControllerAgregarRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
    
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

.controller('ControllerAgregarEjerciciosRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
  $scope.showData = function() {
      servicios.getAll('Ejercicio').success(function(data) {
            $scope.datosEjercicios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

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

.controller('ControllerAgregarCategoria', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
    
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

.controller('ControllerHome', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };

    $scope.userName = usuario.usuario;

    $scope.showAdmin = function()
  {
    if (usuario.admin == 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  $scope.showUsuario = function()
  {
    if (usuario.admin == 1)
    {
      return false;
    }
    else
    {
      return true;
    }
  }

})

.controller('ControllerRutinasUsuario', function(usuario,$scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getRoutinesUser(usuario.id_usuario).success(function(data) {
            console.log(data);
            $scope.datosRutinas = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

.controller('ControllerUsuariosRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
  $scope.showData = function() {
      servicios.getAll('Usuarios').success(function(data) {
            $scope.datosUsuarios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

  $scope.agregarRutina = function(id_usuario) {
    servicios.agregarRutinaUsuario(id_usuario,$stateParams.id_rutina).success(function(data){
      $scope.showAlert({
        title: "Info",
        message: "Rutina Agregada"
      });
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

.controller('AppCtrl', function(usuario,$scope,$state, $ionicModal,$ionicPopup, $timeout, servicioVendedor) {

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

})