<<<<<<< HEAD
﻿var mysql = require('mysql');
var crypto = require('crypto');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'sistema'
});
connection.connect(function(err, connection) {
	if(err)
		console.log('ocurrió este error: ' + err);
	else
		console.log('Esta listo para empezar!');
});
function fDate(string, criterio) {	
	var stringNew = criterio == 'fecha'? string.split('/') : string.split(':');
	var s1 = stringNew[0];
	var s2 = stringNew[1];	

	var news1 = (s1 < 10)? ("0" + s1) : s1;
	var news2 = (s2 < 10)? ("0" + s2) : s2;	

	var stringReturn = criterio == 'fecha'? news1 + "/" + news2 + "/" + stringNew[2] : news1 + ":" + news2;	
	return stringReturn
}
function doFecha(){
	var date = new Date();
	var fecha = fDate(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),'fecha');
	var hora = fDate(date.getHours() + ':' + date.getMinutes(),'hora');
	var newFecha = fecha + ' - ' + hora;
	return newFecha
}
		exports.actualizaUsuario = function(d, c) {			
			for(var i in d.cambios) {			
				var sql = "UPDATE usuarios set "+d.cambios[i].id+" = ? WHERE cedula = ? "
				connection.query(sql, [d.cambios[i].valor, d.ced]);
			}			
		};
		exports.listarTablas = function(d, c) {
			var valor = d.valor;
			var criterio = d.criterio;
			var sql, nameTable, arrayParametros;
			var arrayUsuarios = [];
			var arrayContent = {};			
			if(criterio == 'cargo') {
				sql = 'SELECT * FROM usuarios WHERE cargo LIKE "%'+valor+'%"';
				nameTable = 'tablacontainerTableCargo';
			}
			else if(criterio == 'empleadoReg') {
				sql = 'SELECT * FROM usuarios WHERE empleadoReg = ?';
				nameTable = 'tablacontainerTableEmpleado';
			}
			else if(criterio == 'eps' || criterio == 'afp' || criterio == 'arl') {
				sql = 'SELECT * FROM usuarios WHERE '+criterio+' = ?';
				nameTable = 'tablacontainerTableSS';
			}
			else if(criterio == 'empresaVin') {
				sql = 'SELECT * FROM usuarios WHERE '+criterio+' = ?';
				nameTable = 'tablacontainerTableEmpresaVin';
			}
			else if(criterio == 'nombres') {
				sql = 'SELECT * FROM usuarios WHERE nombre LIKE "%'+valor+'%"';
				nameTable = 'tablacontainerTableNombre';
			}
			connection.query(sql,[valor], function(err, rows, fields) {
				if(err)
					console.log('error:' +err);
				else
					if(rows.length > 0) {
						for (var i in rows) {
							arrayParametros = {
								cedula: rows[i].cedula,
								nombre: rows[i].nombre,
								apellido: rows[i].apellido,
								empresaVin: rows[i].empresaVin,
								mensualidad: rows[i].mensualidad,
								cargo: rows[i].cargo
							};
							arrayContent['nameTable'] = nameTable;
							arrayContent['cantidad'] = rows.length;
							arrayUsuarios.push(arrayParametros);
						}
						arrayContent['usuarios'] = arrayUsuarios;
						c(arrayContent);
					}
					else {
						arrayContent['nameTable'] = nameTable;
						arrayContent['cantidad'] = 0;
						c(arrayContent);
					}
			});

		};
		exports.requestSucesosEmp = function(d, c) {			
			var array = {};
			connection.query("SELECT * FROM registros ORDER BY id DESC limit 20",[d.usuario], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0) {
						for(var i in rows) {
							array = {
								cedula: rows[i].cedula,
								fecha: rows[i].fecha,
								empleado: rows[i].empleado,
								caso: rows[i].caso
							};
							c(array);
						}
					}
			});
		};
		exports.eliminarEmpresa = function(d, c) {
			if(d.atributo == 'saveUsuarios') {
				connection.query("DELETE FROM empresas WHERE nombre = ?", [d.nombre] , function(err, rows, fields) {
					if(err)
						console.log('error: ' + err);
					else
						connection.query("UPDATE usuarios set empresaVin = ? WHERE empresaVin = ? ", ['', d.nombre], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);
						});
				});
			} else if(d.atributo == 'removeUsuarios') {
				connection.query("DELETE FROM empresas WHERE nombre = ?", [d.nombre] , function(err, rows, fields) {
					if(err)
						console.log('error: ' + err);
					else
						connection.query("DELETE FROM usuarios WHERE empresaVin = ?", [d.nombre], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);
						});
				});
			}
		};
		exports.listarUsuEmpresa = function(d, c) {			
			var arrayUsuarios = [], arrayContent = {};
			var arrayParametros = {};
			connection.query("SELECT * FROM usuarios WHERE empresaVin = ?", [d.nombre], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						for(var i in rows){
							arrayParametros = {
								cedula: rows[i].cedula,
								nombre: rows[i].nombre,
								apellido: rows[i].apellido,
								caja: rows[i].caja,
								eps: rows[i].eps,
								arl: rows[i].arl,
								afp: rows[i].afp,
								mensualidad: rows[i].mensualidad
							};
							arrayContent['cantidad'] = rows.length;
							arrayUsuarios.push(arrayParametros);
						}
						arrayContent['usuarios'] = arrayUsuarios;
						c(arrayContent);
					}
					else {
						arrayContent['cantidad'] = 0;
						c(arrayContent);
					}
			});
		};
		exports.listarEmpleados = function(d, c) {
			var paquete = {};
			connection.query("SELECT usuario FROM empleados WHERE jefe = ?", [d.jefe], function(err,rows,fields) {
				paquete['empleados'] = rows;
				c(paquete);
			});
		};
		exports.listarDatos = function(d, c) {			
			var paquete = {};
			connection.query("SELECT nombre FROM empresas WHERE propietario = ?",[d.usuario], function(err,rows,fields) {
				paquete['empresas'] = rows;
			});
			connection.query("SELECT nombre FROM eps", function(err,rows,fields) {
				paquete['eps'] = rows;
			});
			connection.query("SELECT nombre FROM afp", function(err,rows,fields) {
				paquete['afp'] = rows;
			});
			connection.query("SELECT nombre FROM arl", function(err,rows,fields) {
				paquete['arl'] = rows;
				c(paquete);				
			});
			
		};
		exports.creaEmpresa = function(d, c) {							
			connection.query("SELECT * FROM empresas WHERE nombre = ?", [d.nombre], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0)
						c('empresa existe');
					else{
						d.fechadeCreacion = doFecha()
						connection.query("INSERT INTO empresas SET ?", d, function(err, results) {
							if(err) {
								console.log('error:' + err);
							} else {
								c('bien');
							}
						});
					}						
			});
		};
		exports.requestEmpresas = function(d, c) {
			var arrayEmpresas = [], arrayContent = {};
			var sql = "SELECT * FROM empresas WHERE propietario = ?";
			connection.query(sql, [d.usuario], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0){												
						for(var i in rows){
							arrayEmpresas.push(rows[i]);
						}
						arrayContent['empresas'] = arrayEmpresas;
						c(arrayContent);
					} else
						c('No tiene');
			});
		};
		exports.vaciaMetasEmp = function(d, c) {			
			var empMeta = {};
			connection.query("UPDATE empleados set mReg = ?, mCons = ?, mModi = ?, mSes = ? WHERE usuario = ?", ['0','0','0','0', d.usuario], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					connection.query("SELECT usuario,mReg,mCons,mModi,mSes FROM empleados WHERE usuario = ?", [d.usuario], function(err, rows, fields) {
						if(err)
							console.log('error:' + err);
						else
							if(rows.length > 0){								
								var data
								for(var i in rows){
									data = {
										usuario: rows[i].usuario,
										metaRegistros: rows[i].mReg,
										metaConsultas: rows[i].mCons,
										metaModificaciones: rows[i].mModi,
										metaSesiones: rows[i].mSes,
										tipo: rows[i].tipo
									};
									empMeta['empleado'] = data;
									c(empMeta);
								}
							}
					});
			});
		};
		exports.EmpMetas = function(d, c) {
			var empMetas = {};
			connection.query("SELECT usuario,mReg,mCons,mModi,mSes,tipo FROM empleados WHERE tipo != ?", ['jefe'], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						//console.log(rows);
						var data;
						for(var i in rows){
							data = {
								usuario: rows[i].usuario,
								metaRegistros: rows[i].mReg,
								metaConsultas: rows[i].mCons,
								metaModificaciones: rows[i].mModi,
								metaSesiones: rows[i].mSes,
								tipo: rows[i].tipo
							};							
							empMetas['empleado'] = data;
							c(empMetas);
						}
					}
			});
		};
		exports.metasConsulta = function(d, c) {			
			connection.query("SELECT * FROM empleados WHERE usuario = ?", [d.usuario], function(err, rows, fields){
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						var data;
						for(var i in rows){
							data = {
								metaRegistros: rows[i].mReg,
								metaConsultas: rows[i].mCons,
								metaModificaciones: rows[i].mModi,
								metaSesiones: rows[i].mSes
							};
						}
						c(data);
					}
					else
						c('usuario no existe');
			});
		};
		exports.cambiaPass = function(d, c) {
			var usuario = d.usuario,
				oldpassword = d.oldpassword,
				newpass = d.newpass,
				ctaDB,
				ctaCrypted = crypto.createHmac('sha1', usuario).update(oldpassword).digest('hex'),
				ctaNewCrypted = crypto.createHmac('sha1', usuario).update(newpass).digest('hex');
			
			connection.query("SELECT * FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields){
					if(err)
						console.log('error: ' + err);
					else
						if(rows.length > 0){
							for (var i in rows) {
								ctaDB = rows[i].contrasena;
							}
							if(ctaCrypted == ctaDB){
								connection.query("UPDATE empleados set contrasena = ? WHERE usuario = ?", [ctaNewCrypted, usuario], function(err, rows, fields) {
									if(err)
										console.log('error: ' + err);
									else
										c('contraseña actualizada');
								});
							}
							else
								c('contraseña invalida');
						}
						else
							c('no existe');
				});
		};
		exports.validaCedula = function(d, c){
			var consultaUsu = d.consultaUsu;
			var empleadoConsulta = d.empleado;
			var datosCompleto = {};
			var cedulaInput = d.cedula;
			var estado1 = d.estado;
			var nohay2 = {}, nohay = {};
			var estado = estado1 == 1 ? 'Eliminado' : 'Activo';
			connection.query("SELECT * FROM usuarios WHERE cedula = ? && estado = ?", [cedulaInput, estado], function(err, rows, fields){
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0){
						connection.query("UPDATE empleados set mCons = mCons+1 WHERE usuario = ?", [empleadoConsulta], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);							
						});


						if(typeof consultaUsu != 'undefined'){
							connection.query("SELECT * FROM imagenes WHERE cedula = ?", [cedulaInput], function(err, rows, fields){
								if(err)
									console.log('error: ' + err);
								else
									if(rows.length > 0){ 
										datosCompleto['imagenes'] = rows;										
									}										
									else {
										nohay2 = {imagen: 'no hay'};
										datosCompleto['imagenes'] = nohay2;
									}									
							});
							connection.query("SELECT * FROM registros WHERE cedula = ?", [cedulaInput], function(err, rows, fields){
								if(err)
									console.log('error: ' + err);
								else
									if(rows.length > 0) {
										datosCompleto['registros'] = rows;										
									}
									else {
										nohay = {registro: 'no hay'};
										datosCompleto['registros'] =  nohay;
									}
								c(datosCompleto);
							});
							var data;
							for(var i in rows){
								data = {
									nombre: rows[i].nombre,
									cedula: rows[i].cedula,
									telefono: rows[i].telefono,
									direccion: rows[i].direccion,
									correo: rows[i].correo,
									estado: rows[i].estado,
									empleado: rows[i].empleado,
									eps: rows[i].eps,
									arl: rows[i].arl,
									afp: rows[i].afp,
									apellido: rows[i].apellido,
									detalles: rows[i].detalles,
									fecha: rows[i].fechaRegistro,
									caja: rows[i].caja,
									empresaVin: rows[i].empresaVin,
									fechaIngreso: rows[i].fechaIngreso,
									cargo: rows[i].cargo,
									salario: rows[i].salario,
									mensualidad: rows[i].mensualidad,
									userPlanilla: rows[i].usuario,
									passPlanilla:rows[i].pass
								};
							}
							datosCompleto['data'] = data;
							
						}
						else if(typeof consultaUsu == 'undefined'){
							c('existe');
						}
					}
					else
						c('noExiste');
			});
			
		};
		exports.usuario = function(d, c){		
		d.fechaRegistro = doFecha()		
			connection.query("INSERT INTO usuarios SET ?", d, function(err, results){
				if(err)
					console.log('error en registro usuario: ' + err);
				else{
					connection.query("UPDATE empleados set mReg = mReg+1 WHERE usuario = ?", [d.empleadoReg], function(err, rows, fields) {
						if(err)
							console.log('error: ' + err);						
					});
					connection.query("INSERT INTO registros (cedula, caso, fecha, empleado) values(?,?,?,?)", [d.cedula, 'registro', doFecha(), d.empleadoReg], function(err, results){
						if(err)
							console.log(err);
						else
							c('bien');					
					});
				}
			});
		};
		exports.empleado = function(d, c){
			var usuario = d.usuario;
			var ctaCrypted = crypto.createHmac('sha1', usuario).update(d.cta).digest('hex');
			var ctaDB;
			if(d.registra || d.consulta){
				connection.query("SELECT * FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields){
					if(err)
						console.log('error: ' + err);
					else{
						if(rows.length > 0){
							if(d.consulta){
								for (var i in rows) {
									ctaDB = rows[i].contrasena;
								}
								if(ctaCrypted == ctaDB){
									var data1,usuario,nombre,tipo;
									for(var a in rows){
										data = {
											usuario: rows[a].usuario,
											nombre: rows[a].nombre,
											tipo: rows[a].tipo,
											cedula: rows[a].cedula,
											metaSesiones: rows[a].mSes,
											jefe: rows[a].jefe
										};
										c(data);
									}
									// metas Sesiones...                                                    
									connection.query("UPDATE empleados set mSes = mSes+1 WHERE usuario = ?", [d.usuario], function(err, rows, fields) {
										if(err)
											console.log('error: ' + err);										
									});
								}
								else
									c('contraseña invalida');
							}
							else
								c('existe');
						}
						else{
							if(d.consulta)
								c('no existe');
							else if(d.registra)
							{
								connection.query("INSERT INTO empleados (usuario, contrasena, nombre, tipo, cedula, jefe) values (?,?,?,?,?,?)", [d.usuario, ctaCrypted, d.nombre, d.tipo, d.cedula, 'juan'], function(err, results) {
									if(err)
										console.log('error: ' + err);
									else
										c(rows);
								});
							}
						}
					}
				});
			}
		};
		exports.newUser = function(d, c) {			
			var ced = d.ced
			connection.query("SELECT * FROM users WHERE cedula = ?", [ced], function(err, rows, fields){
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0){
						c('userExiste')
					}
					else {
						connection.query("INSERT INTO users(cedula, nombre, apellido, usuario, clave, correo) values (?,?,?,?,?,?)",
							[ced, d.name, d.lastN, d.user, d.pass, d.mail], function(err, results){
							if(err)
								console.log('error: ' + err);
							else
								c('userRegistrado')
							
						});
					}

			});
		};
		exports.borrarUser = function(d, c) {
			var ced = d.ced
			connection.query("DELETE FROM users WHERE cedula = ?", [ced], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					c('userEliminado')
			});
		}
		exports.formTodo = function(d, c) {
			var arrayParametros, arrayUsuarios = [], arrayContent = {};	
			connection.query("SELECT * FROM usuarios",[], function(err, rows, fields) {
				if(err)
					console.log('error:' +err);
				else
					if(rows.length > 0) {
						for (var i in rows) {
							arrayParametros = {
								ced: rows[i].cedula,
								name: rows[i].nombre,
								lastN: rows[i].apellido,
								user: rows[i].usuario,
								pass: rows[i].pass,
								telefono: rows[i].telefono,
								direccion: rows[i].direccion,
								mail: rows[i].correo,
								empresaVin: rows[i].empresaVin
							};
							arrayContent['nameTable'] = 'tableTodoUsers';
							arrayContent['cantidad'] = rows.length;
							arrayUsuarios.push(arrayParametros);
						}
						arrayContent['usuarios'] = arrayUsuarios;
						c(arrayContent);
					}
					else {
						arrayContent['nameTable'] = 'tableTodoUsers';
						arrayContent['cantidad'] = 0;
						c(arrayContent);
					}
			});
		}
		exports.userEdit = function(d, c) {			
			connection.query("UPDATE users set cedula = ?, nombre = ?, apellido = ?, usuario = ?, clave = ?, correo = ? WHERE cedula = ?",
				[d.ced,d.name,d.lastN,d.user,d.pass,d.mail,d.ced], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					c('edited')
			});
		}
		exports.usuMas = function(d,c) {
			connection.query("UPDATE empresas set numeroEmps = numeroEmps+1 WHERE nombre = ?", d, function(err, rows, fields) {});
		}
		exports.newUserEmp = function(d, c) {
			d.fechaRegistro = doFecha()			
			connection.query("SELECT * FROM usuarios WHERE cedula = ?", [d.cedula], function(err, rows, fields){
				if(err)
					console.log('error: ' + err);
				else
				{
					if(rows.length > 0){c({msj:'userExiste'})}
					else {		
						connection.query("SELECT * FROM empresas WHERE nombre = ?", [d.empresaVin], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);
							else{d.arl = rows.arl}
								
						});		
						connection.query("INSERT INTO usuarios SET ?", d,function(err, results){
							if(err)
								console.log('error: ' + err)
							else{
								c({msj: 'userRegistrado',emp: d.empresaVin})
								connection.query("INSERT INTO registros (cedula, caso, fecha, empleado) values(?,?,?,?)", [d.cedula, 'registro', doFecha(), d.empleado], function(err, results){
									if(err)
										console.log(err);													
								});
							}
													
						});

					}
				}

			});
		}
		exports.guardarInfoEmpresa = function(d, c) {
			var con = connection.query("UPDATE empresas SET ? WHERE nombre = ?", [d.datos,d.empresa.name], function(err, resul){
				if(err)
					console.log('error 630: ' + err)	
				else{				
					connection.query("INSERT INTO registros (cedula, caso, fecha, empleado) values(?,?,?,?)", [d.empresa.name, 'actualización', doFecha(), d.empleado.name], function(err, results){
						if(err)
							console.log(err);
						else
							c('bien')					
					});
				}
			})	

		}
=======
var mysql = require('mysql');
var crypto = require('crypto');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema'
});
connection.connect(function(err, connection) {
	if(err)
		console.log('ocurrió este error: ' + err);
	else
		console.log('Esta listo para empezar!');
});
function formateaDate(string, criterio) {	
	var stringNew = criterio == 'fecha'? string.split('/') : string.split(':');
	var s1 = stringNew[0];
	var s2 = stringNew[1];	

	var news1 = (s1 < 10)? ("0" + s1) : s1;
	var news2 = (s2 < 10)? ("0" + s2) : s2;	

	var stringReturn = criterio == 'fecha'? news1 + "/" + news2 + "/" + stringNew[2] : news1 + ":" + news2;	
	return stringReturn
}
		exports.actualizaUsuario = function(data, callback) {			
			for(var i in data.cambios) {			
				var sql = "UPDATE usuarios set "+data.cambios[i].id+" = ? WHERE cedula = ? "
				connection.query(sql, [data.cambios[i].valor, data.ced]);
			}
		};
		exports.listarTablas = function(data, callback) {
			var valor = data.valor;
			var criterio = data.criterio;
			var sql, nameTable, arrayParametros;
			var arrayUsuarios = [];
			var arrayContent = {};			
			if(criterio == 'cargo') {
				sql = 'SELECT * FROM usuarios WHERE cargo LIKE "%'+valor+'%"';
				nameTable = 'tablacontainerTableCargo';
			}
			else if(criterio == 'empleadoReg') {
				sql = 'SELECT * FROM usuarios WHERE empleadoReg = ?';
				nameTable = 'tablacontainerTableEmpleado';
			}
			else if(criterio == 'eps' || criterio == 'afp' || criterio == 'arl') {
				sql = 'SELECT * FROM usuarios WHERE '+criterio+' = ?';
				nameTable = 'tablacontainerTableSS';
			}
			else if(criterio == 'empresaVin') {
				sql = 'SELECT * FROM usuarios WHERE '+criterio+' = ?';
				nameTable = 'tablacontainerTableEmpresaVin';
			}
			else if(criterio == 'nombres') {
				sql = 'SELECT * FROM usuarios WHERE nombre LIKE "%'+valor+'%"';
				nameTable = 'tablacontainerTableNombre';
			}
			connection.query(sql,[valor], function(err, rows, fields) {
				if(err)
					console.log('error:' +err);
				else
					if(rows.length > 0) {
						for (var i in rows) {
							arrayParametros = {
								cedula: rows[i].cedula,
								nombre: rows[i].nombre,
								apellido: rows[i].apellido,
								empresaVin: rows[i].empresaVin,
								mensualidad: rows[i].mensualidad,
								cargo: rows[i].cargo
							};
							arrayContent['nameTable'] = nameTable;
							arrayContent['cantidad'] = rows.length;
							arrayUsuarios.push(arrayParametros);
						}
						arrayContent['usuarios'] = arrayUsuarios;
						callback(arrayContent);
					}
					else {
						arrayContent['nameTable'] = nameTable;
						arrayContent['cantidad'] = 0;
						callback(arrayContent);
					}
			});

		};
		exports.requestSucesosEmp = function(data, callback) {
			var empleado = data.usuario;
			var array = {};
			connection.query("SELECT * FROM registros ORDER BY id DESC limit 20",[empleado], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0) {
						for(var i in rows) {
							array = {
								cedula: rows[i].cedula,
								fecha: rows[i].fecha,
								empleado: rows[i].empleado,
								caso: rows[i].caso
							};
							callback(array);
						}

					}
			});
		};
		exports.eliminarEmpresa = function(data, callback) {
			var nombreEmpresa = data.nombre;
			var atributo = data.atributo;

			if(atributo == 'saveUsuarios') {
				connection.query("DELETE FROM empresas WHERE nombre = ?", [nombreEmpresa] , function(err, rows, fields) {
					if(err)
						console.log('error: ' + err);
					else
						connection.query("UPDATE usuarios set empresaVin = ? WHERE empresaVin = ? ", ['', nombreEmpresa], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);
						});
				});
			} else if(atributo == 'removeUsuarios') {
				connection.query("DELETE FROM empresas WHERE nombre = ?", [nombreEmpresa] , function(err, rows, fields) {
					if(err)
						console.log('error: ' + err);
					else
						connection.query("DELETE FROM usuarios WHERE empresaVin = ?", [nombreEmpresa], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);
						});
				});
			}
		};
		exports.listarUsuEmpresa = function(data, callback) {
			var nombre = data.nombre;
			var arrayUsuarios = [], arrayContent = {};
			var arrayParametros = {};
			connection.query("SELECT * FROM usuarios WHERE empresaVin = ?", [nombre], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						for(var i in rows){
							arrayParametros = {
								cedula: rows[i].cedula,
								nombre: rows[i].nombre,
								apellido: rows[i].apellido,
								salud: rows[i].salud,
								riesgo: rows[i].riesgo,
								caja: rows[i].caja,
								pension: rows[i].pension,
								eps: rows[i].eps,
								arl: rows[i].arl,
								afp: rows[i].afp
							};
							arrayContent['cantidad'] = rows.length;
							arrayUsuarios.push(arrayParametros);
						}
						arrayContent['usuarios'] = arrayUsuarios;
						callback(arrayContent);
					}
					else {
						arrayContent['cantidad'] = 0;
						callback(arrayContent);
					}
			});
		};
		exports.listarEmpleados = function(data, callback) {
			var jefe = data.jefe;
			var paquete = {};
			connection.query("SELECT usuario FROM empleados WHERE jefe = ?", [jefe], function(err,rows,fields) {
				paquete['empleados'] = rows;
				callback(paquete);
			});
		};
		exports.listarDatos = function(data, callback) {
			var propietario = data.usuario;			
			var paquete = {};
			connection.query("SELECT nombre FROM empresas WHERE propietario = ?",[propietario], function(err,rows,fields) {
				paquete['empresas'] = rows;
			});
			connection.query("SELECT nombre FROM eps", function(err,rows,fields) {
				paquete['eps'] = rows;
			});
			connection.query("SELECT nombre FROM afp", function(err,rows,fields) {
				paquete['afp'] = rows;
			});
			connection.query("SELECT nombre FROM arl", function(err,rows,fields) {
				paquete['arl'] = rows;
				callback(paquete);				
			});
			
		};
		exports.creaEmpresa = function(data, callback) {
			var propietario = data.propietario;
			var nombre = data.nombre;
			var representante = data.representante;
			var date = new Date();
			var fecha = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();

			connection.query("SELECT * FROM empresas WHERE nombre = ?", [nombre], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0)
						callback('empresa existe');
					else
						connection.query("INSERT INTO empresas (nombre, propietario, representante, fechadeCreacion) values (?,?,?,?)", [nombre, propietario, representante,formateaDate(fecha, 'fecha')], function(err, results) {
							if(err) {
								console.log('error:' + err);
							} else {
								callback('bien');
							}
						});
			});
		};
		exports.requestEmpresas = function(data, callback) {
			var usuario = data.usuario, data, arrayEmpresas = [], arrayContent = {};
			var sql = "SELECT nombre,numeroEmps,propietario,representante,fechadeCreacion FROM empresas WHERE propietario = ?";
			connection.query(sql, [usuario], function(err, rows, fields) {
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0){												
						for(var i in rows){
							data = {
								nombre: rows[i].nombre,
								numeroEmps: rows[i].numeroEmps,
								propietario: rows[i].propietario,
								representante: rows[i].representante,
								fecha: rows[i].fechadeCreacion
							};
							arrayEmpresas.push(data);
						}
						arrayContent['empresas'] = arrayEmpresas;
						callback(arrayContent);
					} else
						callback('No tiene');
			});
		};
		exports.vaciaMetasEmp = function(data, callback) {
			var usuario = data.usuario;
			var empMeta = {};
			connection.query("UPDATE empleados set mReg = ?, mCons = ?, mModi = ?, mSes = ? WHERE usuario = ?", ['0','0','0','0', usuario], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					connection.query("SELECT usuario,mReg,mCons,mModi,mSes FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields) {
						if(err)
							console.log('error:' + err);
						else
							if(rows.length > 0){
								//console.log(rows);
								var data;
								for(var i in rows){
									data = {
										usuario: rows[i].usuario,
										metaRegistros: rows[i].mReg,
										metaConsultas: rows[i].mCons,
										metaModificaciones: rows[i].mModi,
										metaSesiones: rows[i].mSes,
										tipo: rows[i].tipo
									};
									empMeta['empleado'] = data;
									callback(empMeta);
								}
							}
					});
			});
		};
		exports.EmpMetas = function(data, callback) {
			var empMetas = {};
			connection.query("SELECT usuario,mReg,mCons,mModi,mSes,tipo FROM empleados WHERE tipo != ?", ['jefe'], function(err, rows, fields) {
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						//console.log(rows);
						var data;
						for(var i in rows){
							data = {
								usuario: rows[i].usuario,
								metaRegistros: rows[i].mReg,
								metaConsultas: rows[i].mCons,
								metaModificaciones: rows[i].mModi,
								metaSesiones: rows[i].mSes,
								tipo: rows[i].tipo
							};							
							empMetas['empleado'] = data;
							callback(empMetas);
						}
					}
			});
		};
		exports.metasConsulta = function(data, callback) {
			var usuario = data.usuario;
			connection.query("SELECT * FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields){
				if(err)
					console.log('error:' + err);
				else
					if(rows.length > 0){
						var data;
						for(var i in rows){
							data = {
								metaRegistros: rows[i].mReg,
								metaConsultas: rows[i].mCons,
								metaModificaciones: rows[i].mModi,
								metaSesiones: rows[i].mSes
							};
						}
						callback(data);

					}
					else
						callback('usuario no existe');
			});
		};
		exports.cambiaPass = function(data, callback) {
			var usuario = data.usuario,
				oldpassword = data.oldpassword,
				newpass = data.newpass,
				ctaDB,
				ctaCrypted = crypto.createHmac('sha1', usuario).update(oldpassword).digest('hex'),
				ctaNewCrypted = crypto.createHmac('sha1', usuario).update(newpass).digest('hex');
			
			connection.query("SELECT * FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields){
					if(err)
						console.log('error: ' + err);
					else
						if(rows.length > 0){
							for (var i in rows) {
								ctaDB = rows[i].contrasena;
							}
							if(ctaCrypted == ctaDB){
								connection.query("UPDATE empleados set contrasena = ? WHERE usuario = ?", [ctaNewCrypted, usuario], function(err, rows, fields) {
									if(err)
										console.log('error: ' + err);
									else
										callback('contraseña actualizada');
								});
							}
							else
								callback('contraseña invalida');
						}
						else
							callback('no existe');
				});
		};
		exports.validaCedula = function(data, callback){
			var consultaUsu = data.consultaUsu;
			var empleadoConsulta = data.empleado;
			var datosCompleto = {};
			var cedulaInput = data.cedula;
			var estado1 = data.estado;
			var nohay2 = {}, nohay = {};
			var estado = estado1 == 1 ? 'Eliminado' : 'Activo';
			connection.query("SELECT * FROM usuarios WHERE cedula = ? && estado = ?", [cedulaInput, estado, data], function(err, rows, fields){
				if(err)
					console.log('error: ' + err);
				else
					if(rows.length > 0){
						connection.query("UPDATE empleados set mCons = mCons+1 WHERE usuario = ?", [empleadoConsulta], function(err, rows, fields) {
							if(err)
								console.log('error: ' + err);							
						});


						if(typeof consultaUsu != 'undefined'){
							connection.query("SELECT * FROM imagenes WHERE cedula = ?", [cedulaInput], function(err, rows, fields){
								if(err)
									console.log('error: ' + err);
								else
									if(rows.length > 0){ 
										datosCompleto['imagenes'] = rows;										
									}										
									else {
										nohay2 = {imagen: 'no hay'};
										datosCompleto['imagenes'] = nohay2;
									}									
							});
							connection.query("SELECT * FROM registros WHERE cedula = ?", [cedulaInput], function(err, rows, fields){
								if(err)
									console.log('error: ' + err);
								else
									if(rows.length > 0) {
										datosCompleto['registros'] = rows;										
									}
									else {
										nohay = {registro: 'no hay'};
										datosCompleto['registros'] =  nohay;
									}
								callback(datosCompleto);
							});
							var data;
							for(var i in rows){
								data = {
									nombre: rows[i].nombre,
									cedula: rows[i].cedula,
									telefono: rows[i].telefono,
									direccion: rows[i].direccion,
									correo: rows[i].correo,
									estado: rows[i].estado,
									empleado: rows[i].empleado,
									eps: rows[i].eps,
									arl: rows[i].arl,
									afp: rows[i].afp,
									apellido: rows[i].apellido,
									detalles: rows[i].detalles,
									fecha: rows[i].fechaRegistro,
									caja: rows[i].caja,
									empresaVin: rows[i].empresaVin,
									fechaIngreso: rows[i].fechaIngreso,
									cargo: rows[i].cargo,
									salario: rows[i].salario,
									mensualidad: rows[i].mensualidad
								};
							}
							datosCompleto['data'] = data;
							
						}
						else if(typeof consultaUsu == 'undefined'){
							callback('existe');
						}
					}
					else
						callback('noExiste');
			});
			
		};
		exports.usuario = function(data, callback){
			var suceso = {};
			var date = new Date();
			var fecha = formateaDate(date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear(),'fecha');
			var hora = formateaDate(date.getHours() + ':' + date.getMinutes(),'hora');
			var newFecha = fecha + ' - ' + hora;

			connection.query("INSERT INTO registros (cedula, caso, fecha, empleado) values(?,?,?,?)", [data.cedula, 'registro', newFecha, data.empleado], function(err, results){
				if(err)
					console.log(err);
				else
					suceso = {
						cedula: data.cedula,
						caso: 'registro',
						fecha: fecha,
						empleado: data.empleado,
						realTime: 'true'
					};
					callback(suceso);					
			});
			connection.query("INSERT INTO usuarios(cedula, nombre, apellido, telefono, direccion, correo, fechaRegistro, caja, salud, riesgo, pension, detalles, estado, fechaIngreso, empresa, salario, eps, arl, afp, empleadoReg, cargo, empresaVin) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
				[data.cedula, data.nombre, data.apellido, data.telefono, data.direccion, data.correo, newFecha, data.caja, data.salud, data.riesgo, data.pension, data.detalles, 'Activo', data.fecha_ingreso, data.empresa, data.salario, data.eps, data.arl, data.afp, data.empleado, data.cargo, data.empresaVin], function(err, results){
				if(err)
					console.log('error: ' + err);
				else
					
					connection.query("UPDATE empleados set mReg = mReg+1 WHERE usuario = ?", [data.empleado], function(err, rows, fields) {
						if(err)
							console.log('error: ' + err);						
					});
					connection.query("UPDATE empresas set numeroEmps = numeroEmps+1 WHERE nombre = ?", [data.empresaVin], function(err, rows, fields) {});
			});
		};
		exports.empleado = function(data, callback){
			var usuario = data.usuario;
			var ctaCrypted = crypto.createHmac('sha1', usuario).update(data.cta).digest('hex');
			var ctaDB;
			if(data.registra || data.consulta){
				connection.query("SELECT * FROM empleados WHERE usuario = ?", [usuario], function(err, rows, fields){
					if(err)
						console.log('error: ' + err);
					else{
						if(rows.length > 0){
							if(data.consulta){
								for (var i in rows) {
									ctaDB = rows[i].contrasena;
								}
								if(ctaCrypted == ctaDB){
									var data1,usuario,nombre,tipo;
									for(var a in rows){
										data = {
											usuario: rows[a].usuario,
											nombre: rows[a].nombre,
											tipo: rows[a].tipo,
											cedula: rows[a].cedula,
											metaSesiones: rows[a].mSes,
											jefe: rows[a].jefe
										};
										callback(data);
									}
									// metas Sesiones...                                                    
									connection.query("UPDATE empleados set mSes = mSes+1 WHERE usuario = ?", [data.usuario], function(err, rows, fields) {
										if(err)
											console.log('error: ' + err);										
									});
								}
								else
									callback('contraseña invalida');
							}
							else
								callback('existe');
						}
						else{
							if(data.consulta)
								callback('no existe');
							else if(data.registra)
							{
								connection.query("INSERT INTO empleados (usuario, contrasena, nombre, tipo, cedula, jefe) values (?,?,?,?,?,?)", [data.usuario, ctaCrypted, data.nombre, data.tipo, data.cedula, 'juan'], function(err, results) {
									if(err)
										console.log('error: ' + err);
									else
										callback(rows);
								});
							}
						}
					}
				});
			}
		};
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
