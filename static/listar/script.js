<<<<<<< HEAD
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
var ew = 0;
$(document).ready(function(){
	
	
	procesoUsuario();
	cargaDatos(usuario);
	cargaEmpleadoList(usuario);

	// request usuarios con criterio
	$('#form_nombre').submit(function(e) {
		e.preventDefault();
		var nombreData = {};
		ew = 0;
		var nombre = $(this).find('input').val();
		if(nombre === '') {
			apprise('Escribe un nombre para buscar coincidencias');
		} else {
			nombreData = {
				valor: nombre,
				criterio: 'nombres'
			};
			creatingTable('Usuarios nombre parecido a : '+nombre, 'containerTableNombre');
			socket.emit('listarNombre', nombreData);

		}
	});
	$('#form_cargo').submit(function(e) {
		e.preventDefault();
		var cargoData = {};
		ew = 0;
		var cargo = $(this).find('input').val();
		if(cargo === '') {
			apprise('Escribe un cargo para buscarlo');
		} else {
			cargoData = {
				valor: MaysPrimera(cargo.toLowerCase()),
				criterio: 'cargo'
			};
			creatingTable('Usuarios con Cargo: '+cargo, 'containerTableCargo');
			socket.emit('listarCargo', cargoData);

		}
	});
	$('#selectEmpresaVin').on('change', function() {
		var dataTableUsu;
		var criterio = 'empresaVin';
		var valor = $(this).val();
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Usuarios vinculados a '+valor, 'containerTableEmpresaVin');
			dataTableUsu = {
				criterio: criterio,
				valor: valor
			};
			socket.emit('listarTablaEmpresaVin',dataTableUsu);
		}
	});
	$('#selectEmpleado').on('change', function() {
		var dataTableEmpleados;
		var criterio = 'empleadoReg';
		var valor = $(this).val();
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Usuarios registrados por '+valor, 'containerTableEmpleado');
			dataTableEmpleados = {
				criterio: criterio,
				valor: valor
			};			
			socket.emit('listarTablaEmpleado',dataTableEmpleados);
		}
	});
	$('#selectEPS, #selectARL, #selectAFP').on('change', function() {
		var id = $(this).attr('id');
		$('#containerSelectorsSS').find('select').not('#'+id).val('');
		var criterio = $(this).attr('data-info');
		var valor = $(this).val();
		var data = {};
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Afiliado a '+valor, 'containerTableSS');
			data = {
				criterio: criterio,
				valor: valor
			};
			socket.emit('listarTablaSS', data);
		}
	});
	// fin request usuarios con criterio
	
});
$(function () {
	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
});
socket.on('responseListarDatos', function(callback) {	
	$('select').removeAttr('disabled');
	var empresas = callback.empresas;
	var eps = callback.eps;
	var afp = callback.afp;
	var arl = callback.arl;
	$('#selectEmpresaVin').html('<option value=""></option>');
	$('#selectEPS').html('<option value=""></option>');
	$('#selectARL').html('<option value=""></option>');
	$('#selectAFP').html('<option value=""></option>');

	for(var a in empresas) {
		$('#selectEmpresaVin').append('<option value="'+empresas[a].nombre+'">'+empresas[a].nombre+'</option>');
	}
	for(var e in eps) {
		$('#selectEPS').append('<option value="'+eps[e].nombre+'">'+eps[e].nombre+'</option>');
	}
	for(var i in afp) {
		$('#selectAFP').append('<option value="'+afp[i].nombre+'">'+afp[i].nombre+'</option>');
	}
	for(var o in arl) {
		$('#selectARL').append('<option value="'+arl[o].nombre+'">'+arl[o].nombre+'</option>');
	}
});
socket.on('responselistarEmpleados', function(callback) {
	var empleados = callback.empleados;
	for(var a in empleados) {
		$('#selectEmpleado').append('<option value="'+empleados[a].usuario+'">'+empleados[a].usuario+'</option>');
	}
});
socket.on('responseListarTabla', function(callback) {	
	var nameTable = callback.nameTable;
	if(callback.cantidad !== 0) {
		var v1 = JSON.stringify(callback.usuarios);
		var v2 = JSON.parse(v1);
		var table = $('#'+nameTable+'>tbody');
		for(var i in v2) {
			var tr = $('<tr data-cedula = "'+v2[i].cedula+'"></tr>');
			tr.css('cursor','pointer');
			tr.click(function() {
				window.location.href = 'http://localhost:8080/consulta/?ced='+$(this).attr('data-cedula');
			});
			tr.append('<td>'+v2[i].cedula+'</td>');
			tr.append('<td>'+v2[i].apellido+'</td>');
			tr.append('<td>'+v2[i].nombre+'</td>');
			tr.append('<td>'+v2[i].empresaVin+'</td>');
			tr.append('<td>'+v2[i].cargo+'</td>');
			tr.append('<td>'+v2[i].mensualidad+'</td>');
			table.append(tr);
			ew++;
			ponerPaginador(callback.cantidad, ew, nameTable);
		}
	}
	else {		
		$('#loadH3').remove();		
		var containerTable = $('#'+nameTable).parent();		
		$('<div class="alert alert-danger col-sm-4 col-sm-offset-4 text-center" style="margin-top: 10px">No hay usuarios</div>').show().appendTo(containerTable);
	}
});
function procesoUsuario() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
				if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('#divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
	}
	else
		window.location = "../";

	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
}
function cargaDatos(usuario) {
	console.log(usuario)
	var propietario = {
		usuario: usuario.jefe
	};
	socket.emit('listarDatos', propietario);
}
function cargaEmpleadoList(usuario) {
	var empleadoList = {
		jefe: usuario.jefe
	};
	socket.emit('listarEmpleados', empleadoList);
}
function ponerPaginador(cantidad, hasta, nameTable) {
	$('#loadH3').remove();
	$('#'+nameTable).show();
	if(cantidad == hasta) {
		console.log('Se esta empezando a paginar la tabla: '+ nameTable);
		$('caption').children().html(' ('+cantidad+')');
		$('#'+nameTable).dataTable({
			"aaSorting": [[1,'asc']],
			"sDom": 'rt<"bottom"lfp><"clear">',
		});
	}
}
function MaysPrimera(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function creatingTable(parametro, container) {
	var containerTable = $('#'+container);
	var table = $('<table id="tabla'+container+'" class="table-bordered table-hover tableClassUsu" style="background:#313131">');
	var caption = $('<caption class="h3 captionTableListar">'+parametro+'<span></span></caption>');
	var thead = $('<thead style="color:rgb(66, 139, 202)"></thead>');
	var tbody = $('<tbody class="text-center"></tbody>');
	var tr = $('<tr></tr>');

	tr.append('<th class="text-center">Cédula</th>');
	tr.append('<th class="text-center">Apellido</th>');
	tr.append('<th class="text-center">Nombre</th>');
	tr.append('<th class="text-center">EmpresaVin</th>');
	tr.append('<th class="text-center">Cargo</th>');
	tr.append('<th class="text-center">Mensualidad</th>');

	thead.append(tr);
	table.append(caption);
	table.append(thead);
	table.append(tbody);

	containerTable.html('');
	containerTable.append('<div class="h3 text-center" id="loadH3">Cargando...</div>');
	table.css('display','none');
	containerTable.append(table);
=======
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
var ew = 0;
$(document).ready(function(){
	
	
	procesoUsuario();
	cargaDatos(usuario);
	cargaEmpleadoList(usuario);

	// request usuarios con criterio
	$('#form_nombre').submit(function(e) {
		e.preventDefault();
		var nombreData = {};
		ew = 0;
		var nombre = $(this).find('input').val();
		if(nombre === '') {
			apprise('Escribe un nombre para buscar coincidencias');
		} else {
			nombreData = {
				valor: nombre,
				criterio: 'nombres'
			};
			creatingTable('Usuarios nombre parecido a : '+nombre, 'containerTableNombre');
			socket.emit('listarNombre', nombreData);

		}
	});
	$('#form_cargo').submit(function(e) {
		e.preventDefault();
		var cargoData = {};
		ew = 0;
		var cargo = $(this).find('input').val();
		if(cargo === '') {
			apprise('Escribe un cargo para buscarlo');
		} else {
			cargoData = {
				valor: MaysPrimera(cargo.toLowerCase()),
				criterio: 'cargo'
			};
			creatingTable('Usuarios con Cargo: '+cargo, 'containerTableCargo');
			socket.emit('listarCargo', cargoData);

		}
	});
	$('#selectEmpresaVin').on('change', function() {
		var dataTableUsu;
		var criterio = 'empresaVin';
		var valor = $(this).val();
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Usuarios vinculados a '+valor, 'containerTableEmpresaVin');
			dataTableUsu = {
				criterio: criterio,
				valor: valor
			};
			socket.emit('listarTablaEmpresaVin',dataTableUsu);
		}
	});
	$('#selectEmpleado').on('change', function() {
		var dataTableEmpleados;
		var criterio = 'empleadoReg';
		var valor = $(this).val();
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Usuarios registrados por '+valor, 'containerTableEmpleado');
			dataTableEmpleados = {
				criterio: criterio,
				valor: valor
			};			
			socket.emit('listarTablaEmpleado',dataTableEmpleados);
		}
	});
	$('#selectEPS, #selectARL, #selectAFP').on('change', function() {
		var id = $(this).attr('id');
		$('#containerSelectorsSS').find('select').not('#'+id).val('');
		var criterio = $(this).attr('data-info');
		var valor = $(this).val();
		var data = {};
		ew = 0;
		if(valor === '') {
			apprise('No ha seleccionado ningun criterio');
		}
		else {
			creatingTable('Afiliado a '+valor, 'containerTableSS');
			data = {
				criterio: criterio,
				valor: valor
			};
			socket.emit('listarTablaSS', data);
		}
	});
	// fin request usuarios con criterio
	
});
$(function () {
	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
});
socket.on('responseListarDatos', function(callback) {	
	$('select').removeAttr('disabled');
	var empresas = callback.empresas;
	var eps = callback.eps;
	var afp = callback.afp;
	var arl = callback.arl;
	$('#selectEmpresaVin').html('<option value=""></option>');
	$('#selectEPS').html('<option value=""></option>');
	$('#selectARL').html('<option value=""></option>');
	$('#selectAFP').html('<option value=""></option>');

	for(var a in empresas) {
		$('#selectEmpresaVin').append('<option value="'+empresas[a].nombre+'">'+empresas[a].nombre+'</option>');
	}
	for(var e in eps) {
		$('#selectEPS').append('<option value="'+eps[e].nombre+'">'+eps[e].nombre+'</option>');
	}
	for(var i in afp) {
		$('#selectAFP').append('<option value="'+afp[i].nombre+'">'+afp[i].nombre+'</option>');
	}
	for(var o in arl) {
		$('#selectARL').append('<option value="'+arl[o].nombre+'">'+arl[o].nombre+'</option>');
	}
});
socket.on('responselistarEmpleados', function(callback) {
	var empleados = callback.empleados;
	for(var a in empleados) {
		$('#selectEmpleado').append('<option value="'+empleados[a].usuario+'">'+empleados[a].usuario+'</option>');
	}
});
socket.on('responseListarTabla', function(callback) {	
	var nameTable = callback.nameTable;
	if(callback.cantidad !== 0) {
		var v1 = JSON.stringify(callback.usuarios);
		var v2 = JSON.parse(v1);
		var table = $('#'+nameTable+'>tbody');
		for(var i in v2) {
			var tr = $('<tr data-cedula = "'+v2[i].cedula+'"></tr>');
			tr.css('cursor','pointer');
			tr.click(function() {
				window.location.href = 'http://localhost:8082/consulta/?ced='+$(this).attr('data-cedula');
			});
			tr.append('<td>'+v2[i].cedula+'</td>');
			tr.append('<td>'+v2[i].apellido+'</td>');
			tr.append('<td>'+v2[i].nombre+'</td>');
			tr.append('<td>'+v2[i].empresaVin+'</td>');
			tr.append('<td>'+v2[i].cargo+'</td>');
			tr.append('<td>'+v2[i].mensualidad+'</td>');
			table.append(tr);
			ew++;
			ponerPaginador(callback.cantidad, ew, nameTable);
		}
	}
	else {		
		$('#loadH3').remove();		
		var containerTable = $('#'+nameTable).parent();		
		$('<div class="alert alert-danger col-sm-4 col-sm-offset-4 text-center" style="margin-top: 10px">No hay usuarios</div>').show().appendTo(containerTable);
	}
});
function procesoUsuario() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
				if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('#divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
	}
	else
		window.location = "../";

	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
}
function cargaDatos(usuario) {
	console.log(usuario)
	var propietario = {
		usuario: usuario.jefe
	};
	socket.emit('listarDatos', propietario);
}
function cargaEmpleadoList(usuario) {
	var empleadoList = {
		jefe: usuario.jefe
	};
	socket.emit('listarEmpleados', empleadoList);
}
function ponerPaginador(cantidad, hasta, nameTable) {
	$('#loadH3').remove();
	$('#'+nameTable).show();
	if(cantidad == hasta) {
		console.log('Se esta empezando a paginar la tabla: '+ nameTable);
		$('caption').children().html(' ('+cantidad+')');
		$('#'+nameTable).dataTable({
			"aaSorting": [[1,'asc']],
			"sDom": 'rt<"bottom"lfp><"clear">',
		});
	}
}
function MaysPrimera(string){
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function creatingTable(parametro, container) {
	var containerTable = $('#'+container);
	var table = $('<table id="tabla'+container+'" class="table-bordered table-hover center-table tableClassUsu" style="background:#313131">');
	var caption = $('<caption class="h3" style="color:#E2E2E2">'+parametro+'<span></span></caption>');
	var thead = $('<thead style="color:rgb(66, 139, 202)"></thead>');
	var tbody = $('<tbody class="text-center"></tbody>');
	var tr = $('<tr></tr>');

	tr.append('<th class="text-center">Cédula</th>');
	tr.append('<th class="text-center">Apellido</th>');
	tr.append('<th class="text-center">Nombre</th>');
	tr.append('<th class="text-center">EmpresaVin</th>');
	tr.append('<th class="text-center">Cargo</th>');
	tr.append('<th class="text-center">Mensualidad</th>');

	thead.append(tr);
	table.append(caption);
	table.append(thead);
	table.append(tbody);

	containerTable.html('');
	containerTable.append('<div class="h3 text-center" id="loadH3">Cargando...</div>');
	table.css('display','none');
	containerTable.append(table);
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
}