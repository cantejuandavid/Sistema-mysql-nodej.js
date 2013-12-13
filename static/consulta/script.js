<<<<<<< HEAD
var imgList = [];
var arrayCambios = {};
var nameList = [];
var cedula;
var consultaHecha = false;
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
$(document).ready(function(){
	consultaPorVariable();
	procesoUsuario();

	$('#form-consulta').submit(function(e){
		e.preventDefault();
		MostrarConsulta();
	});
	// vaciamos el formulario.
	$('#resultForm').get(0).reset();

	$('#eliminarUsu').click(function() {
		if(consultaHecha === true) {

			

		} else {
			apprise('Consulta primero antes de editar.');
		}
	})

	$('#editar').click(function(e){
		if(consultaHecha === true) {
			var button = $(this);
			var buttonText = button.children().next();
			var nombreUsu = $('#nombre').val(), apellidoUsu = $('#apellido').val();
			if(buttonText.text() == ' Editar'){
				apprise('Quieres editar la información de <strong>'+nombreUsu+' '+apellidoUsu+'</strong>?<br><small>(Los datos no guardados no se actualizarán)</small>', 'nombre', {'verify':true}, function(r) {
					if(r) {
						buttonText.text(' Guardar');
						button.children().first().attr('class','glyphicon glyphicon-check');
						$('#resultForm input, textarea').removeAttr('readonly');
						$('#resultForm input, textarea').removeAttr('disabled');
						$('#nombre').focus();
						saveUpdate();
					}
				});
			}
			else{			
				if(arrayCambios.cambios) {
					if(arrayCambios.cambios.length !== 0) {
						var text = '';
						for(var i in arrayCambios.cambios) {
							var v = arrayCambios.cambios[i].valor == '' ? 'Vacio': arrayCambios.cambios[i].valor
							text += '<strong>'+arrayCambios.cambios[i].id + '</strong> -> <strong>' + v +'</strong>';
							text += '<br>';
						}
										
						apprise('¿Estas seguro de actualizar este usuario con la siguiente información <br>' + text,'valorcedula',{'verify':true}, function(r) {
							if(r) {
								var data = {
									cambios: arrayCambios.cambios,
									ced: cedula
								}
								socket.emit('actualizaUsuario', data);
								console.log(data)
								apprise('Haz actualizado el usuario!');
								button.children().next().text(' Editar');
								button.children().first().attr('class','glyphicon glyphicon-edit');
								$('#resultForm input, textarea').attr('readonly','');
								$('#resultForm input, textarea').attr('disabled','');
								arrayCambios.cambios.length = 0;
							} else {
								for(var i in arrayCambios.cambios) {
									var attr = $('#'+arrayCambios.cambios[i].id).attr('data-valor');
									$('#'+arrayCambios.cambios[i].id).val(attr);							
								}
								arrayCambios.cambios.length = 0;
								$('#resultForm input, textarea').removeAttr('readonly');
								$('#resultForm input, textarea').removeAttr('disabled');
								$('#nombre').focus();								
							}
						});
					} else {
						apprise('¡No se actualizará nada!');
						button.children().next().text(' Editar');
						button.children().first().attr('class','glyphicon glyphicon-edit');
						$('#resultForm input, textarea').attr('readonly','');
						$('#resultForm input, textarea').attr('disabled','');
					}
					
				} else {
					apprise('¡No se actualizará nada!');
					button.children().next().text(' Editar');
					button.children().first().attr('class','glyphicon glyphicon-edit');
					$('#resultForm input, textarea').attr('readonly','');
					$('#resultForm input, textarea').attr('disabled','');
				}			
			}
		} else {
			apprise('Consulta primero antes de editar.');
		}
	});
});
function saveUpdate() {
	var wrapChange, ContentUpdates = [];
	$("form#resultForm :input").change(function() {	
		var id = $(this).attr('id');
		var valor = $(this).val();
		/*if(valor == '') {
			apprise('¡El campo no puede quedar vacio!',id);
			$(this).focus();
			return false;
		}*/
		wrapChange = {
			id : id,
			valor : valor 
		}
		ContentUpdates.push(wrapChange);
		arrayCambios['cambios'] = ContentUpdates;
		$(this).attr('disabled','disabled');
	});
	
}
function procesoUsuario() {
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
	$(function () {
    $('#myTab a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})
  })
}
function consultaPorVariable() {
	var variables = getURLValues();
	var cedulaURL;
	for(var e in variables) {
		cedulaURL = variables[e];
	}
	if(cedulaURL !== undefined) {
		if(cedulaURL !== '') {			
			$('#valorcedula').val(cedulaURL);
			MostrarConsulta();
		}
	}
}

function getURLValues() {
  var search = window.location.search.replace(/^\?/,'').replace(/\+/g,' ');
  var values = {};
  if (search.length) {
    var part, parts = search.split('&');
    for (var i=0, iLen=parts.length; i<iLen; i++ ) {
      part = parts[i].split('=');
      values[part[0]] = window.decodeURIComponent(part[1]);
    }
  }
  return values;
}

function popup(mylink, windowname)
			{
				if (! window.focus)return true;
				var href;
				if (typeof(mylink) == 'string')
				   href=mylink;
				else
			   href=mylink.href;
				window.open(href, windowname, 'width=700,height=450,scrollbars=yes');
			return false;
}
function Imprimir(imagen) {
   newWindow = window.open("","Imagenes","width=400,height=450,left=100,top=60");
   newWindow.document.open();
   newWindow.document.write('<html><head></head><body onload="window.print()"><img src="'+ imagen +'"/></body></html>');
   newWindow.document.close();
   newWindow.focus();
}
function verifica(evt){
	evt = (evt) ? evt : event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if(charCode==13)
	MostrarConsulta();
}


function MostrarConsulta(){
	$('#resultForm input, textarea').attr('readonly','');
	$('#resultForm input, textarea').attr('disabled','');
	
	var campo = $('#valorcedula').val();
	var estado;

	if(campo === '')
	{
		apprise('Porfavor digita la cedula','valorcedula');
	}
	else
	{
		if($("#estado").is(':checked'))
		{
	        estado = "1";
	    }
	    else
	    {
	        estado = "0";
	    }

		var data = {
			consultaUsu: true,
			cedula: campo,
			estado: estado,
			empleado: usuario.usuario
		};
		socket.emit('consulta', data);
	}
}
function cerrarPreview(){
    $('.divPreviewBig').remove();
}
function cambiaImg(e){
    var valor = e.getAttribute('data-guia');
    var img = $('.imgPreviewBig');
    var name = $('.nameImg');
    var src = img.attr('src');
    var index = imgList.indexOf(src);
    var point;
    if(valor == 'left'){
        if(index > 0){
           point = index-1;
        }
    }
    else if(valor == 'right'){
        if(index < imgList.length-1)
        {
            point = index+1;
        }
    }
    var newName = nameList[point];
    var newImg = imgList[point];
    img.attr({src: newImg});
    if(typeof newName != 'undefined')
    {
        name.html(newName + '<button class="buttonCerrar" onclick="cerrarPreview()">X</button>' );
    }
}
socket.on('consulta hecha', function(data){
	if(data == 'noExiste'){
		apprise('Usuario no existe','valorcedula')
	}
	else{
		consultaHecha = true;
		$('.error').remove();
		$('#accionSelect').removeAttr('disabled');
		cedula = data.data.cedula;
		$('#nombre').val(data.data.nombre).attr('data-valor',data.data.nombre);
		$('#apellido').val(data.data.apellido).attr('data-valor',data.data.apellido);
		$('#telefono').val(data.data.telefono).attr('data-valor',data.data.telefono);
		$('#direccion').val(data.data.direccion).attr('data-valor',data.data.direccion);
		$('#correo').val(data.data.correo).attr('data-valor',data.data.correo);
		$('#afp').val(data.data.afp).attr('data-valor',data.data.afp);
		$('#eps').val(data.data.eps).attr('data-valor',data.data.eps);
		$('#arl').val(data.data.arl).attr('data-valor',data.data.arl);
		$('#caja').val(data.data.caja).attr('data-valor',data.data.caja);
		$('#fechaRegistro').val(data.data.fecha).attr('data-valor',data.data.fecha);
		$('#empresaVin').val(data.data.empresaVin).attr('data-valor',data.data.empresaVin);
		$('#fechaIngreso').val(data.data.fechaIngreso).attr('data-valor',data.data.fechaIngreso);
		$('#cargo').val(data.data.cargo).attr('data-valor',data.data.cargo);
		$('#salario').val(data.data.salario).attr('data-valor',data.data.salario);
		$('#mensualidad').text(accounting.formatMoney(parseInt(data.data.mensualidad),'$', 0, '.')).attr('data-valor',data.data.mensualidad);
		$('#detalles').val(data.data.detalles).attr('data-valor',data.data.detalles);
		$('#usuarioPlanilla').val(data.data.userPlanilla).attr('data-valor',data.data.userPlanilla);
		$('#passPlanilla').val(data.data.passPlanilla).attr('data-valor',data.data.passPlanilla);
		if(data.data.estado == 'Activo') {
			$('#estadoC').text(data.data.estado).attr('class','label label-success');
		} else {
			$('#estadoC').text(data.data.estado).attr('class','label label-danger');
		}
		$('#listaImagenes').html('');
		$('#listaRegistro').html('');

		var imagenes1 = JSON.stringify(data.imagenes);
		var imagen = JSON.parse(imagenes1);
		if(imagen.imagen != 'no hay'){
			var li, a;
			for(var i = 0; i < data.imagenes.length; i++){
				(function(i) {
					li = $('<li class="liImg"></li>');
					li.append('<span>'+imagen[i].ruta+'</span>');
					a = $('<div style="display:none;"></div>');
					a.append('<a href="../'+imagen[i].ruta+'" target="_blank"><img src="../'+imagen[i].ruta+'" alt="dsds" class="imgScreenShot" /></a>')
					li.append(a);
					
					imgList.push("../" + imagen[i].ruta);
					nameList.push(imagen[i].ruta);

					li.on('click', function(){
						var div = $('<div></div>');
						div.addClass("divPreviewBig");
						div.append('<span class="nameImg">'+ imagen[i].ruta +' <a href="../visor.html?var1=../'+imagen[i].ruta+'">Imprimir</a><button class="buttonCerrar" onclick="cerrarPreview()">X</button></span>'+
			            '<div class="wrapBotonsPre">'+
			                '<span class="leftDir" data-guia="left" title="Anterior" onclick="cambiaImg(this)">&laquo;</span>'+
			                '<span class="rightDir" data-guia="right" onclick="cambiaImg(this)" title="siguiente">&raquo</span>'+
			                '<img src="../'+ imagen[i].ruta +'" class="imgPreviewBig" />'+
			            '</div>');

	                    $('.containeForm').append(div);
					});
					$('#listaImagenes').append(li);
			  	}(i));
			}
		}
		else{
			$('#listaImagenes').append('<li>No hay</li>')
		}
		
		var registroString = JSON.stringify(data.registros);
		var registroParse = JSON.parse(registroString);
		if(registroParse.registro != 'no hay'){
			for(var i = 0; i < data.registros.length; i++){
				$('#listaRegistro').append('<li>' + registroParse[i].caso + ' - ' + registroParse[i].fecha+ '</li>')
			}
		}
		else{
			$('#listaRegistro').append('<li>No hay</li>')
		}
		
	}
=======
var imgList = [];
var arrayCambios = {};
var nameList = [];
var cedula;
var consultaHecha = false;
var socket = io.connect('/');
if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}
$(document).ready(function(){
	consultaPorVariable();
	procesoUsuario();

	$('#form-consulta').submit(function(e){
		e.preventDefault();
		MostrarConsulta();
	});
	// vaciamos el formulario.
	$('#resultForm').get(0).reset();

	$('#eliminarUsu').click(function() {
		if(consultaHecha === true) {

			

		} else {
			apprise('Consulta primero antes de editar.');
		}
	})

	$('#editar').click(function(e){
		if(consultaHecha === true) {
			var button = $(this);
			var buttonText = button.children().next();
			var nombreUsu = $('#nombre').val(), apellidoUsu = $('#apellido').val();
			if(buttonText.text() == ' Editar'){
				apprise('Quieres editar la información de <strong>'+nombreUsu+' '+apellidoUsu+'</strong>?<br><small>(Los datos no guardados no se actualizarán)</small>', 'nombre', {'verify':true}, function(r) {
					if(r) {
						buttonText.text(' Guardar');
						button.children().first().attr('class','glyphicon glyphicon-check');
						$('#resultForm input, textarea').removeAttr('readonly');
						$('#resultForm input, textarea').removeAttr('disabled');
						$('#nombre').focus();
						saveUpdate();
					}
				});
			}
			else{			
				if(arrayCambios.cambios) {
					if(arrayCambios.cambios.length !== 0) {
						var text = '';
						for(var i in arrayCambios.cambios) {
							text += '<strong>'+arrayCambios.cambios[i].id + '</strong> -> <strong>' + arrayCambios.cambios[i].valor+'</strong>';
							text += '<br>';
						}
										
						apprise('¿Estas seguro de actualizar este usuario con la siguiente información <br>' + text,'valorcedula',{'verify':true}, function(r) {
							if(r) {
								var data = {
									cambios: arrayCambios.cambios,
									ced: cedula
								}
								socket.emit('actualizaUsuario', data);
								apprise('Haz actualizado el usuario!');
								button.children().next().text(' Editar');
								button.children().first().attr('class','glyphicon glyphicon-edit');
								$('#resultForm input, textarea').attr('readonly','');
								$('#resultForm input, textarea').attr('disabled','');
								arrayCambios.cambios.length = 0;
							} else {
								for(var i in arrayCambios.cambios) {
									var attr = $('#'+arrayCambios.cambios[i].id).attr('data-valor');
									$('#'+arrayCambios.cambios[i].id).val(attr);							
								}
								arrayCambios.cambios.length = 0;
								$('#resultForm input, textarea').removeAttr('readonly');
								$('#resultForm input, textarea').removeAttr('disabled');
								$('#nombre').focus();								
							}
						});
					} else {
						apprise('¡No se actualizará nada!');
						button.children().next().text(' Editar');
						button.children().first().attr('class','glyphicon glyphicon-edit');
						$('#resultForm input, textarea').attr('readonly','');
						$('#resultForm input, textarea').attr('disabled','');
					}
					
				} else {
					apprise('¡No se actualizará nada!');
					button.children().next().text(' Editar');
					button.children().first().attr('class','glyphicon glyphicon-edit');
					$('#resultForm input, textarea').attr('readonly','');
					$('#resultForm input, textarea').attr('disabled','');
				}			
			}
		} else {
			apprise('Consulta primero antes de editar.');
		}
	});
});
function saveUpdate() {
	var wrapChange, ContentUpdates = [];
	$("form#resultForm :input").change(function() {	
		var id = $(this).attr('id');
		var valor = $(this).val();
		if(valor == '') {
			apprise('¡El campo no puede quedar vacio!',id);
			$(this).focus();
			return false;
		}
		wrapChange = {
			id : id,
			valor : valor 
		}
		ContentUpdates.push(wrapChange);
		arrayCambios['cambios'] = ContentUpdates;
		$(this).attr('disabled','disabled');
	});
	
}
function procesoUsuario() {
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
	$(function () {
    $('#myTab a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})
  })
}
function consultaPorVariable() {
	var variables = getURLValues();
	var cedulaURL;
	for(var e in variables) {
		cedulaURL = variables[e];
	}
	if(cedulaURL !== undefined) {
		if(cedulaURL !== '') {			
			$('#valorcedula').val(cedulaURL);
			MostrarConsulta();
		}
	}
}

function getURLValues() {
  var search = window.location.search.replace(/^\?/,'').replace(/\+/g,' ');
  var values = {};
  if (search.length) {
    var part, parts = search.split('&');
    for (var i=0, iLen=parts.length; i<iLen; i++ ) {
      part = parts[i].split('=');
      values[part[0]] = window.decodeURIComponent(part[1]);
    }
  }
  return values;
}

function popup(mylink, windowname)
			{
				if (! window.focus)return true;
				var href;
				if (typeof(mylink) == 'string')
				   href=mylink;
				else
			   href=mylink.href;
				window.open(href, windowname, 'width=700,height=450,scrollbars=yes');
			return false;
}
function Imprimir(imagen) {
   newWindow = window.open("","Imagenes","width=400,height=450,left=100,top=60");
   newWindow.document.open();
   newWindow.document.write('<html><head></head><body onload="window.print()"><img src="'+ imagen +'"/></body></html>');
   newWindow.document.close();
   newWindow.focus();
}
function verifica(evt){
	evt = (evt) ? evt : event;
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if(charCode==13)
	MostrarConsulta();
}


function MostrarConsulta(){
	$('#resultForm input, textarea').attr('readonly','');
	$('#resultForm input, textarea').attr('disabled','');
	
	var campo = $('#valorcedula').val();
	var estado;

	if(campo === '')
	{
		apprise('Porfavor digita la cedula','valorcedula');
	}
	else
	{
		if($("#estado").is(':checked'))
		{
	        estado = "1";
	    }
	    else
	    {
	        estado = "0";
	    }

		var data = {
			consultaUsu: true,
			cedula: campo,
			estado: estado,
			empleado: usuario.usuario
		};
		socket.emit('consulta', data);
	}
}
function cerrarPreview(){
    $('.divPreviewBig').remove();
}
function cambiaImg(e){
    var valor = e.getAttribute('data-guia');
    var img = $('.imgPreviewBig');
    var name = $('.nameImg');
    var src = img.attr('src');
    var index = imgList.indexOf(src);
    var point;
    if(valor == 'left'){
        if(index > 0){
           point = index-1;
        }
    }
    else if(valor == 'right'){
        if(index < imgList.length-1)
        {
            point = index+1;
        }
    }
    var newName = nameList[point];
    var newImg = imgList[point];
    img.attr({src: newImg});
    if(typeof newName != 'undefined')
    {
        name.html(newName + '<button class="buttonCerrar" onclick="cerrarPreview()">X</button>' );
    }
}
socket.on('consulta hecha', function(data){
	if(data == 'noExiste'){
		apprise('Usuario no existe','valorcedula');
	}
	else{
		consultaHecha = true;
		$('.error').remove();
		$('#accionSelect').removeAttr('disabled');
		cedula = data.data.cedula;
		$('#nombre').val(data.data.nombre).attr('data-valor',data.data.nombre);
		$('#apellido').val(data.data.apellido).attr('data-valor',data.data.apellido);
		$('#telefono').val(data.data.telefono).attr('data-valor',data.data.telefono);
		$('#direccion').val(data.data.direccion).attr('data-valor',data.data.direccion);
		$('#correo').val(data.data.correo).attr('data-valor',data.data.correo);
		$('#afp').val(data.data.afp).attr('data-valor',data.data.afp);
		$('#eps').val(data.data.eps).attr('data-valor',data.data.eps);
		$('#arl').val(data.data.arl).attr('data-valor',data.data.arl);
		$('#caja').val(data.data.caja).attr('data-valor',data.data.caja);
		$('#fechaRegistro').val(data.data.fecha).attr('data-valor',data.data.fecha);
		$('#empresaVin').val(data.data.empresaVin).attr('data-valor',data.data.empresaVin);
		$('#fechaIngreso').val(data.data.fechaIngreso).attr('data-valor',data.data.fechaIngreso);
		$('#cargo').val(data.data.cargo).attr('data-valor',data.data.cargo);
		$('#salario').val(data.data.salario).attr('data-valor',data.data.salario);
		$('#mensualidad').text('$'+data.data.mensualidad).attr('data-valor',data.data.mensualidad);
		$('#detalles').val(data.data.detalles).attr('data-valor',data.data.detalles);
		if(data.data.estado == 'Activo') {
			$('#estadoC').text(data.data.estado).attr('class','label label-success');
		} else {
			$('#estadoC').text(data.data.estado).attr('class','label label-danger');
		}
		$('#listaImagenes').html('');
		$('#listaRegistro').html('');

		var imagenes1 = JSON.stringify(data.imagenes);
		var imagen = JSON.parse(imagenes1);
		if(imagen.imagen != 'no hay'){
			var li, a;
			for(var i = 0; i < data.imagenes.length; i++){
				(function(i) {
					li = $('<li class="liImg"></li>');
					li.append('<span>'+imagen[i].ruta+'</span>');
					a = $('<div style="display:none;"></div>');
					a.append('<a href="../'+imagen[i].ruta+'" target="_blank"><img src="../'+imagen[i].ruta+'" alt="dsds" class="imgScreenShot" /></a>')
					li.append(a);
					
					imgList.push("../" + imagen[i].ruta);
					nameList.push(imagen[i].ruta);

					li.on('click', function(){
						var div = $('<div></div>');
						div.addClass("divPreviewBig");
						div.append('<span class="nameImg">'+ imagen[i].ruta +' <a href="../visor.html?var1=../'+imagen[i].ruta+'">Imprimir</a><button class="buttonCerrar" onclick="cerrarPreview()">X</button></span>'+
			            '<div class="wrapBotonsPre">'+
			                '<span class="leftDir" data-guia="left" title="Anterior" onclick="cambiaImg(this)">&laquo;</span>'+
			                '<span class="rightDir" data-guia="right" onclick="cambiaImg(this)" title="siguiente">&raquo</span>'+
			                '<img src="../'+ imagen[i].ruta +'" class="imgPreviewBig" />'+
			            '</div>');

	                    $('.containeForm').append(div);
					});
					$('#listaImagenes').append(li);
			  	}(i));
			}
		}
		else{
			$('#listaImagenes').append('<li>No hay</li>')
		}
		
		var registroString = JSON.stringify(data.registros);
		var registroParse = JSON.parse(registroString);
		if(registroParse.registro != 'no hay'){
			for(var i = 0; i < data.registros.length; i++){
				$('#listaRegistro').append('<li>' + registroParse[i].caso + ' - ' + registroParse[i].fecha+ '</li>')
			}
		}
		else{
			$('#listaRegistro').append('<li>No hay</li>')
		}
		
	}
>>>>>>> 7666d55568f96ceff9e9b2fcb279a904e05a85a0
});