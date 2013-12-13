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
		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
	}
	else
	{
		window.location = "../";
	}
	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
	var data = {
		usuario: usuario.usuario
	}
	socket.emit('metasEmpleado', data);
	socket.on('metasComplete', function(data){
		if(data == 'usuario no existe'){
			
		}
		else{
			$('#h1metaRegistros').text(data.metaRegistros);
			$('#h1metaConsultas').text(data.metaConsultas);
			$('#h1metaModificaciones').text(data.metaModificaciones);
			$('#h1metaSesiones').text(data.metaSesiones);			
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
		$('.divider').after("<li id='userHide'><a><img src='../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
		if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
	}
	else
	{
		window.location = "../";
	}
	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
	var data = {
		usuario: usuario.usuario
	}
	socket.emit('metasEmpleado', data);
	socket.on('metasComplete', function(data){
		if(data == 'usuario no existe'){
			
		}
		else{
			$('#h1metaRegistros').text(data.metaRegistros);
			$('#h1metaConsultas').text(data.metaConsultas);
			$('#h1metaModificaciones').text(data.metaModificaciones);
			$('#h1metaSesiones').text(data.metaSesiones);			
		}
	});

});
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
