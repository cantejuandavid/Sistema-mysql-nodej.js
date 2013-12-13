<<<<<<< HEAD
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);	
}
else{
	window.location = "../";
}
$(document).on('ready', function(){
	if(localStorage.usuario)
	{		
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);		
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('#usuarioMicuenta').val(usuario.usuario);
		$('#nombreMicuenta').val(usuario.nombre);
		$('#tipoMicuenta').val(usuario.tipo);
		$('#cedulaMicuenta').val(usuario.cedula);
		$('#nombreMicuentaH1').text(usuario.nombre);
		$('#imgPerfil').attr('src', '../img/logos/' + usuario.tipo + '.png');
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
	$('#buttonShowCamPass').on('click', function(){
		$('.alert').hide();
		$('#form-Micuenta').hide();
		$('#form-cambiaPassMicuenta').show();
	});
	$('#regresaMicuenta').on('click', function(){
		$('#form-cambiaPassMicuenta').hide();
		$('#form-Micuenta').show();
	});
	$('#form-cambiaPassMicuenta').submit(function(e){
		e.preventDefault();
		var oldpassword = $('#passOld').val();
		var newpass = $('#passNew').val();
		var newpassrep = $('#passNewRep').val();
		if(oldpassword.length == 0 || newpass.length == 0 || newpassrep.length == 0) {
			$('#alert-login>span').html('Todos los campos son necesarios!');
			$('#alert-login').show();
			return false;
		} else {
			if(newpass == newpassrep) {

				var data = {
					usuario: usuario.usuario,
					oldpassword: oldpassword,
					newpass: newpass
				};
				socket.emit('cambiaPass', data);

			} else {
				$('#alert-login>span').html('Las contraseñas no coinciden!');
				$('#alert-login').show();
				return false;
			}
		}
	});
	socket.on('cambiaPassComplete', function(status){
		if(status == "no existe"){
			apprise('Usuario no exite!');
		}
		else if (status == "contraseña invalida") {
			$('#alert-login>span').html('La contraseña es incorrecta!');
			$('#alert-login').show();
			return false;
		}
		else if(status == "contraseña actualizada") {
			apprise('La ha contraseña ha sido actualizada');
			$('#form-cambiaPassMicuenta').hide();
			$('#form-Micuenta').show();
		}
		
	});
});
=======
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);	
}
else{
	window.location = "../";
}
$(document).on('ready', function(){
	if(localStorage.usuario)
	{		
		$('#nameUser>a').html("<img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);		
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('#usuarioMicuenta').val(usuario.usuario);
		$('#nombreMicuenta').val(usuario.nombre);
		$('#tipoMicuenta').val(usuario.tipo);
		$('#cedulaMicuenta').val(usuario.cedula);
		$('#nombreMicuentaH1').text(usuario.nombre);
		$('#imgPerfil').attr('src', '../img/logos/' + usuario.tipo + '.png');
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
	$('#buttonShowCamPass').on('click', function(){
		$('.alert').hide();
		$('#form-Micuenta').hide();
		$('#form-cambiaPassMicuenta').show();
	});
	$('#regresaMicuenta').on('click', function(){
		$('#form-cambiaPassMicuenta').hide();
		$('#form-Micuenta').show();
	});
	$('#form-cambiaPassMicuenta').submit(function(e){
		e.preventDefault();
		var oldpassword = $('#passOld').val();
		var newpass = $('#passNew').val();
		var newpassrep = $('#passNewRep').val();
		if(oldpassword.length == 0 || newpass.length == 0 || newpassrep.length == 0) {
			$('#alert-login>span').html('Todos los campos son necesarios!');
			$('#alert-login').show();
			return false;
		} else {
			if(newpass == newpassrep) {

				var data = {
					usuario: usuario.usuario,
					oldpassword: oldpassword,
					newpass: newpass
				};
				socket.emit('cambiaPass', data);

			} else {
				$('#alert-login>span').html('Las contraseñas no coinciden!');
				$('#alert-login').show();
				return false;
			}
		}
	});
	socket.on('cambiaPassComplete', function(status){
		if(status == "no existe"){
			apprise('Usuario no exite!');
		}
		else if (status == "contraseña invalida") {
			$('#alert-login>span').html('La contraseña es incorrecta!');
			$('#alert-login').show();
			return false;
		}
		else if(status == "contraseña actualizada") {
			apprise('La ha contraseña ha sido actualizada');
			$('#form-cambiaPassMicuenta').hide();
			$('#form-Micuenta').show();
		}
		
	});
});
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
