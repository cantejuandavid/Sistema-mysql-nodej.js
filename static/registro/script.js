<<<<<<< HEAD
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);	
}
else{
	window.location = "../";
}

$(document).on('ready', function(){ Inicialize(); });
var constan = 0;
var error = 0;
var pCedula = 0;
var mensualidad = 0;

function Inicialize() {
	if(localStorage.usuario){
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
		$('#logout').on('click', function(){localStorage.removeItem('usuario');window.location = "../";});
	}
	else{
		window.location = "../";
	}
	
	$('#form-regUsu').submit(function(e){
		e.preventDefault();
		$('.campoErrorReg').removeClass('campoErrorReg')
		validaCamposEmpty($('#cedula'),$('#nombre'),$('#apellido'),$('#telefono'),$('#salario'),$('#fecha-ingreso'),$('#cargouOficio'));
		$('html, body').animate({scrollTop:0}, 550);		
	});
	$('#caja').on('click', function(){
		var chk = $(this);
		var classCurrent = chk.attr("class");
		chk.toggleClass('btn-success').promise().done(function(){
			if(classCurrent == 'btn btn-default')
				chk.attr('data-confirm', 'X')
			else
				chk.attr('data-confirm', '')
		});		
	});
	Calendar.setup (
		{
			inputField     :    "fecha-ingreso",      // id del campo de fecha
			ifFormat       :    "%d/%m/%Y",       // formato de fecha
			showsTime      :    false,            // Mostrar hora
			button         :    "buttonCalendario",   // Lanzador de calendario
			singleClick    :    true,           // modo Doble-click
			step           :    1                // show all years in drop-down boxes (instead of every other year as default)
		}
	);
	// llamamos los datos del servidor eps,afp,arl..
	cargaDatos(usuario);
	sistemaMensualidad()	
}
function sistemaMensualidad() {
	$('.menCheck').on('click', function(){
		var pul = $(this).attr('data-press')
		var val = parseInt($(this).attr('data-valor'))			
		if(pul == 'off') {
			
			mensualidad = parseInt(mensualidad+val)

			var valorr = accounting.formatMoney(mensualidad,'$', 0, '.');
			$('#valorMensualidad').val(mensualidad)
			$('.valorMenSpan').text(valorr)
			$('#valorMensualidad').attr('value',mensualidad)
			$(this).attr('data-press','on')
		}
		else{					
			mensualidad = parseInt(mensualidad-val)

			var valorr = accounting.formatMoney(mensualidad,'$', 0, '.');
			$('#valorMensualidad').val(mensualidad)
			$('.valorMenSpan').text(valorr)
			$('#valorMensualidad').attr('value',mensualidad)
			$(this).attr('data-press','off')
		}
	})
	$('#knowPrice').on('click', function() {
		alert($('#valorMensualidad').val())
	})
	$('#digitarMensualidad').on('click', function() {
		$('#valorMensualidad').removeClass('hidden')
	})
}


function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = [8, 37, 39, 46];

    tecla_especial = false;
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if(letras.indexOf(tecla) == -1 && !tecla_especial){
		return false;
    }
}

function EscribeSoloNumero(e,valor){
	var codigo;
	codigo = (document.all) ? e.keyCode : e.which;
	if (codigo > 31 && (codigo < 48 || codigo > 57))
	{
		$('#' + valor).css({ background: "rgba(0,0,0,.7)" });
		$('#' + valor).html('<img src="iconos/warning.png" class="miniCheckW">S&oacute;lo numeros').fadeIn();
		return false;
	}
	$('#' + valor).fadeOut();
	return true;
}

function ValidarCedula(value){
	if(value != '') {
		var data = {
			cedula: value
		};
		$('#mensaje1').html('Validando...').fadeIn();
		socket.emit('validar cedula', data);
	}	
}

function validarcarccorreo(value){
	var re  = /^[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+\.[A-Za-z]+/;
	if (!re.test(value))
	{
		$('#alertCorreo').remove();
		$('#labelCorreo').after(' <span id="alertCorreo"><img src="iconos/bad.png" width="20"></span>');		
		$('#correo').parent().removeClass('has-error')
	}
	else
	{
		$('#alertCorreo').remove();
		$('#labelCorreo').after(' <span id="alertCorreo"><img src="iconos/good.png" width="20"></span>');
	}
}

function format(input){
	var num = input.value.replace(/\./g,'');
	if(!isNaN(num)){
		num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
		num = num.split('').reverse().join('').replace(/^[\.]/,'');
		input.value = num;
	}
	else{
		apprise('Solo se permiten numeros');
		$(input).focus();
		input.value = input.value.replace(/[^\d\.]*/g,'');
	}
}

function validaCamposEmpty(){
	var i;
	var begin = false;
	$('#bContainerErrores').html('');
	for(i = 0; i < arguments.length; i++)
	{
		objeto = arguments[i];
		if(objeto.val().length == 0)
		{
			error = 1;
			begin = true;
			objeto.addClass('campoErrorReg');
			var wrapper = $('#containerErrores');

			$('#tContainerErrores').text("Estos campos son obligatorios: ").parent().show();
			$('#bContainerErrores').append("<button class='btn btn-danger btn-small' style='margin-right: 4px; margin-bottom:4px;'>" + objeto.attr("data-tag") + "</button>").show();
		}
	}
	if(begin == false)
	{
		validaCamposEspecial();
	}	
}

function validaCamposEspecial(){

	correo = document.getElementById('correo').value;
	var re  = /^[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+\.[A-Za-z]+/;

	(!re.test(correo))? error = 1 : error = 0;


	constan = 2;
	RegistraBD(error);
}

function RegistraBD(valor){
	var wrapper = $('#containerErrores');
	wrapper.hide();
	if(valor == 1 || pCedula > 0)
	{
		apprise('Completa el formulario de registro!');
		valor == 1? $('#correo').parent().addClass('has-error') : $('#cedula').parent().addClass('has-error');
	}
	else
	{
		var caja = $('#caja').attr('data-confirm');
		var empresaVin = ($('#empresaVin').val()==null) ? '' : $('#empresaVin').val()
		console.log('empresaVin: ' + empresaVin)

		var localstorage = localStorage.getItem('usuario');
		var usuario = JSON.parse(localstorage);
		var inputSalario =  $('#salario').val();
		var nSalario = inputSalario.replace('.','');
		var data = {
			cedula: $('#cedula').val(),
			nombre: $('#nombre').val(),
			apellido: $('#apellido').val(),
			telefono: $('#telefono').val(),
			direccion: $('#direccion').val(),
			correo: $('#correo').val(),
			caja: caja,
			num_riesgo: $('#num-riesgo').val(),
			detalles: $('#detalles').val(),
			fechaIngreso: $('#fecha-ingreso').val(),
			empresa: $('#empresa').val(),
			salario: nSalario,
			eps: $('#eps').val(),
			arl: $('#arl').val(),
			afp: $('#afp').val(),
			empleadoReg: usuario.usuario,
			cargo: $('#cargouOficio').val(),
			empresaVin: empresaVin,
			usuario: $('#userPlanilla').val(),
			pass: $('#passPlanilla').val(),
			mensualidad: $('#valorMensualidad').val(),
			estado: 'Activo'
		};		
		socket.emit('add usuario', data);
	}
}

function cargaDatos(usuario) {	
	socket.emit('listarDatos', {usuario: usuario.jefe});
}

socket.on('responseListarDatos', function(callback) {
	var emp = callback.empresas;
	var eps = callback.eps;
	var afp = callback.afp;
	var arl = callback.arl;

	for(var a in emp) {
		$('#empresaVin').append('<option value="'+emp[a].nombre+'">'+emp[a].nombre+'</option>');
	}
	for(var e in eps) {
		$('#eps').append('<option value="'+eps[e].nombre+'">'+eps[e].nombre+'</option>');
	}
	for(var i in afp) {
		$('#afp').append('<option value="'+afp[i].nombre+'">'+afp[i].nombre+'</option>');
	}
	for(var o in arl) {
		$('#arl').append('<option value="'+arl[o].nombre+'">'+arl[o].nombre+'</option>');
	}
});

socket.on('recibe cedula', function(data){
	if(data == 'existe'){
		$('#alertCedula').remove();
		$('#labelCedula').after(' <span id="alertCedula"><img src="iconos/bad.png" width="20"></span>');		
		pCedula = 1;
	}
	else if(data == 'noExiste'){
		$('#alertCedula').remove();
		$('#labelCedula').after(' <span id="alertCedula" style="vertical-align:top"><img src="iconos/good.png" width="20"></span>');
		pCedula = 0;
	}
});

socket.on('usuarioCallback', function(status) {
	console.log(status);	
	
	var row1 = $('<div id="row1" class="row"></div>');
	var done = $('<div class="col-sm-6 col-sm-offset-3 text-success contentSuccessReg"></div>');

	var alertSuccess = $('<span class="alert alert-success"><img src="iconos/bien.png" class="thumbImg"><strong>Registro exitoso!</strong> El usuario ha sido asignado a la empresa correspondiente con datos completos.</span>')
	alertSuccess.css('display','block')
	done.append(alertSuccess);
	var row = $('<div class="row row-center"></div>');
	var col = $('<div class="col-sm-6 col-sm-offset-3 table-responsive"></div>');

	var table = $('<table class="table table-bordered text-primary tableSuccessReg"></table>');
	table.append('<tr><td>Cédula</td><td><strong>'+$('#cedula').val()+'</strong></td></tr>');
	table.append('<tr><td>Nombre</td><td><strong>'+$('#nombre').val()+'</strong></td></tr>');
	table.append('<tr><td>Apellidos</td><td><strong>'+$('#apellido').val()+'</strong></td></tr>');
	table.append('<tr><td>Teléfono</td><td><strong>'+$('#telefono').val()+'</strong></td></tr>');
	table.append('<tr><td>Dirección</td><td><strong>'+$('#direccion').val()+'</strong></td></tr>');

	var col2 = $('<div class="col-sm-12"></div>');

	var contentRow = $('<div class="row text-center text-bigg"></div>');
	var col2_1 = $('<div class="col-sm-12"></div>');
		if($('#empresaVin').val() == null){
			var text = $('#cedula').val() + " <span class='glyphicon glyphicon-arrow-right'></span> ?";
		}else
		{
			var text = $('#cedula').val() + " <span class='glyphicon glyphicon-arrow-right'></span> "+ $('#empresaVin').val();
		}
	col2_1.append(text);

	contentRow.append(col2_1);

	col2.append(contentRow);
	row.append(col2);

	col.append(table);
	row.append(col);
	done.append(row);
	row1.append(done);
	$('#form-regUsu')[0].reset();
	$('#alertCorreo').html('');
	$('#alertCedula').html('');
	$('#form-regUsu').hide();

	$('section.container').append(row1);
	var divButton = $('<div id="row2" class="row text-center"></div>')
	$('<button class="btn btn-primary">Volver</button>').click(function() {
		$('#row1').remove();
		$('#row2').remove();
		$('#form-regUsu').show();		
	}).appendTo(divButton);

	$('section.container').append(divButton);
	
});
=======
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);	
}
else{
	window.location = "../";
}


$(document).on('ready', function(){ Inicialize(); });
var constan = 0;
var error = 0;
var pCedula = 0;

function Inicialize() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
	}
	else
	{
		window.location = "../";
	}
	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
	$('#form-regUsu').submit(function(e){
		e.preventDefault();
		validaCamposEmpty($('#cedula'),$('#nombre'),$('#apellido'),$('#telefono'),$('#salario'),$('#fecha-ingreso'),$('#cargouOficio'));
		$('html, body').animate({scrollTop:0}, 550);
	});
	$('#caja').on('click', function(){
		var chk = $(this);
		var classCurrent = chk.attr("class");
		chk.toggleClass('btn-success').promise().done(function(){
			if(classCurrent == 'btn btn-default') {
				chk.attr('data-confirm', 'X');
			} else {
				chk.attr('data-confirm', '');
			}
		});
		
	});
	Calendar.setup (
		{
			inputField     :    "fecha-ingreso",      // id del campo de fecha
			ifFormat       :    "%d/%m/%Y",       // formato de fecha
			showsTime      :    false,            // Mostrar hora
			button         :    "buttonCalendario",   // Lanzador de calendario
			singleClick    :    true,           // modo Doble-click
			step           :    1                // show all years in drop-down boxes (instead of every other year as default)
		}
	);
	// llamamos los datos del servidor eps,afp,arl..
	cargaDatos(usuario);	
}
//_____________________________________________________________________________________________________________________________________________________
function soloLetras(e) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = [8, 37, 39, 46];

    tecla_especial = false;
    for(var i in especiales) {
        if(key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }
    if(letras.indexOf(tecla) == -1 && !tecla_especial){
		return false;
    }
}
//______________________________________________________________________________________________________________________________________________________
function EscribeSoloNumero(e,valor){
	var codigo;
	codigo = (document.all) ? e.keyCode : e.which;
	if (codigo > 31 && (codigo < 48 || codigo > 57))
	{
		$('#' + valor).css({ background: "rgba(0,0,0,.7)" });
		$('#' + valor).html('<img src="iconos/warning.png" class="miniCheckW">S&oacute;lo numeros').fadeIn();
		return false;
	}
	$('#' + valor).fadeOut();
	return true;
}
//______________________________________________________________________________________________________________________________________________________
function ValidarCedula(value){
	if(value != '') {
		var data = {
			cedula: value
		};
		$('#mensaje1').html('Validando...').fadeIn();
		socket.emit('validar cedula', data);
	}
	
	
}
//______________________________________________________________________________________________________________________________________________________
function validarcarccorreo(value){
	var re  = /^[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+\.[A-Za-z]+/;
	if (!re.test(value))
	{
		$('#alertCorreo').remove();
		$('#labelCorreo').after(' <span id="alertCorreo"><img src="iconos/bad.png" width="20"></span>');		
	}
	else
	{
		$('#alertCorreo').remove();
		$('#labelCorreo').after(' <span id="alertCorreo"><img src="iconos/good.png" width="20"></span>');
	}
}
function format(input)
{
	var num = input.value.replace(/\./g,'');
	if(!isNaN(num)){
		num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
		num = num.split('').reverse().join('').replace(/^[\.]/,'');
		input.value = num;
	}
	else{
		apprise('Solo se permiten numeros');
		$(input).focus();
		input.value = input.value.replace(/[^\d\.]*/g,'');
	}
}
//______________________________________________________________________________________________________________________________________________________
function validaCamposEmpty(){
	var i;
	var begin = false;
	$('#bContainerErrores').html('');
	for(i = 0; i < arguments.length; i++)
	{
		objeto = arguments[i];
		if(objeto.val().length == 0)
		{
			error = 1;
			begin = true;
			objeto.addClass('campoError');
			var wrapper = $('#containerErrores');

			$('#tContainerErrores').text("Estos campos son obligatorios: ").parent().show();
			$('#bContainerErrores').append("<button class='btn btn-danger btn-small' style='margin-right: 4px; margin-bottom:4px;'>" + objeto.attr("data-tag") + "</button>").show();
		}
	}
	if(begin == false)
	{
		validaCamposEspecial();
	}
		
}
//_____________________________________________________________________________________________________________________________________________________
function validaCamposEspecial(){

	correo = document.getElementById('correo').value;
	var re  = /^[A-Za-z0-9_\.]+@[A-Za-z0-9_\.]+\.[A-Za-z]+/;
	if (!re.test(correo))
	{
		error = 1;
	}
	else
	{
		error = 0;
	}

	constan = 2;
	RegistraBD(error);
}
socket.on('responseListarDatos', function(callback) {
	var empresas = callback.empresas;
	var eps = callback.eps;
	var afp = callback.afp;
	var arl = callback.arl;

	for(var a in empresas) {
		$('#empresaVin').append('<option value="'+empresas[a].nombre+'">'+empresas[a].nombre+'</option>');
	}
	for(var e in eps) {
		$('#eps').append('<option value="'+eps[e].nombre+'">'+eps[e].nombre+'</option>');
	}
	for(var i in afp) {
		$('#afp').append('<option value="'+afp[i].nombre+'">'+afp[i].nombre+'</option>');
	}
	for(var o in arl) {
		$('#arl').append('<option value="'+arl[o].nombre+'">'+arl[o].nombre+'</option>');
	}
});
socket.on('recibe cedula', function(data){
	if(data == 'existe'){
		$('#alertCedula').remove();
		$('#labelCedula').after(' <span id="alertCedula"><img src="iconos/bad.png" width="20"></span>');		
		pCedula = 1;
	}
	else if(data == 'noExiste'){
		$('#alertCedula').remove();
		$('#labelCedula').after(' <span id="alertCedula" style="vertical-align:top"><img src="iconos/good.png" width="20"></span>');
		pCedula = 0;
	}
});
socket.on('usuarioCallback', function(status) {
	console.log(status);
	
	var row1 = $('<div id="row1" class="row"></div>');
	var done = $('<div class="col-sm-6 col-sm-offset-3 text-success"></div>');

	done.append('<span><img src="iconos/bien.png" class="thumbImg"><strong>Registro exitoso!</strong> El usuario ha sido asignado a la empresa correspondiente con datos completos.:</span>');
	var row = $('<div class="row row-center"></div>');
	var col = $('<div class="col-sm-4 table-responsive"></div>');

	var table = $('<table class="table table-bordered text-primary"></table>');
	table.append('<tr><td>Cédula</td><td><strong>'+$('#cedula').val()+'</strong></td></tr>');
	table.append('<tr><td>Nombre</td><td><strong>'+$('#nombre').val()+'</strong></td></tr>');
	table.append('<tr><td>Apellidos</td><td><strong>'+$('#apellido').val()+'</strong></td></tr>');
	table.append('<tr><td>Teléfono</td><td><strong>'+$('#telefono').val()+'</strong></td></tr>');
	table.append('<tr><td>Dirección</td><td><strong>'+$('#direccion').val()+'</strong></td></tr>');

	var col2 = $('<div class="col-sm-12"></div>');

	var contentRow = $('<div class="row text-center text-bigg"></div>');
	var col2_1 = $('<div class="col-sm-12"></div>');
	var text = $('#cedula').val() + " <span class='glyphicon glyphicon-arrow-right'></span> "+ $('#empresaVin').val();
	col2_1.append(text);

	contentRow.append(col2_1);

	col2.append(contentRow);
	row.append(col2);

	col.append(table);
	row.append(col);
	done.append(row);
	row1.append(done);
	$('#form-regUsu')[0].reset();
	$('#alertCorreo').html('');
	$('#alertCedula').html('');
	$('#form-regUsu').hide();

	$('section.container').append(row1);
	var divButton = $('<div id="row2" class="row text-center"></div>')
	$('<button class="btn btn-primary">Volver</button>').click(function() {
		$('#row1').remove();
		$('#row2').remove();
		$('#form-regUsu').show();		
	}).appendTo(divButton);

	$('section.container').append(divButton);
	
});
//_____________________________________________________________________________________________________________________________________________________
function RegistraBD(valor)
{
	var wrapper = $('#containerErrores');
	wrapper.hide();
	if(valor == 1 || pCedula > 0)
	{
		apprise('Completa el formulario de registro!');
	}
	else
	{
		var caja = $('#caja').attr('data-confirm');
		var salud = 'X', riesgo = 'X', pension = 'X';
		if($('#eps').val() === '') {
			salud = '';
		}
		if($('#afp').val() === '') {
			pension = '';
		}
		if($('#arl').val() === '') {
			riesgo = '';
		}

		var localstorage = localStorage.getItem('usuario');
		var usuario = JSON.parse(localstorage);
		var inputSalario =  $('#salario').val();
		var nSalario = inputSalario.replace('.','');
		var data = {
			cedula: $('#cedula').val(),
			nombre: $('#nombre').val(),
			apellido: $('#apellido').val(),
			telefono: $('#telefono').val(),
			direccion: $('#direccion').val(),
			correo: $('#correo').val(),
			caja: caja,
			salud: salud,
			riesgo: riesgo,
			pension: pension,
			detalles: $('#detalles').val(),
			fecha_ingreso: $('#fecha-ingreso').val(),
			empresa: $('#empresa').val(),
			salario: nSalario,
			eps: $('#eps').val(),
			arl: $('#arl').val(),
			afp: $('#afp').val(),
			empleado: usuario.usuario,
			cargo: $('#cargouOficio').val(),
			empresaVin: $('#empresaVin').val()
		};
		socket.emit('add usuario', data);
	}
}
function cargaDatos(usuario) {	
	var propietario = {
		usuario: usuario.jefe
	};
	socket.emit('listarDatos', propietario);
}
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
