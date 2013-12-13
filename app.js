<<<<<<< HEAD
var express = require('express');
var app = express();
var http = require('http'),
path = require('path'),
e = require('./handleEvents');

app.configure(function(){
	app.set('port', 8080);
	app.use(express.static(path.join(__dirname, 'static')));
	app.get('*', function(req, res){
		res.send('NO ES POSIBLE ACCEDER A ESTA PARTE DEL SERVIDOR' , 404);
	});
});


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Servidor en linea en el puerto: ' + app.get('port'));
});

var io = require('socket.io').listen(server, {log: false});

io.sockets.on('connection', function(socket){

	socket.on('login', function(d){
		e.empleado(d, function(c){
			socket.emit('loginCallback', c);			
		});
	});
	socket.on('registro', function(d){
		e.empleado(d, function(c){
			socket.emit('listoEmpleado', c);
		});
	});
	socket.on('add usuario', function(d){
		e.usuario(d, function(c){
			socket.emit('usuarioCallback', c);
			io.sockets.emit('responseSucesosEmp', c);
		});
	});
	socket.on('validar cedula', function(d){
		e.validaCedula(d, function(c){
			socket.emit('recibe cedula', c);
		});
	});
	socket.on('consulta', function(d){
		e.validaCedula(d, function(c){
			socket.emit('consulta hecha', c);
		});
	});

	socket.on('cambiaPass', function(d) {
		e.cambiaPass(d, function(c) {
			socket.emit('cambiaPassComplete', c);
		});
	});
	socket.on('metasEmpleado', function(d) {
		e.metasConsulta(d, function(c) {
			socket.emit('metasComplete', c);
		});
	});
	socket.on('requestEmpMetas', function(d){
		e.EmpMetas(d, function(c) {
			socket.emit('responseEmpMetas', c);
		});
	});
	socket.on('vaciaMetasEmp', function(d){
		e.vaciaMetasEmp(d, function(c) {
			io.sockets.emit('updateMetaEmp', c);
		});
	});
	socket.on('requestEmpresas', function(d) {
		e.requestEmpresas(d, function(c) {
			socket.emit('responseEmpresas', c);
		});
	});
	socket.on('creaEmpresa', function(d) {
		e.creaEmpresa(d, function(c) {
			socket.emit('responseCreaEmpresa', c);
		});
	});
	socket.on('listarDatos', function(d) {		
		e.listarDatos(d,function(c) {
			socket.emit('responseListarDatos', c);
		});
	});
	socket.on('listarUsuEmpresa', function(d) {
		e.listarUsuEmpresa(d, function(c) {
			socket.emit('responseListarUsuEmpresa', c);
		});
	});
	socket.on('eliminarEmpresa', function(d) {
		e.eliminarEmpresa(d, function(c) {
			socket.emit('responseEliminarEmpresa', c);
		});
	});
	socket.on('requestSucesosEmp', function(d) {
		e.requestSucesosEmp(d, function(c) {
			socket.emit('responseSucesosEmp', c);
		});
	});
	socket.on('listarEmpleados', function(d) {
		e.listarEmpleados(d, function(c) {
			socket.emit('responselistarEmpleados', c);
		});
	});
	socket.on('listarTablaSS', function(d) {
		e.listarTablas(d, function(c) {
			socket.emit('responseListarTabla', c);
		});
	});
	socket.on('listarCargo', function(d) {
		e.listarTablas(d, function(c) {
			socket.emit('responseListarTabla', c);
		});
	});
	socket.on('listarTablaEmpleado', function(d) {
		e.listarTablas(d, function(c) {
			socket.emit('responseListarTabla', c);
		});
	});
	socket.on('listarTablaEmpresaVin', function(d) {
		e.listarTablas(d, function(c) {
			socket.emit('responseListarTabla', c);
		});
	});
	socket.on('listarNombre', function(d) {
		e.listarTablas(d, function(c) {
			socket.emit('responseListarTabla', c);
		});
	});
	socket.on('actualizaUsuario', function(d) {
		e.actualizaUsuario(d, function(c) {
			socket.emit('responseActUsu', c);
		});
	});
	socket.on('newUser', function(d) {
		e.newUser(d, function(c){
			socket.emit('newUserResp', c);
		});
	});
	socket.on('newUserEmp', function(d) {
		e.newUserEmp(d, function(c){
			socket.emit('requestUserEmp', c)
		})
	})
	socket.on('formTodo', function(d) {
		e.formTodo(d, function(c){
			socket.emit('formTodoResp', c)
		})
	})
	socket.on('borrarUser', function(d) {
		e.borrarUser(d, function(c) {
			socket.emit('borrarUserResp', c)
		})
	})
	socket.on('userEdit', function(d) {
		e.userEdit(d, function(c){
			socket.emit('userEdited', c)
		})
	})
	socket.on('usuMas', function(d) {
		e.usuMas(d)
	})
	socket.on('guardarInfoEmpresa', function(d){
		e.guardarInfoEmpresa(d, function(c){
			socket.emit('successGuardarInfoEmp', c)
		})
	})
});
=======
var express = require('express');
var app = express();
var http = require('http'),
path = require('path'),
handleEvents = require('./handleEvents');

app.configure(function(){
	app.set('port', 8082);
	app.use(express.static(path.join(__dirname, 'static')));
	app.get('*', function(req, res){
		res.send('NO ES POSIBLE ACCEDER A ESTA PARTE DEL SERVIDOR' , 404);
	});
});


var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Servidor en linea en el puerto: ' + app.get('port'));
});

var io = require('socket.io').listen(server, {log: false});

io.sockets.on('connection', function(socket){

	socket.on('login', loginEmpleado);
	socket.on('registro', insertaEmpleado);
	socket.on('add usuario', insertaUsuario);
	socket.on('validar cedula', validarCedula);
	socket.on('consulta', hacerConsulta);
	socket.on('cambiaPass', cambiaPass);
	socket.on('metasEmpleado', metasEmpleado);
	socket.on('requestEmpMetas', requestEmpMetas);
	socket.on('vaciaMetasEmp', vaciaMetasEmp);
	socket.on('requestEmpresas', requestEmpresas);
	socket.on('creaEmpresa', creaEmpresa);
	socket.on('listarDatos', listarDatos);
	socket.on('listarUsuEmpresa', listarUsuEmpresa);
	socket.on('eliminarEmpresa', eliminarEmpresa);
	socket.on('requestSucesosEmp', requestSucesosEmp);
	socket.on('listarEmpleados', listarEmpleados);
	socket.on('listarTablaSS', listarTablaSS);
	socket.on('listarCargo', listarCargo);
	socket.on('listarTablaEmpleado', listaTablaEmpleado);
	socket.on('listarTablaEmpresaVin', listarTablaEmpresaVin);
	socket.on('listarNombre', listarNombre);
	socket.on('actualizaUsuario', actualizaUsuario);

	function insertaEmpleado(data){
		handleEvents.empleado(data, function(status){
			socket.emit('listoEmpleado', status);
		});
	}
	function loginEmpleado(data){
		handleEvents.empleado(data, function(status){
			socket.emit('loginCallback', status);
		});
	}
	function insertaUsuario(data){
		handleEvents.usuario(data, function(callback){
			socket.emit('usuarioCallback', callback);
			io.sockets.emit('responseSucesosEmp', callback);
		});
	}
	function validarCedula(data){
		handleEvents.validaCedula(data, function(callback){
			socket.emit('recibe cedula', callback);
		});
	}
	function hacerConsulta(data){
		handleEvents.validaCedula(data, function(callback){
			socket.emit('consulta hecha', callback);
		});
	}
	function cambiaPass(data) {
		handleEvents.cambiaPass(data, function(callback) {
			socket.emit('cambiaPassComplete', callback);
		});
	}
	function metasEmpleado(data) {
		handleEvents.metasConsulta(data, function(callback) {
			socket.emit('metasComplete', callback);
		});
	}
	function requestEmpMetas(data){
		handleEvents.EmpMetas(data, function(callback) {
			socket.emit('responseEmpMetas', callback);
		});
	}
	function vaciaMetasEmp(data){
		handleEvents.vaciaMetasEmp(data, function(callback) {
			io.sockets.emit('updateMetaEmp', callback);
		});
	}
	function requestEmpresas(data) {
		handleEvents.requestEmpresas(data, function(callback) {
			socket.emit('responseEmpresas', callback);
		});
	}
	function creaEmpresa(data) {
		handleEvents.creaEmpresa(data, function(callback) {
			socket.emit('responseCreaEmpresa', callback);
		});
	}
	function listarDatos(data) {		
		handleEvents.listarDatos(data,function(callback) {
			socket.emit('responseListarDatos', callback);
		});
	}
	function listarUsuEmpresa(data) {
		handleEvents.listarUsuEmpresa(data, function(callback) {
			socket.emit('responseListarUsuEmpresa', callback);
		});
	}
	function eliminarEmpresa(data) {
		handleEvents.eliminarEmpresa(data, function(callback) {
			socket.emit('responseEliminarEmpresa', callback);
		});
	}
	function requestSucesosEmp(data) {
		handleEvents.requestSucesosEmp(data, function(callback) {
			socket.emit('responseSucesosEmp', callback);
		});
	}
	function listarEmpleados(data) {
		handleEvents.listarEmpleados(data, function(callback) {
			socket.emit('responselistarEmpleados', callback);
		});
	}
	function listarTablaSS(data) {
		handleEvents.listarTablas(data, function(callback) {
			socket.emit('responseListarTabla', callback);
		});
	}
	function listarCargo(data) {
		handleEvents.listarTablas(data, function(callback) {
			socket.emit('responseListarTabla', callback);
		});
	}
	function listaTablaEmpleado(data) {
		handleEvents.listarTablas(data, function(callback) {
			socket.emit('responseListarTabla', callback);
		});
	}
	function listarTablaEmpresaVin (data) {
		handleEvents.listarTablas(data, function(callback) {
			socket.emit('responseListarTabla', callback);
		});
	}
	function listarNombre (data) {
		handleEvents.listarTablas(data, function(callback) {
			socket.emit('responseListarTabla', callback);
		});
	}
	function actualizaUsuario(data) {
		handleEvents.actualizaUsuario(data, function(callback) {
			socket.emit('responseActUsu', callback);
		});
	}
});
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
