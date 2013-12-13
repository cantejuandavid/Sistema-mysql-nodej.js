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
		} else {
			window.location = "../";
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

	socket.emit('requestEmpMetas');

	socket.on('responseEmpMetas', function(data){
		var var1 = JSON.stringify(data.empleado);
		var var2 = JSON.parse(var1);
		var rowCount = $('#tableMetaEmpleados tr').length;
		
		var total = var2.metaRegistros+var2.metaConsultas+var2.metaModificaciones+var2.metaSesiones;
		var tr = $('<tr data-userUpd="'+var2.usuario+'"></tr>');
		tr.append('<td>'+rowCount+'</td>');
		tr.append('<td>'+var2.usuario+'</td>');
		tr.append('<td class="meta">'+var2.metaRegistros+'</td>');
		tr.append('<td class="meta">'+var2.metaConsultas+'</td>');
		tr.append('<td class="meta">'+var2.metaModificaciones+'</td>');
		tr.append('<td class="meta">'+var2.metaSesiones+'</td>');
		tr.append('<td class="meta">'+total+'</td>');
		$('<td><button class="accion" data-usuario="'+var2.usuario+'">Vaciar</button></td>').on('click', function() {
			$(this).parent().find('.meta').text('0');
			var usuario = $(this).children().attr('data-usuario');
			var data = {
				usuario: usuario
			};
			socket.emit('vaciaMetasEmp', data);
		}).appendTo(tr);
		$('#tableMetaEmpleados>tbody').append(tr);
		$('#tableMetaEmpleados').tablesorter();
	});
	socket.on('updateMetaEmp', function(data) {
		var var1 = JSON.stringify(data.empleado);
		var var2 = JSON.parse(var1);
		var total = var2.metaRegistros+var2.metaConsultas+var2.metaModificaciones+var2.metaSesiones;
		var tr = $('<tr data-userUpd="'+var2.usuario+'"></tr>');
		tr.append('<td>'+var2.usuario+'</td>');
		tr.append('<td class="meta">'+var2.metaRegistros+'</td>');
		tr.append('<td class="meta">'+var2.metaConsultas+'</td>');
		tr.append('<td class="meta">'+var2.metaModificaciones+'</td>');
		tr.append('<td class="meta">'+var2.metaSesiones+'</td>');
		tr.append('<td class="meta">'+total+'</td>');
		$('<td><button class="accion" data-usuario="'+var2.usuario+'">Vaciar</button></td>').on('click', function() {
			var usuario = $(this).children().attr('data-usuario');
			var data = {
				usuario: usuario
			};
			socket.emit('vaciaMetasEmp', data);
		}).appendTo(tr);
		var trnew = tr.html();
		var trOld = $('#tableMetaEmpleados>tbody').find('[data-userUpd="'+var2.usuario+'"]');
		var numero = trOld.children().first().html();
		trOld.html('').html('<td>'+numero+'</td>'+trnew);
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
		} else {
			window.location = "../";
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

	socket.emit('requestEmpMetas');

	socket.on('responseEmpMetas', function(data){
		var var1 = JSON.stringify(data.empleado);
		var var2 = JSON.parse(var1);
		var rowCount = $('#tableMetaEmpleados tr').length;
		
		var total = var2.metaRegistros+var2.metaConsultas+var2.metaModificaciones+var2.metaSesiones;
		var tr = $('<tr data-userUpd="'+var2.usuario+'"></tr>');
		tr.append('<td>'+rowCount+'</td>');
		tr.append('<td>'+var2.usuario+'</td>');
		tr.append('<td class="meta">'+var2.metaRegistros+'</td>');
		tr.append('<td class="meta">'+var2.metaConsultas+'</td>');
		tr.append('<td class="meta">'+var2.metaModificaciones+'</td>');
		tr.append('<td class="meta">'+var2.metaSesiones+'</td>');
		tr.append('<td class="meta">'+total+'</td>');
		$('<td><button class="accion" data-usuario="'+var2.usuario+'">Vaciar</button></td>').on('click', function() {
			$(this).parent().find('.meta').text('0');
			var usuario = $(this).children().attr('data-usuario');
			var data = {
				usuario: usuario
			};
			socket.emit('vaciaMetasEmp', data);
		}).appendTo(tr);
		$('#tableMetaEmpleados>tbody').append(tr);
		$('#tableMetaEmpleados').tablesorter();
	});
	socket.on('updateMetaEmp', function(data) {
		var var1 = JSON.stringify(data.empleado);
		var var2 = JSON.parse(var1);
		var total = var2.metaRegistros+var2.metaConsultas+var2.metaModificaciones+var2.metaSesiones;
		var tr = $('<tr data-userUpd="'+var2.usuario+'"></tr>');
		tr.append('<td>'+var2.usuario+'</td>');
		tr.append('<td class="meta">'+var2.metaRegistros+'</td>');
		tr.append('<td class="meta">'+var2.metaConsultas+'</td>');
		tr.append('<td class="meta">'+var2.metaModificaciones+'</td>');
		tr.append('<td class="meta">'+var2.metaSesiones+'</td>');
		tr.append('<td class="meta">'+total+'</td>');
		$('<td><button class="accion" data-usuario="'+var2.usuario+'">Vaciar</button></td>').on('click', function() {
			var usuario = $(this).children().attr('data-usuario');
			var data = {
				usuario: usuario
			};
			socket.emit('vaciaMetasEmp', data);
		}).appendTo(tr);
		var trnew = tr.html();
		var trOld = $('#tableMetaEmpleados>tbody').find('[data-userUpd="'+var2.usuario+'"]');
		var numero = trOld.children().first().html();
		trOld.html('').html('<td>'+numero+'</td>'+trnew);
	});

>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
});