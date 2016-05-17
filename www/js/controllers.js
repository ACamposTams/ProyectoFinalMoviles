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

  //se esperan 8 segundos para el video
  setTimeout(function() {
            pausarVideo();
            $state.go('sidemenu.login');
        }, 8000);
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
        usuario.imagenUsuario = data[0].linkFP;
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

//$cordovaCamera es para abrir la camara y tomar una foto
//$cordovaGeolocation es para obtener la localización del usuario
.controller('ControllerAgregarEjercicio', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window,$cordovaCamera,$cordovaGeolocation,$cordovaFileTransfer){

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

    //funcion para abrir la camara
    $scope.abrirCamara = function() {
      var options = { 
        quality : 10, 
        destinationType : Camera.DestinationType.DATA_URL, 
        //sourceType : Camera.PictureSourceType.CAMERA, 
        //allowEdit : false,
        encodingType: Camera.EncodingType.JPEG
        //targetWidth: 300,
        //targetHeight: 300,
        //popoverOptions: CameraPopoverOptions,
        //saveToPhotoAlbum: false
      };
   
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
              // An error occured. Show a message to the user
      });
    }
    
    $scope.ubicacionImagen = "";

    $scope.subirImagen = function(id_ejercicio) {
      var date = new Date();

      var options = {
        fileKey: "file",
        fileName: "image"+date+".jpeg",
        chunkedMode: false,
        mimeType: "image/jpeg"
      };

      $cordovaFileTransfer.upload(encodeURI("http://ubiquitous.csf.itesm.mx/~pddm-1017817/content/final/Final/upload.php"),$scope.imgURI,options).then(function(result) {
        //console.log("SUCCESS: " + JSON.stringify(result.response));
        //console.log(JSON.stringify(eval("(" + result.response + ")")));
        $scope.ubicacionImagen = JSON.stringify(eval("(" + result.response + ")"));
        $scope.guardarImagenID($scope.ubicacionImagen,id_ejercicio);
      }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
              // constant progress updates
            });
    }

    //funcion para agregar imagen y id al ejercicio
    $scope.guardarImagenID = function(linkImagen,id_ejercicio) {
      $scope.datosImagen = JSON.parse(linkImagen);
      servicios.guardarImagenEjercicio($scope.datosImagen.url,id_ejercicio,$scope.localizacion.lat,$scope.localizacion.long);
    }

    //funcion para guardar los datos del ejercicio recién agregado
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
        }else if ($scope.imgURI === undefined){
            $scope.showAlert({
                tittle: "Info",
                message: "Tomar una foto del equipo necesario"
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
                //subir imagen al servidor 
                servicios.getIdEjercicio($scope.datosEjercicio.nombreEjercicio).success(function(data){
                  $scope.subirImagen(data[0].id_ejercicio);
                })
                $window.location.href= '#/side/Ejercicios/'+$stateParams.id_categoria;
            });
        }  
    };

    //funcion creada para poder modificar los links de los videos puestos ya que únicamente se pueden mostrar videos
    //que contenga la etiqueta embed, de esta forma es más fácil para el adminsitrador agregar videos de youtube
    //solamente con el link de compartir
    $scope.modificarLink = function(linkViejo) {
      var copia = "";
      for (var i = 16; i < linkViejo.length; i++) {
        var copia = copia + linkViejo[i];
      }
      var nuevoLink = "https://youtube.com/embed" + copia;
      return nuevoLink;
    }
})

//controller encargado de los ejercicios individuales al venir de una categoria, se diferencia de los de rutina para
//mejorar la navegación de la página
.controller('ControllerDetallesEjercicioCategoria',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
  //funcion que muestra la información de un ejercicio individual utilizando el servicio conectado al archivo php
  //se agrega además la posibilidad de actualizar los datos al arrastrar la pantalla hacia abajo
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_ejercicio,"Ejercicio").success(function(datosEjercicio) {
            $scope.datosEjercicio = datosEjercicio;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });   
    };

  //funcion requerida para mostrar los videos de forma correcta y señalar que la url es confiable
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.showImages = function() {
    servicios.getImages($stateParams.id_ejercicio).success(function(datosImagen) {
      $scope.datosImagen = datosImagen;
    }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }); 
  }

  $scope.showDataId();
  $scope.showImages();

  //funcion para borrar el ejercicio con ayuda de los servicios conectados al php
  $scope.delete = function (datosEjercicio){
      servicios.delete(datosEjercicio[0].id_ejercicio,'Ejercicio').success(function(data){
              $scope.showAlert({
                  title: "Info",
                  message: "Ejercicio eliminado"
              });
              $window.location.href= '#/side/Ejercicios/'+$stateParams.id_categoria;
          });
  };

  //se muestra la view de edición del ejercicio
  $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
      },{
            scope : $scope,
            animation : 'slide-in-up' 
        });
        
  //funcion que permite que los datos que se van a editar puedan mantenerse intactos sin la necesidad de volver a escribirlos
  $scope.editModal = function(datosEjercicio){
        $scope.nombreEjercicio = datosEjercicio.nombreEjercicio;
        $scope.descripcion = datosEjercicio.descripcion;
        $scope.categoria = datosEjercicio.categoria;
        $scope.linkVideo = datosEjercicio.linkVideo;
        $scope.taskModal.show();
  };
  
  //funcion que controla que ocurre si en la view de ecición no se realiza ningún cambio
  $scope.nulo = function(){
            $scope.taskModal.hide();
            $scope.showDataId();
  };

  //función que toma los datos editados y los envía al servicio para que se actualizen los campos en la base de datos
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

//controller encargado de los ejercicios individuales al venir de una rutina, se diferencia de los de categoria para
//mejorar la navegación de la página
.controller('ControllerDetallesEjercicioRutina',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$ionicHistory,$window){
  
  //funcion que muestra la información de un ejercicio individual utilizando el servicio conectado al archivo php
  //se agrega además la posibilidad de actualizar los datos al arrastrar la pantalla hacia abajo
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_ejercicio,"Ejercicio").success(function(datosEjercicio) {
            $scope.datosEjercicio = datosEjercicio;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });    
    };

  //funcion requerida para mostrar los videos de forma correcta y señalar que la url es confiable
  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }

  $scope.showImages = function() {
    servicios.getImages($stateParams.id_ejercicio).success(function(datosImagen) {
      $scope.datosImagen = datosImagen;
    }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        }); 
  }

  $scope.showDataId();
  $scope.showImages();

  //funcion para borrar el ejercicio con ayuda de los servicios conectados al php
  $scope.delete = function (datosEjercicio){
      servicios.delete(datosEjercicio[0].id_ejercicio,'Ejercicio').success(function(data){
              $scope.showAlert({
                  title: "Info",
                  message: "Ejercicio eliminado"
              });
              $window.location.href= '#/side/Rutina/'+$stateParams.id_rutina;
          });
  };

  //se muestra la view de edición del ejercicio
  $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
      }, {
            scope : $scope,
            animation : 'slide-in-up' 
          });
  
  //funcion que permite que los datos que se van a editar puedan mantenerse intactos sin la necesidad de volver a escribirlos
  $scope.editModal = function(datosEjercicio){
          $scope.nombreEjercicio = datosEjercicio.nombreEjercicio;
          $scope.descripcion = datosEjercicio.descripcion;
          $scope.categoria = datosEjercicio.categoria;
          $scope.linkVideo = datosEjercicio.linkVideo;
          $scope.taskModal.show();
  };
  
  //funcion que controla que ocurre si en la view de ecición no se realiza ningún cambio
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

//Controlador encargado de mostrar todas las categorías disponibles en la aplicación obteniendolas de la base de datos
//gracias a los servicios conectado a los archivos php
.controller('ControllerMostrarCategorias', function(usuario,$scope,$state,$ionicPopup,servicios){
  //funcion encargada de mostrar todas las categorias disponibles
  $scope.showData = function() {
      servicios.getAll('Categorias').success(function(data) {
            $scope.datosCategorias = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

//Controlador encargado de mostrar y agregar los ejercicios que pertenecen a una categoría utilizando los servicios
//conectados a los archivo php
.controller('ControllerEjerciciosCategoria', function(usuario,$scope,$stateParams,$ionicPopup,servicios,$window){
  //fucion encargada de mostrar todos los ejercicios pertenecientes a una categoria
  $scope.showData = function() {
      servicios.getCategoria($stateParams.id_categoria).success(function(data) {
            $scope.datosEjercicios = data;
            $scope.id_categoria = $stateParams.id_categoria;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
  
  $scope.showData();

  //funcion encargada de enviar la aplicación al estado de agregar un nuevo ejercicio especificando que se agregará a 
  //esta categoría
  $scope.addExcercises = function() {
    $window.location.href= '#/side/nuevoEjercicio/'+$stateParams.id_categoria;
  }

})

//controlador encargado de manejar el registor en la aplicación
.controller('ControllerRegistro', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$cordovaCamera,$cordovaFileTransfer){

    //funcion para abrir la camara
    $scope.abrirCamara = function() {
      var options = { 
        quality : 10, 
        destinationType : Camera.DestinationType.DATA_URL, 
        encodingType: Camera.EncodingType.JPEG
      };
   
      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
              // An error occured. Show a message to the user
      });
    }

    $scope.linkFP = "";

    //funcion para subir la imagen
    $scope.subirImagen = function(nombre,apPaterno,apMaterno,email,usuario,password) {
      var date = new Date();

      var options = {
        fileKey: "file",
        fileName: "image"+date+".jpeg",
        chunkedMode: false,
        mimeType: "image/jpeg"
      };

      $cordovaFileTransfer.upload(encodeURI("http://ubiquitous.csf.itesm.mx/~pddm-1017817/content/final/Final/upload.php"),$scope.imgURI,options).then(function(result) {
        //console.log("SUCCESS: " + JSON.stringify(result.response));
        //console.log(JSON.stringify(eval("(" + result.response + ")")));
        $scope.linkFP = JSON.stringify(eval("(" + result.response + ")"));
        $scope.linkFP = JSON.parse($scope.linkFP);
        servicios.create({
                nombre: nombre,
                apPaterno: apPaterno,
                apMaterno: apMaterno,
                email: email,
                usuario: usuario,
                password: password,
                linkFP: $scope.linkFP.url
            },'Usuarios').success(function(){
                $scope.showAlert({
                    title: "Info",
                    message: "Usuario Creado"
                });
                $state.go('sidemenu.login');
            });
      }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
            }, function (progress) {
              // constant progress updates
            });
    }

    //funcion encargada de guardar los datos del nuevo usuario recien registrado utilizando los servicios y los
    //archivos php
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
        }else if ($scope.imgURI === undefined){
            $scope.showAlert({
                tittle: "Info",
                message: "Tomar una foto de perfil :)"
            });
        }else{
            $scope.subirImagen($scope.datosUsuario.nombre,$scope.datosUsuario.apPaterno,$scope.datosUsuario.apMaterno,$scope.datosUsuario.email,$scope.datosUsuario.usuario,$scope.datosUsuario.password);
        }  
    };
})

//Controlador encargado de mostrar todas las rutinas disponibles en la aplicación obteniendolas de la base de datos
//gracias a los servicios conectado a los archivos php
.controller('ControllerMostrarRutinas', function(usuario,$scope,$state,$ionicPopup,servicios){
  //funcion encargada de mostrar todas las rutinas disponibles
  $scope.showData = function() {
      servicios.getAll('Rutinas').success(function(data) {
            $scope.datosRutinas = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();
})

//controlador encargado de mostrar la información individual de una rutina
.controller('ControllerDetallesRutina',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
  
  //funcion que muestra la información de una rutina individual utilizando el servicio conectado al archivo php
  //se agrega además la posibilidad de actualizar los datos al arrastrar la pantalla hacia abajo
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_rutina,"Rutinas").success(function(datosRutina) {
            $scope.datosRutina = datosRutina;
            $scope.id_rutina = $stateParams.id_rutina;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });   
    };

  //funcion encargada de mostrar los ejercicios que pertenecen a esa rutina
  $scope.showRoutineWorkouts = function() {
    servicios.getWorkouts($stateParams.id_rutina).success(function(datosEjercicios){
          $scope.datosEjercicios = datosEjercicios;
    });
  }

  $scope.showDataId();
  $scope.showRoutineWorkouts();
  
  //funcion para borrar la rutina con ayuda de los servicios conectados al php
  $scope.delete = function (datosRutina){
      servicios.delete(datosRutina.id_rutina,'Rutinas').success(function(data){
              $scope.showAlert({
                  title: "Info",
                  message: "Rutina eliminada"
              });
          });
  };

  //funcion para marcar las rutinas como terminadas
  $scope.deleteRutinaUsuario = function (datosRutina){
      servicios.deleteRutinaUsuario(datosRutina.id_rutina,usuario.id_usuario).success(function(data){
              $scope.showAlert({
                  title: "Info",
                  message: "Rutina terminada"
              });
          });
  };

  //se muestra la view de edición de la rutina
  $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
      }, {
            scope : $scope,
            animation : 'slide-in-up' 
          });
    
  //funcion que permite que los datos que se van a editar puedan mantenerse intactos sin la necesidad de volver a escribirlos
  $scope.editModal = function(datosRutina){
          $scope.nombreRutina = datosRutina.nombreRutina;
          $scope.descripcion = datosRutina.descripcion;
          $scope.taskModal.show();
          $scope.showRoutineWorkouts();
  };
  
  //funcion que controla que ocurre si en la view de ecición no se realiza ningún cambio
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

  //funcion para borrar el ejercicio de la rutina con ayuda de los servicios conectados al php
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

//controlador encargado de agregar rutinas a la aplicación
.controller('ControllerAgregarRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
    
    //función encargada de guardar la información de la rutina recien creada
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
                  $window.location.href= '#/side/ejerciciosNuevaRutina/'+data2[0].id_rutina;
                });
            });
        }  
    };
})

//controlador encargado de agregar ejercicios a las rutinas
.controller('ControllerAgregarEjerciciosRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
  //controlador encargado de mostrar todos los ejercicios disponibles para que sean agregados a la rutina
  $scope.showData = function() {
      servicios.getAll('Ejercicio').success(function(data) {
            $scope.datosEjercicios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    $scope.showData();

  //se muestra la view para agregar la eespecificación al ejercicio que se desea agregar a la rutina
  $ionicModal.fromTemplateUrl('edit.html', function(modal){
        $scope.taskModal = modal;
  }, {
            scope : $scope,
            animation : 'slide-in-up' 
  });
  
  //funcion que permite que los datos que se van a editar puedan mantenerse intactos sin la necesidad de volver a escribirlos 
  $scope.editModal = function(datosEjercicio){
          $scope.id_ejercicio = datosEjercicio.id_ejercicio;
          $scope.nombreEjercicio = datosEjercicio.nombreEjercicio;
          $scope.taskModal.show();
  };
  
  //funcion que controla que ocurre si en la view de ecición no se realiza ningún cambio
  $scope.nulo = function(){
            $scope.taskModal.hide();
  };

  //funcion encargada de agregar los ejercicios a las rutinas
  $scope.agregarARutina = function(id_ejercicio,especificaciones) {
    servicios.agregarEjercicioRutina(id_ejercicio,$stateParams.id_rutina,especificaciones).success(function(data){
      $scope.showAlert({
        title: "Info",
        message: "Ejercicio Agregado"
      });
      $scope.taskModal.hide();
    })
  }

  $scope.agregarAUsuarios = function() {
    $window.location.href= '#/side/usuariosRutina/'+$stateParams.id_rutina;
  }

  //funcion que redirige al usuario a las rutinas al terminar de crear una nueva rutina
  $scope.terminarRutina = function(){
    $scope.showAlert({
        title: "Info",
        message: "Rutina Agregada"
      });
    $state.go('sidemenu.rutinas');
  }

})

//controlador encargado de agregar nuevas categorías a la aplicación
.controller('ControllerAgregarCategoria', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
    
    //controlador encargadod e guardar la información de la categoría recién creada
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

//controlador encargado de aspectos generales de la aplicación
.controller('ControllerHome', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
   //funcion que establece la forma de los mensaje que se muestran alrededor de la aplicación
   $scope.showAlert = function(msg) {
      $ionicPopup.alert({
          title: msg.title,
          template: msg.message,
          okText: 'Ok',
          okType: 'button-positive'
      });
    };

    var imagenUsuario = ""
    $scope.imagenUsuario = "";
    $scope.userName = usuario.usuario;
    $scope.imagenUsuario = usuario.imagenUsuario;
    imagenUsuario = usuario.imagenUsuario;

  //funcion encargada de mostrar el contenido de administrador al ususario si este cuenta con ese permiso
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

  //funcion encargada de mostrar el contenido de usuario al usuario si este no cuenta con el permiso de administrador
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

  $scope.modificarUsuario = function() {
    $window.location.href= '#/side/modificarUsuario/'+usuario.id_usuario;
  }
})

//controlador encargado de mostras las rutinas que se le han asignado a un usuario
.controller('ControllerRutinasUsuario', function(usuario,$scope,$state,$ionicPopup,servicios){
  $scope.showData = function() {
      servicios.getRoutinesUser(usuario.id_usuario).success(function(data) {
            $scope.datosRutinas = data;
            $scope.showContent($scope.datosRutinas);
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
  };
    
  $scope.showFinishedData = function() {
    servicios.getFinishedRoutinesUser(usuario.id_usuario).success(function(data2) {
      $scope.datosRutinas2 = data2;
      $scope.showContent($scope.datosRutinas2);
    }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.showContent = function(data) {
    if (data == [])
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  $scope.showData();
  $scope.showFinishedData();
})

//controlador encargado del manejo de la asignación de rutinas a usuarios
.controller('ControllerUsuariosRutina', function(usuario,$scope,$stateParams,$ionicPopup,$ionicModal,$state,servicios,$window){
  //función que muestra todos los usuarios a los cuales se les puede asignar una rutina
  $scope.showData = function() {
      servicios.getAll('Usuarios').success(function(data) {
            $scope.datosUsuarios = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

  //funcion que permite agregarle una rutina a un usuario
  $scope.agregarRutina = function(id_usuario) {
    servicios.agregarRutinaUsuario(id_usuario,$stateParams.id_rutina).success(function(data){
      $scope.showAlert({
        title: "Info",
        message: "Rutina Agregada"
      });
    })
  }

  $scope.showData();
})

//controlador encargado de mostrar la información individual de una rutina
.controller('ControllerModificarUsuario',function(usuario,$scope,$sce,$stateParams,$ionicPopup,$ionicModal,$state,servicios){
  
  //funcion que muestra la información de una rutina individual utilizando el servicio conectado al archivo php
  //se agrega además la posibilidad de actualizar los datos al arrastrar la pantalla hacia abajo
  $scope.showDataId = function() {
      servicios.getId($stateParams.id_usuario,"Usuarios").success(function(datosUsuario) {
            $scope.datosUsuario = datosUsuario;
            console.log(datosUsuario);

        })
    };

  $scope.delete = function(id_usuario) {
    servicios.delete(id_usuario,"Usuarios").success(function() {
      $scope.showAlert({
                        title: "Info",
                        message: "Usuario Eliminado"
                    });
    })
  }

  $scope.showDataId();

  //Arreglar que no se tenga que pasar el id para editar 
  $scope.edit = function(id_usuario,nombre,apPaterno,apMaterno,email,usuario,password){
            if (!id_usuario){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca el Id"
                });
            }else if (!nombre){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su nombre"
                });
            }else if(!apPaterno){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su apellido paterno"
                });
            }else if(!apMaterno){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su apellido materno"
                });
            }else if(!email){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su email"
                });
            }else if(!usuario){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su usuario"
                });
            }else if(!password){
                $scope.showAlert({
                    title: "Info",
                    message: "Introduzca su password"
                });
            }else{
                $scope.id_usuario = id_usuario;
                $scope.nombre = nombre;
                $scope.apPaterno = apPaterno;
                $scope.apMaterno = apMaterno;
                $scope.email = email;
                $scope.usuario = usuario;
                $scope.password = password;
                servicios.update({
                    'id_usuario' : id_usuario,
                    'nombre': nombre,
                    'apPaterno': apPaterno,
                    'apMaterno': apMaterno,
                    'email': email,
                    'usuario': usuario,
                    'password': password,
                },'Usuarios').then(function(resp) {
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