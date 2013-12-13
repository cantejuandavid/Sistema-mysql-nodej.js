<<<<<<< HEAD
 var error;
 function EscribeSoloNumero(e,valor){
	var codigo;
	codigo = (document.all) ? e.keyCode : e.which;
	if (codigo > 31 && (codigo < 48 || codigo > 57))
	{
		$('#' + valor).css({ background: "rgba(0,0,0,.7)" });
		$('#' + valor).html('<img src="../registro/iconos/warning.png" class="miniCheckW">S&oacute;lo numeros').fadeIn();
		return false;
	}
	$('#' + valor).fadeOut();
	return true;
}
function funLogout()
{
	localStorage.removeItem('usuario');
	$('#welcomeUser').hide();
	$('#form-login')[0].reset();
	$('#form-login').fadeIn();
}
function funEnter(){
	window.location.assign("lobby/");
}
function insertInfo()
{
	var session = localStorage.getItem('usuario');
	var usuario = JSON.parse(session);
	$('.alert').hide();
	$('#form-login').hide();
	$('#welcomeUser>h3').html("Bienvenido <strong>" + usuario.nombre + "</strong>");
	$('#welcomeUser').show();
	$('#avatar').attr('src', 'img/logos/' +  usuario.tipo + '.png');
}
  $(document).on('ready', function(){
    if( typeof(window.localStorage) != "undefined" || typeof(window.localStorage) != "null" )
    {
      if(window.localStorage.getItem('usuario') !== null)
        insertInfo()
    }

    $('#showRegistro').on('click', function(e){
    	$('.alert').hide()
		$('#form-login').hide()
		$('#form-reg').fadeIn()
		$('#form-login')[0].reset()
    })

    $('#showLogin').on('click', function(){
      $('#form-reg').hide()
      $('#form-login').fadeIn()
      $('#form-reg')[0].reset()
      $('#usuarioLogin').focus()
    })

	$('#form-login').submit(function(e){
		e.preventDefault()
		var user = $('#usuarioLogin').val(), pass = $('#ctaLogin').val();
		var usuario = user.replace(/\s/g,'');
		var password = pass.replace(/\s/g,'');

		if(usuario.length === 0 || password.length === 0)
		{
			$('#alert-login>span').html('Todos los campos son necesarios!');
			$('#alert-login').show();
			return false;
		}
		var data = {
			consulta: true,
			usuario: usuario,
			cta: password
		};
		
		socket.emit('login', data);
		$('#loadLogin').css('display', 'block');
	});
var socket  = io.connect('/');

	socket.on('loginCallback', function(status){
		$('#loadLogin').css('display', 'none');
		$('.overlay-small').hide();
		if(status == 'contraseña invalida' || status == 'no existe')
		{
			$('#alert-login>span').html('Usuario o contraseña inválida!');
			$('#alert-login').show();
			$('#form-login')[0].reset();
		}
		else {
			localStorage.setItem('usuario', JSON.stringify(status));
			insertInfo();
		}
	});

	$('#form-reg').submit(function(e){
		e.preventDefault();

		var user = escape($('#usuario').val()), pass = escape($('#cta').val()), tipo = escape($('#tipo').val());
		var usuario = user.replace(/\?/g, '');
		var password = pass.replace(/\?/g, '');
		var name = $('#nombre').val();		
		var cedula = $('#cedula').val();
		var nombre = $.trim(name.replace(/[^A-Za-z\s]+/g, ''));

		if(usuario.length === 0 || password.length === 0 || nombre.length === 0 || cedula.length === 0) {
			$('#alert-reg>span').html('Todos los campos son necesarios!');
			$('#alert-reg').attr('class','alert alert-danger').show();
			return false;
		}
		var charIlegal = /\W/;
			if (charIlegal.test(usuario) || charIlegal.test(password)) {
				$('#alert-reg>span').html('No se aceptan caracteres raros ni espacios!');
				$('#alert-reg').attr('class','alert alert-danger').show();
				return false;
			}
		var data = {
			registra: 'si',
			usuario: usuario,
			cta: password,
			nombre: nombre,
			tipo: tipo,
			cedula: cedula
		};
		var socket  = io.connect('/');
		socket.emit('registro', data);
		$('#loadReg').css('display', 'block');

		socket.on('listoEmpleado', function(status){
			$('#loadReg').css('display', 'none');
			if(status == "existe"){
				$('#alert-reg>span').html('Usuario ya existe!');
				$('#alert-reg').attr('class','alert alert-danger').show();
			}
			else
			{
				$('#alert-reg>span').html('<img src="img/check-mark-hi.png" class="thumbImg"><strong>Registro exitoso</strong> se ha llenado correctamente!');
				$('#alert-reg').attr('class','alert alert-success').show();
			}
		});
	});
});

=======
 var error;
 function EscribeSoloNumero(e,valor){
	var codigo;
	codigo = (document.all) ? e.keyCode : e.which;
	if (codigo > 31 && (codigo < 48 || codigo > 57))
	{
		$('#' + valor).css({ background: "rgba(0,0,0,.7)" });
		$('#' + valor).html('<img src="../registro/iconos/warning.png" class="miniCheckW">S&oacute;lo numeros').fadeIn();
		return false;
	}
	$('#' + valor).fadeOut();
	return true;
}
function funLogout()
{
	localStorage.removeItem('usuario');
	$('#welcomeSiempre').hide();
	$('#form-login')[0].reset();
	$('#form-login').fadeIn();
}
function funEnter(){
	window.location.assign("lobby/");
}
function insertInfo()
{
	var session = localStorage.getItem('usuario');
	var usuario = JSON.parse(session);
	$('.alert').hide();
	$('#form-login').hide();
	$('#welcomeSiempre>h3').html("Bienvenido <strong>" + usuario.nombre + "</strong>");
	$('#welcomeSiempre').show();
	$('#avatar').attr('src', 'img/logos/' +  usuario.tipo + '.png');
}
  $(document).on('ready', function(){
    if( typeof(window.localStorage) != "undefined" || typeof(window.localStorage) != "null" )
    {
      if(window.localStorage.getItem('usuario') !== null){
        insertInfo();
      }
    }

    $('#showRegistro').on('click', function(e){
    	$('.alert').hide();
		$('#form-login').hide();
		$('#form-reg').fadeIn();
		$('#form-login')[0].reset();
    });

    $('#showLogin').on('click', function(){
      $('#form-reg').hide();
      $('#form-login').fadeIn();
      $('#form-reg')[0].reset();
    });

	$('#form-login').submit(function(e){
		e.preventDefault();
		var user = $('#usuarioLogin').val(), pass = $('#ctaLogin').val();
		var usuario = user.replace(/\s/g,'');
		var password = pass.replace(/\s/g,'');

		if(usuario.length === 0 || password.length === 0)
		{
			$('#alert-login>span').html('Todos los campos son necesarios!');
			$('#alert-login').show();
			return false;
		}
		var data = {
			consulta: true,
			usuario: usuario,
			cta: password
		};
		
		socket.emit('login', data);
		$('#loadLogin').css('display', 'block');
	});
var socket  = io.connect('/');
	socket.on('loginCallback', function(status){
		$('#loadLogin').css('display', 'none');
		$('.overlay-small').hide();
		if(status == 'contraseña invalida' || status == 'no existe')
		{
			$('#alert-login>span').html('Usuario o contraseña inválida!');
			$('#alert-login').show();
			$('#form-login')[0].reset();
		}
		else {
			localStorage.setItem('usuario', JSON.stringify(status));
			insertInfo();
		}
	});

	$('#form-reg').submit(function(e){
		e.preventDefault();

		var user = escape($('#usuario').val()), pass = escape($('#cta').val()), tipo = escape($('#tipo').val());
		var usuario = user.replace(/\?/g, '');
		var password = pass.replace(/\?/g, '');
		var name = $('#nombre').val();		
		var cedula = $('#cedula').val();
		var nombre = $.trim(name.replace(/[^A-Za-z\s]+/g, ''));

		if(usuario.length === 0 || password.length === 0 || nombre.length === 0 || cedula.length === 0) {
			$('#alert-reg>span').html('Todos los campos son necesarios!');
			$('#alert-reg').attr('class','alert alert-danger').show();
			return false;
		}
		var charIlegal = /\W/;
			if (charIlegal.test(usuario) || charIlegal.test(password)) {
				$('#alert-reg>span').html('No se aceptan caracteres raros ni espacios!');
				$('#alert-reg').attr('class','alert alert-danger').show();
				return false;
			}
		var data = {
			registra: 'si',
			usuario: usuario,
			cta: password,
			nombre: nombre,
			tipo: tipo,
			cedula: cedula
		};
		var socket  = io.connect('/');
		socket.emit('registro', data);
		$('#loadReg').css('display', 'block');

		socket.on('listoEmpleado', function(status){
			$('#loadReg').css('display', 'none');
			if(status == "existe"){
				$('#alert-reg>span').html('Usuario ya existe!');
				$('#alert-reg').attr('class','alert alert-danger').show();
			}
			else
			{
				$('#alert-reg>span').html('<img src="img/check-mark-hi.png" class="thumbImg"><strong>Registro exitoso</strong> se ha llenado correctamente!');
				$('#alert-reg').attr('class','alert alert-success').show();
			}
		});
	});
});

>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
