<<<<<<< HEAD
var socket = io.connect('/');
var totalMensualidad = [];
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
var ew = 0;
$(document).on('ready', function() {
	procesoUsuario();	
	cargaDatos(usuario)
});

function procesoUsuario() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}		
			
		socket.emit('requestEmpresas', {usuario: usuario.jefe});		

		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
		$('#logout').on('click', function(){localStorage.removeItem('usuario');window.location = "../";});
	}
	else
		window.location = "../";
}

function cargaDatos(usuario) {	
	socket.emit('listarDatos', {usuario: usuario.jefe});
}

function muestraSucesos() {
	$('#lobbyJefe').hide();
	var row = $('<div class="row-fluid" id="containerParenSucesos">');
	row.append('<h1>Últimás 20 acciones en el sistema</h1>');
	var containerSucesos = $('<div class="col-sm-6 col-sm-offset-3"></div>');

	var columContainSu = $('<div class="col-sm-12"></div>');
	var wrapSucesosEmp = $('<div class="wrapSucesos" id="wrapSucesos"></div>');
	columContainSu.append(wrapSucesosEmp);
	containerSucesos.append(columContainSu);
	row.append(containerSucesos);
	var dataSucesos = {
		usuario: usuario.usuario
	};
	//Petición de suscesos
	socket.emit('requestSucesosEmp', dataSucesos);

	$('#sectionContainer').append(row);
}

function recargaEmpresas(button) {
	$('#containerUsuEmp').remove();
	$('#containerCrearEmp').remove();
	$('#lobbyJefe').show();
	$('#rowEmpresas').html('');
	var data = {
		usuario: usuario.jefe
	};
	ew = 0;
	socket.emit('requestEmpresas', data);
}

function listarUsuEmpresa(callback) {	
	$('#lobbyJefe').hide();
	var row = $('<div id="containerUsuEmp" class="row text-center"></div>');

	var containerActions = $('<div class="col-sm-3"></div>');

	//Panel Información
	var panelInformacion = $('<div class="panel panel-inverse" id="panelInfo"></div>');
	panelInformacion.append('<div class="panel-heading text-left">Información</div>');

	var panel_bodyInfo = $('<div class="panel-body contenInfoEmp"></div>');
	panel_bodyInfo.append('<div><h3><strong>'+callback.nombre+'</strong></h3></div>');
	panel_bodyInfo.append('<div id="representanteTable"><h4>'+callback.representante+'</h4></div>');
	panel_bodyInfo.append('<div>NIT: <input type="text" value="'+callback.nit+'" id="infoNit" class="infoEmpBloq" readonly></div>');
	panel_bodyInfo.append('<div>Dir: <input type="text" value="'+callback.direccion+'" id="infoDir" class="infoEmpBloq" readonly></div>');
	panel_bodyInfo.append('<div>E-mail: <input type="text" value="'+callback.correo+'" id="infoMail" class="infoEmpBloq" readonly></div>');	
	panel_bodyInfo.append('<div><h5>F.Creación: '+callback.fecha+'</h5></div>');
	panel_bodyInfo.append('<div>'+callback.numeroEmps+' Trabajadores</div>');
	panel_bodyInfo.append('<div>ARL: <input type="text" value="'+callback.arl+'" id="infoArl" class="infoEmpBloq" readonly></div>');
	panel_bodyInfo.append('<div>CAJA: <input type="text" value="'+callback.caja+'" id="infoCaja" class="infoEmpBloq" readonly></div>');
	panel_bodyInfo.append('<div>Tel: <input type="text" value="'+callback.telefono+'" id="infoTel" class="infoEmpBloq" readonly></div>');		
	
	$('<button id="editarInfoEmp" class="buttonEditarInfoEmp">Editar</button>').click(function(e){		
		editarInfoEmpresa(e, callback.nombre)
	}).appendTo(panel_bodyInfo)	



	panelInformacion.append(panel_bodyInfo);

	//Agregando el panel Información al containertActions
	containerActions.append(panelInformacion);

	//Panel detalles
	var panelDetailsUsu = $('<div class="panel panel-inverse" id="panelDetalles"></div>');
	panelDetailsUsu.append('<div class="panel-heading text-left">Detalles</div>');
	var panel_bodyDetails = $('<div class="panel-body"></div>');
	panel_bodyDetails.append('');
	panelDetailsUsu.append(panel_bodyDetails);

	//Agregando el paneL Detalles al containerActions
	containerActions.append(panelDetailsUsu);

	row.append(containerActions);

	var containerTableUsu = $('<div class="col-sm-7"></div>');

	//Panel table
	var panelTableUsuarios = $('<div class="panel  panel-inverse"></div>');
	panelTableUsuarios.append('<div class="panel-heading text-left" id="panel-headingUsu">Cargando...</div>');
	var panel_bodyTableUsuarios = $('<div class="panel-body"></div>');
	
	var table = $('<table id="tableUsuEmpresa" class="table-bordered table-hover tableListUsers tableClassUsuLobby">');
	table.hide();
	var thead = $('<thead style="color:rgb(66, 139, 202)"></thead>');
	var tbody = $('<tbody class="text-center"></tbody>');
	var tr = $('<tr></tr>');
	tr.append('<th class="text-center">Cédula</th>');
	tr.append('<th class="text-center">Nombre</th>');
	tr.append('<th class="text-center">Apellido</th>');
	tr.append('<th class="text-center">EPS</th>');
	tr.append('<th class="text-center">ARL</th>');
	tr.append('<th class="text-center">AFP</th>');
	tr.append('<th class="text-center">CAJ</th>');

	var data = { nombre: callback.nombre };
	socket.emit('listarUsuEmpresa', data);

	thead.append(tr);
	table.append(thead);
	table.append(tbody);
	panel_bodyTableUsuarios.append(table);
	panelTableUsuarios.append(panel_bodyTableUsuarios);

	//Agregando el panel Table al containerTableUsu
	containerTableUsu.append(panelTableUsuarios);

	row.append(containerTableUsu);

	var containerStatDetails = $('<div class="col-sm-2"></div>');

	//Panel Acciones
	var panelActions = $('<div class="panel panel-inverse" id="panelAction">');
	panelActions.append('<div class="panel-heading">Acciones</div>');
	var panel_bodyAction = $('<div class="panel-body"></div>');
	var ulButtons = $('<ul class="list-group"></ul>');

	var liButtonBack = $('<li class="list-group-item"></li>');
	var liButtonNew = $('<li class="list-group-item"></li>');
	//var liButtonRemove = $('<li class="list-group-item"></li>');
	//var liButtonSizeTable = $('<li class="list-group-item"></li>');
	var liUserAndPass = $('<li class="list-group-item"></li>')

	$('<button class="btn btn-primary btn-block"><i class="glyphicon glyphicon-chevron-left"></i> Regresar</button>').click(function() {
		recargaEmpresas(this);
	}).appendTo(liButtonBack);
	$('<button class="btn btn-success btn-block" data-toggle="modal" data-target="#newUser"><i class="glyphicon glyphicon-plus"></i> Crear Usuario</button>').click(function() {
		crearUsuarioEmp({nameEmp: callback.nombre, caja: callback.caja, arl: callback.arl});
	}).appendTo(liButtonNew);


	var UserAndPasstoggle1 = $('<ul class="UserAndPasstoggle" data-press="false"></ul>')
	var h4T = $('<h4>Pagos Aportes</h4>')
	UserAndPasstoggle1.append(h4T)
	UserAndPasstoggle1.append('<li><i>Usuario Nómina:</i> <input type="text" id="infoUserNom" value="'+callback.userNom+'" class="infoEmpBloq" readonly></li>');
	UserAndPasstoggle1.append('<li><i>Clave Nómina:</i> <input type="text" id="infoPassNom" value="'+callback.passNom+'" class="infoEmpBloq" readonly></li>');
	UserAndPasstoggle1.append('<li><i>Usuario Tesorería:</i> <input type="text" id="infoUserTeso" value="'+callback.userTeso+'" class="infoEmpBloq" readonly></li>');
	UserAndPasstoggle1.append('<li><i>Clave Tesorería:</i> <input type="text" id="infoPassTeso" value="'+callback.passTeso+'" class="infoEmpBloq" readonly></li>');
	h4T.click(function(e){
		
		var press = $(this).parent().attr('data-press')		
		if(press=="false"){
			$(this).parent().find('li').show()
			$(this).parent().attr('data-press','true')			
		}
		else {
			$(this).parent().find('li').hide()
			$(this).parent().attr('data-press','false')			
		}
	})
	
	liUserAndPass.append(UserAndPasstoggle1)

	var UserAndPasstoggle2 = $('<ul class="UserAndPasstoggle" data-press="false"></ul>')
	var h4ee = $('<h4>Eps</h4>')
	UserAndPasstoggle2.append(h4ee)
	UserAndPasstoggle2.append('<li><i>Usuario:</i> <input type="text" id="infoUserEps" value="'+callback.userEps+'" class="infoEmpBloq" readonly></li>');
	UserAndPasstoggle2.append('<li><i>Clave:</i> <input type="text" id="infoPassEps" value="'+callback.passEps+'" class="infoEmpBloq" readonly></li>');
	h4ee.click(function(e){
		var press = $(this).parent().attr('data-press')		
		if(press=="false"){
			$(this).parent().find('li').show()
			$(this).parent().attr('data-press','true')			
		}
		else {
			$(this).parent().find('li').hide()
			$(this).parent().attr('data-press','false')			
		}
	})
	
	liUserAndPass.append(UserAndPasstoggle2)

	var UserAndPasstoggle3 = $('<ul class="UserAndPasstoggle" data-press="false"></ul>')
	var h4a = $('<h4>Arl</h4>')
	UserAndPasstoggle3.append(h4a)
	UserAndPasstoggle3.append('<li><i>Usuario:</i> <input type="text" id="infoUserArl" value="'+callback.userArl+'" class="infoEmpBloq" readonly></li>');
	UserAndPasstoggle3.append('<li><i>Clave:</i> <input type="text" id="infoPassArl" value="'+callback.passArl+'" class="infoEmpBloq" readonly></li>');
	h4a.click(function(e){
		var press = $(this).parent().attr('data-press')		
		if(press=="false"){
			$(this).parent().find('li').show()
			$(this).parent().attr('data-press','true')			
		}
		else {
			$(this).parent().find('li').hide()
			$(this).parent().attr('data-press','false')			
		}
	})
	
	liUserAndPass.append(UserAndPasstoggle3)

	liUserAndPass.prepend('<span>Usuarios y Claves<span>')
	
	ulButtons.append(liButtonBack)
	ulButtons.append(liButtonNew)
	ulButtons.append(liUserAndPass)

	panelActions.append(ulButtons)
	panelActions.append(panel_bodyAction)

	//Panel Estadísticas
	var panelStatistic = $('<div class="panel panel-inverse"></div>')
	panelStatistic.append('<div class="panel-heading text-left">Estadísticas</div>');
	var panel_bodyStatistic = $('<div class="panel-body"></div>');
	panel_bodyStatistic.append('<div><h5>Total Pagos <span id="ganTotal"></span></h5></div>');
	panel_bodyStatistic.append('<div><h5>Ganancia individual $100.000</h5></div>');
	panel_bodyStatistic.append('<div class="h4">Ganancia total $204.000</div>');
	panelStatistic.append(panel_bodyStatistic);

	containerStatDetails.append(panelActions);
	containerStatDetails.append(panelStatistic);

	row.append(containerStatDetails);
	$('#sectionContainer').prepend(row);
}

function newEmpresa(e) {
	$('#lobbyJefe').hide()
	var containerCrearEmp = $('<div id="containerCrearEmp" class="row"></div>')

	var containerDiv = $('<div class="col-sm-8 col-sm-offset-2 crearEmpresa"></div>')
	var form = $('<form id="formCreaEmpresa"><h2>Crear Empresa</h2></form>')

	var fieldsetDatosGe = $('<fieldset class="row"></fieldset>')

    var form_group1 = $('<div class="col-sm-4 form-group"></div>')
    form_group1.append('<label for="nombre">Nombre</label>')
	form_group1.append('<input type="text" id="nombre" class="form-control input-sm" placeholder="Nombre">');
	fieldsetDatosGe.append(form_group1)

	var form_group2 = $('<div class="col-sm-4 form-group"></div>')
    form_group2.append('<label for="representante">Representante</label>')
	form_group2.append('<input type="text" id="representante" class="form-control input-sm" placeholder="Representante">')
	fieldsetDatosGe.append(form_group2)

	var form_group3 = $('<div class="col-sm-4 form-group"></div>')
    form_group3.append('<label for="nit">NIT</label>')
	form_group3.append('<input type="text" id="nit" class="form-control input-sm" placeholder="Nit">')
	fieldsetDatosGe.append(form_group3)

	var form_group4 = $('<div class="col-sm-4 form-group"></div>')
    form_group4.append('<label for="direccion">Direccion</label>')
	form_group4.append('<input type="text" id="direccion" class="form-control input-sm" placeholder="Dirección">')
	fieldsetDatosGe.append(form_group4)

	var form_group5 = $('<div class="col-sm-4 form-group"></div>')
    form_group5.append('<label for="telefono">Teléfono</label>')
	form_group5.append('<input type="text" id="telefono" class="form-control input-sm" placeholder="Teléfono">')
	fieldsetDatosGe.append(form_group5)

	var form_group6 = $('<div class="col-sm-4 form-group"></div>')
    form_group6.append('<label for="correo">Correo</label>')
	form_group6.append('<input type="email" id="correo" class="form-control input-sm" placeholder="Correo Eletrónico">')
	fieldsetDatosGe.append(form_group6)
	fieldsetDatosGe.prepend('<h3>Datos Generales</h3>')


	var fieldsetCajaArl = $('<fieldset class="row"></fieldset>')
	var col1CajaArl = $('<div class="col-sm-6"></div>')
	var col2CajaArl = $('<div class="col-sm-6"></div>')

	var form_group7 = $('<div class="form-group"></div>')
    form_group7.append('<label for="arl">ARL</label>')
	form_group7.append('<input type="text" id="arl" class="form-control input-sm" placeholder="ARL">')
	col1CajaArl.append(form_group7)

	var form_group8 = $('<div class="form-group"></div>')
    form_group8.append('<label for="caja">CAJA</label>')
	form_group8.append('<input type="text" id="caja" class="form-control input-sm" placeholder="Caja">')
	col2CajaArl.append(form_group8)

	fieldsetCajaArl.append(col1CajaArl)
	fieldsetCajaArl.append(col2CajaArl)
	fieldsetCajaArl.prepend('<legend><h3>Seguro</h3></legend>')

	var fieldsetPlanilla = $('<fieldset class="row"></fieldset>')
	var col1UserPass = $('<div class="col-sm-3"></div>')
	var col2UserPass = $('<div class="col-sm-3"></div>')
	var col3UserPass = $('<div class="col-sm-3"></div>')
	var col4UserPass = $('<div class="col-sm-3"></div>')


	var form_group9 = $('<div class="form-group"></div>')
    form_group9.append('<label for="userNom">Usuario Nómina</label>')
	form_group9.append('<input type="text" id="userNom" class="form-control input-sm" placeholder="Usuario de Nómina">')
	form_group9.append('<label for="passNom">Clave Nómina</label>')
	form_group9.append('<input type="text" id="passNom" class="form-control input-sm" placeholder="Contraseña de Nómina">')
	col1UserPass.append(form_group9)

	var form_group10 = $('<div class="form-group"></div>')
    form_group10.append('<label for="userTeso">Usuario Tesorería</label>')
	form_group10.append('<input type="text" id="userTeso" class="form-control input-sm" placeholder="Usuario Tesorería">')
	form_group10.append('<label for="passTeso">Clave Tesorería</label>')
	form_group10.append('<input type="text" id="passTeso" class="form-control input-sm" placeholder="Contraseña Tesorería">')
	col2UserPass.append(form_group10)

	var form_group11 = $('<div class="form-group"></div>')
    form_group11.append('<label for="userTeso">Usuario Eps</label>')
	form_group11.append('<input type="text" id="userEps" class="form-control input-sm" placeholder="Usuario Eps">')
	form_group11.append('<label for="passTeso">Clave Eps</label>')
	form_group11.append('<input type="text" id="passEps" class="form-control input-sm" placeholder="Clave Eps">')
	col3UserPass.append(form_group11)

	var form_group12 = $('<div class="form-group"></div>')
    form_group12.append('<label for="userTeso">Usuario Arl</label>')
	form_group12.append('<input type="text" id="userArl" class="form-control input-sm" placeholder="Usuario Arl">')
	form_group12.append('<label for="passTeso">Clave Arl</label>')
	form_group12.append('<input type="text" id="passArl" class="form-control input-sm" placeholder="Clave Arl">')
	col4UserPass.append(form_group12)

	fieldsetPlanilla.append(col1UserPass)
	fieldsetPlanilla.append(col2UserPass)
	fieldsetPlanilla.append(col3UserPass)
	fieldsetPlanilla.append(col4UserPass)
	fieldsetPlanilla.prepend('<legend><h3>Usuario y Claves</h3></legend>')




	var button = $('<input type="submit" value="Crear" class="btn btn-primary">');
	form.submit(function(e) {
		e.preventDefault();

		var nombre = $('#nombre').val();
		var representante = $('#representante').val();
		if(nombre.length > 0 && representante.length > 0) {
			var data = {
				nombre: nombre,
				representante: representante,
				fechadeCreacion: '',
				propietario: 'juan',
				nit: $('#nit').val(),
				direccion: $('#direccion').val(),
				correo: $('#correo').val(),
				telefono: $('#telefono').val(),
				arl: $('#arl').val().toUpperCase(),
				caja: $('#caja').val().toUpperCase(),
				user_nomina: $('#userNom').val(),
				pass_nomina: $('#passNom').val(),
				user_tesoreria: $('#userTeso').val(),
				pass_tesoreria: $('#passTeso').val(),
				user_eps: $('#userEps').val(),
				pass_eps: $('#passEps').val(),
				user_arl: $('#userArl').val(),
				pass_arl: $('#passArl').val()
			}			
			socket.emit('creaEmpresa', data)
		} else {
			$('#formCreaEmpresa').find('.alert').remove();
			$('#formCreaEmpresa').prepend('<div id="alert-login" class="alert alert-danger" style="display: block;"><a class="close" data-dismiss="alert" href="#">×</a><span>Formulario incompleto</span></div>');
			window.scrollTo(0,0)
		}
		
	})
	form.append(fieldsetDatosGe)	
	form.append(fieldsetCajaArl)
	form.append(fieldsetPlanilla)

	form.append(button)
	containerDiv.append(form)
	var rowButtonBack = $('<div class="col-sm-2"></div>');

	var panelActions = $('<div class="panel panel-inverse" id="panelAction">');
	panelActions.append('<div class="panel-heading">Acciones</div>');
	var panel_bodyAction = $('<div class="panel-body"></div>');
	var ulButtons = $('<ul class="list-group"></ul>');

	var liButtonBack = $('<li class="list-group-item"></li>');

	$('<button class="btn btn-primary btn-block"><i class="glyphicon glyphicon-chevron-left"></i> Regresar</button>').click(function() {
		recargaEmpresas();
	}).appendTo(liButtonBack);
	ulButtons.append(liButtonBack);
	panelActions.append(ulButtons);
	rowButtonBack.append(panelActions);

	containerCrearEmp.append(containerDiv);
	containerCrearEmp.append(rowButtonBack);

	$('#sectionContainer').prepend(containerCrearEmp);
	window.scrollTo(0,0)
}

function revisaFecha(string) {
	var date = new Date(), diaHoy = date.getDate() < 10? '0'+date.getDate() : date.getDate();
	var str = string.split('/');
	var diaStr = str[0];
	var rest = str[2];
	var hora = rest.split('-');
	return diaHoy == diaStr? hora[1] : string;
}

function crearUsuarioEmp(data){	
	$('.alert').remove()
	$('#newUserEmp')[0].reset()
	$('#titleNewUser').html('<i class="glyphicon glyphicon-plus"></i> Crear Usuario para la Empresa <b>'+data.nameEmp+'</b>')
	$('#saveNewUser').click(function(e){
		if($('#cedulaNew').val() !== '') {
			if (/^([0-9])*$/.test($('#cedulaNew').val())) {
			 	var d = {
					cedula: $('#cedulaNew').val(),
					nombre: $('#nombreNew').val(),
					apellido: $('#apellidoNew').val(),
					telefono: $('#telefonoNew').val(),
					correo: $('#correoNew').val(),
					eps: $('#saludNew').val(),
					afp: $('#pensionNew').val(),
					detalles: $('#detallesNew').val(),
					empresaVin: data.nameEmp,
					arl: '',
					caja: 'X',
					fechaRegistro: '',
					estado: 'Activo',
					empleado: usuario.usuario,
				}			
				socket.emit('newUserEmp', d);
			}
			else
				errorNewUser('La cédula sólo debe contener números')
		}
		else
			errorNewUser('No has digitado la cédula')
	})
}

function errorNewUser(msj){
	$('.alert').remove()
	var e = $('<div class="alert alert-danger"></div>')
	e.append('<i class="glyphicon glyphicon-remove-sign"></i> ')
	e.append(msj)
	e.show()
	$('#contentErrorNewUser').prepend(e)
}

function appendDetalles(tr) {
	var seguridadSocial = { ced: $(tr).attr('data-cedula'), eps: $(tr).attr('data-eps'),
		arl: $(tr).attr('data-arl'), afp: $(tr).attr('data-afp'),
		cajaD: $(tr).attr('data-caja')
	};
	var div1 = $('<div></div>');
	div1.append('<strong>' + seguridadSocial.ced + '</strong>');
	div1.append('<h5>' + seguridadSocial.eps + '</h5>');
	div1.append('<h5>' + seguridadSocial.arl + '</h5>');
	div1.append('<h5>' + seguridadSocial.afp + '</h5>');
	div1.append('<h5>' + seguridadSocial.cajaD + '</h5>');

	var buttonConsulta = $('<button class="btn btn-info">Consultar</button>');
	buttonConsulta.click(function() {
		var cedula = $(tr).attr('data-cedula');		
		window.location.href = 'http://localhost:8080/consulta/?ced=' + seguridadSocial.ced;
	});

	div1.append(buttonConsulta);
	$('#panelDetalles').children().next().html('');
	$('#panelDetalles').children().next().html(div1);
}

function editarInfoEmpresa(e, empresa) {
	var b = $('#editarInfoEmp'), i = $('.infoEmpBloq')
	if(b.text() == 'Guardar') {
		$('.infoEmpEdit').prop({readonly: true})
		$('.infoEmpEdit').addClass('infoEmpBloq')
		$('.infoEmpEdit').removeClass('infoEmpEdit')
		b.text('Cargando...')
		guardarInfoEmpresa(empresa)
	}
	else {
		i.removeAttr('readonly')
		i.attr('class','infoEmpEdit')
		b.text('Guardar')
	}
}

function guardarInfoEmpresa(empresa) {
	var d = {
		datos: {
			nit: $('#infoNit').val(),
			direccion: $('#infoDir').val(),
			correo: $('#infoMail').val(),
			arl: $('#infoArl').val(),
			caja: $('#infoCaja').val(),
			telefono: $('#infoTel').val(),			
			user_nomina: $('#infoUserNom').val(),
			pass_nomina: $('#infoPassNom').val(),
			user_tesoreria: $('#infoUserTeso').val(),
			pass_tesoreria: $('#infoPassTeso').val(),
			user_eps: $('#infoUserEps').val(),
			user_arl: $('#infoUserArl').val(),
			pass_eps: $('#infoPassEps').val(),
			pass_arl: $('#infoPassArl').val()
		},
		empresa: {
			name: empresa
		},
		empleado: {
			name: usuario.usuario
		}
	}	
	socket.emit('guardarInfoEmpresa',d)
}

socket.on('successGuardarInfoEmp', function(c){
	var b = $('#editarInfoEmp')
	b.text('Editar')
	alert('Información actualizada con Éxito.')
})

socket.on('responseSucesosEmp', function(callback) {
	var empIs = callback.empleado == usuario.usuario? 'selectEmp':'';
	var lineSuceso = $('<div class="lineSuceso col-sm-12 text-left '+empIs+'"></div>');
	var icon = callback.caso == 'registro'? '<span class="glyphicon glyphicon-list-alt h4"></span>' : '<span class="glyphicon glyphicon-edit h4"></span>';

	lineSuceso.append(''+icon+ ' '+callback.caso + ' por <strong>'+ callback.empleado + '</strong>');

	var rowInfo = $('<div class="row"></div>');
	var col6F = $('<div class="col-sm-6 text-left">a ' + callback.cedula +'</div>');
	var col6S = $('<div class="col-sm-6 text-right">' + revisaFecha(callback.fecha) +'</div>');
	rowInfo.append(col6F);
	rowInfo.append(col6S);

	lineSuceso.append(rowInfo);

	if(callback.realTime) {
		$('#wrapSucesos').prepend(lineSuceso).children().first().hide().fadeIn();
	}
	else
		$('#wrapSucesos').append(lineSuceso).children().first().hide().fadeIn();
})

socket.on('responseCreaEmpresa', function(callback) {
	if(callback == 'empresa existe') {
		$('#formCreaEmpresa').find('.alert').remove();
		$('#formCreaEmpresa').prepend('<div id="alert-login" class="alert alert-danger" style="display: block;"><a class="close" data-dismiss="alert" href="#">×</a><span>Empresa ya existe</span></div>');
	} else {
		$('#containerCrearEmp').remove();
		$('#lobbyJefe').show();		
		$('#rowEmpresas').html('');
		socket.emit('requestEmpresas', {usuario: usuario.usuario});
	}
})

socket.on('responseEmpresas', function(callback) {	
	var h1 = $('#lobbyJefe').find('h1')
	h1.text('Mis Empresas')
	var rowEmpresas = $('#rowEmpresas')

	if(callback == 'No tiene') {		
		$('<div class="col-sm-6 col-sm-offset-3 well alert-danger h4"><span class="glyphicon glyphicon-remove"></span> No hay empresas</div>').prependTo(rowEmpresas)
	}
	else
	{
		var v1 = JSON.stringify(callback.empresas), v2 = JSON.parse(v1);

		for(var i in v2) {
			var er = v2[i].fechadeCreacion.split('-')
			var fecha = er[0]
			var divPrinc = $('<div class="col-sm-8 col-sm-offset-2"></div>')
			divPrinc.addClass('divPrincEmpresa')			
			divPrinc.append('<div class="col-sm-6 h3">'+v2[i].nombre+'<h5><strong>'+v2[i].representante+'</strong><p>Creación: '+fecha+'</p></h5></div>')
			divPrinc.append('<div class="col-sm-3 h5">Trabajadores<p><h3>'+v2[i].numeroEmps+'</h3></p></div>')
			var divEntrar = $('<div class="col-sm-3"></div>')	
			
			var button = $('<button type="button" class="btn btn-info btn-lg" id="#entrar" data-empresa="'+v2[i].nombre+'">Entrar <i class="glyphicon glyphicon-circle-arrow-right"></i></button>')
			button.click(function(k) {
				return function() {
					var callbackPass = {
						nombre: v2[k].nombre,
						nit: v2[k].nit,
						telefono: v2[k].telefono,
						direccion: v2[k].direccion,
						correo: v2[k].correo,
						representante: v2[k].representante,
						fecha: v2[k].fechadeCreacion,
						numeroEmps: v2[k].numeroEmps,						
						arl: v2[k].arl,				
						caja: v2[k].caja,
						userNom: v2[k].user_nomina,
						passNom: v2[k].pass_nomina,
						userTeso: v2[k].user_tesoreria,
						passTeso: v2[k].pass_tesoreria,
						userEps: v2[k].user_eps,
						passEps: v2[k].pass_eps,
						userArl: v2[k].user_arl,
						passArl: v2[k].pass_arl
					}							
					listarUsuEmpresa(callbackPass)
				  };
				}(i))

			button.appendTo(divEntrar)
			divPrinc.append(divEntrar)
			rowEmpresas.prepend(divPrinc)
		}
	}
})

socket.on('responseListarUsuEmpresa', function(callback) {	
	if(callback.cantidad !== 0) {
		var v1 = JSON.stringify(callback.usuarios), v2 = JSON.parse(v1);
		var table = $('#tableUsuEmpresa>tbody');
		for(var r in v2) {
			var cajaStatus = v2[r].caja == 'X'? 'CAJA':'';
			var tr = $('<tr data-cedula= "'+v2[r].cedula+'" data-eps="'+v2[r].eps+'" data-arl="'+v2[r].arl+'" data-afp="'+v2[r].afp+'" data-caja="'+cajaStatus+'" style="cursor:pointer"></tr>');
			tr.click(function() { appendDetalles(this); });
			tr.append('<td>'+v2[r].cedula+'</td>');
			tr.append('<td>'+v2[r].nombre+'</td>');
			tr.append('<td>'+v2[r].apellido+'</td>');
			var e = v2[r].eps == ''? '':'X'
			var a = v2[r].arl == ''? '':'X'
			var p = v2[r].afp == ''? '':'X'
			tr.append('<td><strong>'+e+'</strong></td>');
			tr.append('<td><strong>'+a+'</strong></td>');
			tr.append('<td><strong>'+p+'</strong></td>');
			tr.append('<td><strong>'+v2[r].caja+'</strong></td>');
			table.append(tr);
			ew++;
			ponerPaginador(callback.cantidad, ew);
			totalMensualidad.push(parseInt(v2[r].mensualidad))
		}
	}
	else {
		$('#panel-headingUsu').text('Usuarios');
		var div = $('#tableUsuEmpresa').parent();
		$('<div class="alert alert-danger col-sm-6 col-sm-offset-3"><span class="glyphicon glyphicon-remove"></span> No tiene usuarios esta empresa</div>').show().appendTo(div);
		$('#tableUsuEmpresa').remove();
	}
})

socket.on('requestUserEmp', function(c){
	if(c.msj == 'userExiste') {
		$('.alert').remove()
		var e = $('<div class="alert alert-danger"></div>')
		e.append('<i class="glyphicon glyphicon-remove-sign"></i> ')
		e.append('El usuario ya EXISTE en la base de datos del sistema')
		e.show()
		$('#contentErrorNewUser').prepend(e)

	}
	else {
		usuMas(c.emp)	
		$('#newUser').modal('hide')
		recargaEmpresas()
		$('<div class="msjPop"><i class="glyphicon glyphicon-ok"></i> !Usuario registrado!</div>').fadeIn(500).appendTo('body')
		
		$('.msjPop').animate({
      		right: '0'
      	}, function(e){
      		$(this).delay(3000).animate({
      			right: '-100%'
      		})
  		})  
  		$('#newUserEmp')[0].reset()
	}
})

function usuMas(emp) {
	socket.emit('usuMas', emp);
}

function ponerPaginador(cantidad, hasta) {
	$('#tableUsuEmpresa').show();
	if(cantidad == hasta) {
		$('#tableUsuEmpresa').dataTable();
		$('#panel-headingUsu').text('Usuarios');
		$('#tableUsuEmpresa').children().next().children().first().click();		

		var total = 0
		jQuery.each( totalMensualidad, function( i, val ) {
		 var e = total+val
		 total = e
		});		
		$('#ganTotal').text(accounting.formatMoney(total,'$', 0, '.'))
		totalMensualidad = []
		total = 0


	} else {
		$('#representanteTable').children().next().remove();
		$('#panel-headingUsu').text('Cargando...');
	}
}

socket.on('responseListarDatos', function(callback) {
	var emp = callback.empresas;
	var eps = callback.eps;
	var afp = callback.afp;
	var arl = callback.arl;

	for(var e in eps) {
		$('#saludNew').append('<option value="'+eps[e].nombre+'">'+eps[e].nombre+'</option>');
	}
	for(var i in afp) {
		$('#pensionNew').append('<option value="'+afp[i].nombre+'">'+afp[i].nombre+'</option>');
	}
})
=======
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
var ew = 0;
$(document).on('ready', function() {

	procesoUsuario();
	
});
function procesoUsuario() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
			var data = {
				usuario: usuario.usuario
			};
			socket.emit('requestEmpresas', data);

			$('#crearEmpresa').on('click', function() {
				newEmpresa(this);
			});
		}

		else{
			$('#lobbyJefe').remove();
			muestraSucesos();
		}
		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
	}
	else
		window.location = "../";
	
	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
}
function muestraSucesos() {
	$('#lobbyJefe').hide();
	var row = $('<div class="row-fluid" id="containerParenSucesos">');
	row.append('<h1>Últimás 20 acciones en el sistema</h1>');
	var containerSucesos = $('<div class="col-sm-6 col-sm-offset-3"></div>');

	var columContainSu = $('<div class="col-sm-12"></div>');
	var wrapSucesosEmp = $('<div class="wrapSucesos" id="wrapSucesos"></div>');
	columContainSu.append(wrapSucesosEmp);
	containerSucesos.append(columContainSu);
	row.append(containerSucesos);
	var dataSucesos = {
		usuario: usuario.usuario
	};
	//Petición de suscesos
	socket.emit('requestSucesosEmp', dataSucesos);

	$('#sectionContainer').append(row);
}

function recargaEmpresas(button) {
	$('#containerUsuEmp').remove();
	$('#containerCrearEmp').remove();
	$('#lobbyJefe').show();
	$('#rowEmpresas').html('');
	var data = {
		usuario: usuario.usuario
	};
	ew = 0;
	socket.emit('requestEmpresas', data);
}
function listarUsuEmpresa(callback) {	
	$('#lobbyJefe').hide();
	var row = $('<div id="containerUsuEmp" class="row text-center"></div>');

	var containerActions = $('<div class="col-sm-3"></div>');

	//Panel Información
	var panelInformacion = $('<div class="panel panel-inverse" id="panelInfo"></div>');
	panelInformacion.append('<div class="panel-heading text-left">Información</div>');

	var panel_bodyInfo = $('<div class="panel-body"></div>');
	panel_bodyInfo.append('<div><h3><strong>'+callback.nombre+'</strong></h3></div>');
	panel_bodyInfo.append('<div id="representanteTable"><h4>'+callback.representante+'</h4></div>');
	panel_bodyInfo.append('<div><h5>'+callback.fecha+'</h5></div>');
	panel_bodyInfo.append('<div>'+callback.numeroEmps+' Trabajadores</div>');
	panelInformacion.append(panel_bodyInfo);

	//Agregando el panel Información al containertActions
	containerActions.append(panelInformacion);

	//Panel detalles
	var panelDetailsUsu = $('<div class="panel panel-inverse" id="panelDetalles"></div>');
	panelDetailsUsu.append('<div class="panel-heading text-left">Detalles</div>');
	var panel_bodyDetails = $('<div class="panel-body"></div>');
	panel_bodyDetails.append('');
	panelDetailsUsu.append(panel_bodyDetails);

	//Agregando el paneL Detalles al containerActions
	containerActions.append(panelDetailsUsu);

	row.append(containerActions);

	var containerTableUsu = $('<div class="col-sm-7"></div>');

	//Panel table
	var panelTableUsuarios = $('<div class="panel  panel-inverse"></div>');
	panelTableUsuarios.append('<div class="panel-heading text-left" id="panel-headingUsu">Cargando...</div>');
	var panel_bodyTableUsuarios = $('<idv class="panel-body"></div>');
	
	var table = $('<table id="tableUsuEmpresa" class="table-bordered table-hover center-table tableClassUsuLobby">');
	table.hide();
	var thead = $('<thead style="color:rgb(66, 139, 202)"></thead>');
	var tbody = $('<tbody class="text-center"></tbody>');
	var tr = $('<tr></tr>');
	tr.append('<th class="text-center" >Cédula</th>');
	tr.append('<th class="text-center">Nombre</th>');
	tr.append('<th class="text-center">Apellido</th>');
	tr.append('<th class="text-center">EPS</th>');
	tr.append('<th class="text-center">ARL</th>');
	tr.append('<th class="text-center">AFP</th>');
	tr.append('<th class="text-center">CAJ</th>');

	var data = { nombre: callback.nombre };
	socket.emit('listarUsuEmpresa', data);

	thead.append(tr);
	table.append(thead);
	table.append(tbody);
	panel_bodyTableUsuarios.append(table);
	panelTableUsuarios.append(panel_bodyTableUsuarios);

	//Agregando el panel Table al containerTableUsu
	containerTableUsu.append(panelTableUsuarios);

	row.append(containerTableUsu);

	var containerStatDetails = $('<div class="col-sm-2"></div>');

	//Panel Acciones
	var panelActions = $('<div class="panel panel-inverse" id="panelAction">');
	panelActions.append('<div class="panel-heading">Acciones</div>');
	var panel_bodyAction = $('<div class="panel-body"></div>');
	var ulButtons = $('<ul class="list-group"></ul>');

	var liButtonBack = $('<li class="list-group-item"></li>');
	var liButtonRemove = $('<li class="list-group-item"></li>');
	var liButtonSizeTable = $('<li class="list-group-item"></li>');

	$('<button class="btn btn-primary btn-block"><i class="glyphicon glyphicon-chevron-left"></i> Regresar</button>').click(function() {
		recargaEmpresas(this);
	}).appendTo(liButtonBack);
	
	$('<button class="btn btn-danger btn-block"><i class="glyphicon glyphicon-trash"></i> Eliminar</button>').click(function() {
		apprise('Esta seguro de quere eliminar la empresa: <strong>'+callback.nombre +'</strong> ?', '', {'verify':true}, function(r) {
			if(r) {
				apprise('Desea conservar los usuario de la emrpesa: <strong>'+callback.nombre +'</strong> pero sin asignarle empresa?', '', {'verify':true}, function(r) {
					if(r) {
						apprise('EMPRESA ELIMINADA PERO SE HAN GUARDADO LOS USUARIOS');
						var dataRemoveEmp = {
							nombre: callback.nombre,
							atributo: 'saveUsuarios'
						};
						socket.emit('eliminarEmpresa', dataRemoveEmp);
						recargaEmpresas();
					} else {
						apprise('EMPRESA Y USUARIOS ELIMINADOS');
						var dataRemoveEmp2 = {
							nombre: callback.nombre,
							atributo: 'removeUsuarios'
						};
						socket.emit('eliminarEmpresa', dataRemoveEmp2);
						recargaEmpresas();
					}
				});
			}
        });
	}).appendTo(liButtonRemove);
	$('<button type="button" class="btn btn-info btn-block" data-toggle="button"><i class="glyphicon glyphicon-zoom-in"></i><span>Grande</span></button>').click(function(e) {
		if($(this).children().next().text() == 'Grande') {
			$('#tableUsuEmpresa').addClass('table-condensed');
			$(this).children().next().text('Pequeña');
			$(this).children().removeClass('glyphicon-zoom-in');
			$(this).children().first().addClass('glyphicon-zoom-out');
		} else {
			$('#tableUsuEmpresa').removeClass('table-condensed');
			$(this).children().next().text('Grande');
			$(this).children().first().removeClass('glyphicon-zoom-out').addClass('glyphicon-zoom-in');
		}
	}).appendTo(liButtonSizeTable);
	
	ulButtons.append(liButtonBack);
	ulButtons.append(liButtonRemove);
	ulButtons.append(liButtonSizeTable);
	panelActions.append(ulButtons);
	panelActions.append(panel_bodyAction);

	//Panel Estadísticas
	var panelStatistic = $('<div class="panel panel-inverse"></div>');
	panelStatistic.append('<div class="panel-heading text-left">Estadísticas</div>');
	var panel_bodyStatistic = $('<div class="panel-body"></div>');
	panel_bodyStatistic.append('<div><h5>Total Pagos $4.000.000</h5></div>');
	panel_bodyStatistic.append('<div><h5>Ganancia individual $20.000</h5></div>');
	panel_bodyStatistic.append('<div class="h4">Ganancia total $500.000</div>');
	panelStatistic.append(panel_bodyStatistic);

	containerStatDetails.append(panelActions);
	containerStatDetails.append(panelStatistic);

	row.append(containerStatDetails);
	$('#sectionContainer').prepend(row);
}
function newEmpresa(e) {
	$('#lobbyJefe').hide();
	var containerCrearEmp = $('<div id="containerCrearEmp" class="row text-center"></div>');

	var containerDiv = $('<div class="col-sm-6 col-sm-offset-3 well text-muted"></div>');
	var form = $('<form id="formCreaEmpresa"><h3>Crear Empresa</h3></form>');

    var form_group1 = $('<div class="form-group"></div>');
    form_group1.append('<label for="nombre">Nombre</label>');
	form_group1.append('<input type="text" id="nombre" class="form-control" placeholder="Nombre">');

	var form_group2 = $('<div class="form-group"></div>');
    form_group2.append('<label for="representante">Representante</label>');
	form_group2.append('<input type="text" id="representante" class="form-control" placeholder="Representante">');

	var button = $('<input type="submit" value="Crear" class="btn btn-primary">');
	form.submit(function(e) {
		e.preventDefault();

		var nombre = $('#nombre').val();
		var representante = $('#representante').val();
		if(nombre.length > 0 && representante.length > 0) {
			var data = {
				nombre: nombre,
				representante: representante,
				propietario: usuario.usuario
			};
			socket.emit('creaEmpresa', data);
		} else {
			$('#formCreaEmpresa').find('.alert').remove();
			$('#formCreaEmpresa').prepend('<div id="alert-login" class="alert alert-danger" style="display: block;"><a class="close" data-dismiss="alert" href="#">×</a><span>Formulario incompleto</span></div>');
		}
		
	});
	form.append(form_group1);
	form.append(form_group2);
	form.append(button);
	containerDiv.append(form);
	var rowButtonBack = $('<div class="col-sm-2" syle="background:red"></div>');

	var panelActions = $('<div class="panel panel-inverse" id="panelAction">');
	panelActions.append('<div class="panel-heading">Acciones</div>');
	var panel_bodyAction = $('<div class="panel-body"></div>');
	var ulButtons = $('<ul class="list-group"></ul>');

	var liButtonBack = $('<li class="list-group-item"></li>');

	$('<button class="btn btn-primary btn-block"><i class="glyphicon glyphicon-chevron-left"></i> Regresar</button>').click(function() {
		recargaEmpresas();
	}).appendTo(liButtonBack);
	ulButtons.append(liButtonBack);
	panelActions.append(ulButtons);
	rowButtonBack.append(panelActions);

	containerCrearEmp.append(containerDiv);
	containerCrearEmp.append(rowButtonBack);

	$('#sectionContainer').prepend(containerCrearEmp);
}

function revisaFecha(string) {
	var date = new Date(), diaHoy = date.getDate() < 10? '0'+date.getDate() : date.getDate();
	var str = string.split('/');
	var diaStr = str[0];
	var rest = str[2];
	var hora = rest.split('-');
	return diaHoy == diaStr? hora[1] : string;
}
function appendDetalles(tr) {
	var seguridadSocial = { ced: $(tr).attr('data-cedula'), eps: $(tr).attr('data-eps'),
		arl: $(tr).attr('data-arl'), afp: $(tr).attr('data-afp'),
		cajaD: $(tr).attr('data-caja')
	};
	var div1 = $('<div></div>');
	div1.append('<strong>' + seguridadSocial.ced + '</strong>');
	div1.append('<h5>' + seguridadSocial.eps + '</h5>');
	div1.append('<h5>' + seguridadSocial.arl + '</h5>');
	div1.append('<h5>' + seguridadSocial.afp + '</h5>');
	div1.append('<h5>' + seguridadSocial.cajaD + '</h5>');

	var buttonConsulta = $('<button class="btn btn-info">Consultar</button>');
	buttonConsulta.click(function() {
		var cedula = $(tr).attr('data-cedula');		
		window.location.href = 'http://localhost:8082/consulta/?ced=' + seguridadSocial.ced;
	});

	div1.append(buttonConsulta);
	$('#panelDetalles').children().next().html('');
	$('#panelDetalles').children().next().html(div1);
}
socket.on('responseSucesosEmp', function(callback) {
	var empIs = callback.empleado == usuario.usuario? 'selectEmp':'';
	var lineSuceso = $('<div class="lineSuceso col-sm-12 text-left '+empIs+'"></div>');
	var icon = callback.caso == 'registro'? '<span class="glyphicon glyphicon-list-alt h4"></span>' : '<span class="glyphicon glyphicon-edit h4"></span>';

	lineSuceso.append(''+icon+ ' '+callback.caso + ' por <strong>'+ callback.empleado + '</strong>');

	var rowInfo = $('<div class="row"></div>');
	var col6F = $('<div class="col-sm-6 text-left">a ' + callback.cedula +'</div>');
	var col6S = $('<div class="col-sm-6 text-right">' + revisaFecha(callback.fecha) +'</div>');
	rowInfo.append(col6F);
	rowInfo.append(col6S);

	lineSuceso.append(rowInfo);

	if(callback.realTime) {
		$('#wrapSucesos').prepend(lineSuceso).children().first().hide().fadeIn();
	}
	else
		$('#wrapSucesos').append(lineSuceso).children().first().hide().fadeIn();
	
});
socket.on('responseCreaEmpresa', function(callback) {
	if(callback == 'empresa existe') {
		$('#formCreaEmpresa').find('.alert').remove();
		$('#formCreaEmpresa').prepend('<div id="alert-login" class="alert alert-danger" style="display: block;"><a class="close" data-dismiss="alert" href="#">×</a><span>Empresa ya existe</span></div>');
	} else {
		$('#containerCrearEmp').remove();
		$('#rowEmpresas').html('');
		$('#lobbyJefe').show();
		var data = {
			usuario: usuario.usuario
		};
		socket.emit('requestEmpresas', data);
	}
});

socket.on('responseEmpresas', function(callback) {	
	$('#lobbyJefe').children().first().text('Mis Empresas')
	var rowEmpresas = $('#rowEmpresas');
	$('#rowEmpresas').show();
	if(callback == 'No tiene') {
		$('#lobbyJefe').children().first().remove();
		$('<div class="col-sm-6 col-sm-offset-3 well alert-danger h4">No tiene empresas</div>').prependTo(rowEmpresas);
	}
	else
	{
		var v1 = JSON.stringify(callback.empresas), v2 = JSON.parse(v1);


		for(var i in v2) {
			
			
			var divPrinc = $('<div class="col-sm-8 col-sm-offset-2"></div>')
			divPrinc.addClass('divPrincEmpresa')
			divPrinc.append('<div id="divEnterEmpresa" class="divEnterEmpresa"><h1>Entrar</h1></div>')
			divPrinc.append('<div class="col-sm-6 h3">'+v2[i].nombre+'<h5><strong>'+v2[i].representante+'</strong><p>Creación: '+v2[i].fecha+'</p></h5></div>')
			divPrinc.append('<div class="col-sm-3 h5">Trabajadores<p><h3>'+v2[i].numeroEmps+'</h3></p></div>')
			var divEntrar = $('<div class="col-sm-3"></div>')	
			
			var button = $('<button type="button" class="btn btn-info btn-lg" id="#entrar" data-empresa="'+v2[i].nombre+'">Entrar <i class="glyphicon glyphicon-circle-arrow-right"></i></button>')
			button.click(function(k) {
				return function() {
					var callbackPass = {
						nombre: v2[k].nombre,
						representante: v2[k].representante,
						fecha: v2[k].fecha,
						numeroEmps: v2[k].numeroEmps
					}
					console.log(callbackPass)					 
					listarUsuEmpresa(callbackPass)
				  };
				}(i))

			button.appendTo(divEntrar)
			divPrinc.append(divEntrar)
			rowEmpresas.prepend(divPrinc)
		}
		
		
	}
});

socket.on('responseListarUsuEmpresa', function(callback) {	
	if(callback.cantidad !== 0) {
		var v1 = JSON.stringify(callback.usuarios), v2 = JSON.parse(v1);
		var table = $('#tableUsuEmpresa>tbody');
		for(var r in v2) {
			var cajaStatus = v2[r].caja == 'X'? 'CAJA':'';
			var tr = $('<tr data-cedula= "'+v2[r].cedula+'" data-eps="'+v2[r].eps+'" data-arl="'+v2[r].arl+'" data-afp="'+v2[r].afp+'" data-caja="'+cajaStatus+'" style="cursor:pointer"></tr>');
			tr.click(function() { appendDetalles(this); });
			tr.append('<td>'+v2[r].cedula+'</td>');
			tr.append('<td>'+v2[r].nombre+'</td>');
			tr.append('<td>'+v2[r].apellido+'</td>');
			tr.append('<td><strong>'+v2[r].salud+'</strong></td>');
			tr.append('<td><strong>'+v2[r].riesgo+'</strong></td>');
			tr.append('<td><strong>'+v2[r].pension+'</strong></td>');
			tr.append('<td><strong>'+v2[r].caja+'</strong></td>');
			table.append(tr);
			ew++;
			ponerPaginador(callback.cantidad, ew);
		}
	}
	else {
		$('#panel-headingUsu').text('Usuarios');
		var div = $('#tableUsuEmpresa').parent();
		$('<div class="alert alert-danger col-sm-6 col-sm-offset-3">No tiene usuarios esta empresa</div>').show().appendTo(div);
		$('#tableUsuEmpresa').remove();
	}
});
function ponerPaginador(cantidad, hasta) {
	$('#tableUsuEmpresa').show();
	if(cantidad == hasta) {
		$('#tableUsuEmpresa').dataTable();
		$('#panel-headingUsu').text('Usuarios');
		$('#tableUsuEmpresa').children().next().children().first().click();
	} else {
		$('#representanteTable').children().next().remove();
		$('#panel-headingUsu').text('Cargando...');
	}
}
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
