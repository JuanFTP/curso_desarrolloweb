'use-strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
	res.status(200).send({message: "Probando una acción del controlador del Usuario del API REST con Node y MongoDB"});
}

function saveUser(req, res) {
	var user = new User();
	var params = req.body;

	// Corregir el Object: null prototype

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password) {
		// Encriptar contraseña y guardar datos
		bcrypt.hash(params.password, null, null, function(err, hash) {
			user.password = hash;
			if(user.email != null && user.surname != null && user.email != null) {
				// Guardar el usuario en la base de datos
				user.save((err, userStored) => {
					if(err) {
						res.status(500).send({message: 'Error al guardar el usuario'});
					} else {
						if(!userStored) {
							res.status(404).send({message: 'No se ha podido guardar el usuario'});
						} else {
							res.status(200).send({message: userStored});
						}
					}
				});
			} else {
				// Indicar campos vacíos al usuario
				res.status(200).send({message: "Rellena todos los campos"});
			}
		});
	} else {
		res.status(200).send({message: 'Introduce una contraseña'});
	}
};

function loginUser(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err) {
			res.status(500).send({message:'Error en la patición'});
		} else {
			if(!user) {
				res.status(404).send({message:'El usuario no existe'});
			} else {
				// Comprobar la contraseña
				bcrypt.compare(password, user.password, function(err, check) {
					if(check) {
						// Devolver los datos del usuario logueado
						if(params.gethash) {
							// Devolver un token de JWT para autenticar al usuario
							res.status(200).send({token: jwt.createToken(user)});
						} else {
							res.status(200).send({message: 'getHash false', user});
						}
					} else {
						res.status(404).send({message:'El usuario no ha podido loguearse'});
					}
				});
			}
		}
	});
}

function updateUser(req, res) {
	var userId = req.params.id;
	var update = req.body;

	User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
		if(err) {
			res.status(500).send({message:'Error al actualizar el usuario'});
		} else {
			if(!userUpdate) {
				res.status(404).send({message:'No se ha podido actualizar el usuario'});
			} else {
				res.status(200).send({message:'Usuario actualizado', user: userUpdate});
			}
		}
	});
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'Imagen no cargada...';

	if(req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];
		
		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdate) => {
				if(err) {
					res.status(500).send({message:'Error al actualizar el usuario'});
				} else {
					if(!userUpdate) {
						res.status(404).send({message:'No se ha podido actualizar la imagen del usuario'});
					} else {
						res.status(200).send({message:'Usuario actualizado', user: userUpdate});
					}
				}
			});
		} else {
			res.status(200).send({message:'Extensión de archivo no válida'});
		}
	} else {
		res.status(200).send({message:'No has subido ninguna imagen...'});
	}
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage
};