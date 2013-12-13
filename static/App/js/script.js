if(localStorage.usuario) {
	var usuario = JSON.parse(localStorage.usuario);
}
else{
	window.location = "../";
}

$(document).ready(function(){
	procesoUsuario()
	formTodo()
	userEdit()
	
})
var socket  = io.connect('/');

function procesoUsuario() {
	if(localStorage.usuario)
	{
		$('#nameUser>a').html("<img src='../../img/logos/" + usuario.tipo + ".png' class='avatar-s'>" +usuario.usuario);
				if(usuario.tipo == 'jefe') {
			$('#liMetas').after('<li><a href="../metasEmpleados/">Metas de empleados</a></li>');
		}
		$('.divider').after("<li id='userHide'><a><img src='../../img/logos/" + usuario.tipo + ".png' class='avatar-s'>"+usuario.usuario+"</li></a><li class='divider'></li>");
	}
	else
	{
		window.location = "../";
	}
	$('#logout').on('click', function(){
		localStorage.removeItem('usuario');
		window.location = "../";
	});
}
function userEdit() {
	$('#formEdit').submit(function(e){
		e.preventDefault()		
		
		var data = {
			ced: $('#cedEdit').val(),
			name: $('#nameEdit').val(),
			lastN: $('#lastNEdit').val(),
			user: $('#userEdit').val(),
			pass: $('#passEdit').val(),
			mail: $('#mailEdit').val()	
		}
		socket.emit('userEdit', data)
	})
	$('#cancelarEdit').click(function() {
		$('.contentEditar').fadeOut('slow')
		$('#formEdit')[0].reset()
	});
}

function formTodo() {
	creatingTable('Usuarios registrados', 'contTable');
	socket.emit('formTodo')
}

var ew = 0;
socket.on('formTodoResp', function(callback) {	
	var nameTable = callback.nameTable;
	if(callback.cantidad !== 0) {
		var v1 = JSON.stringify(callback.usuarios);
		var v2 = JSON.parse(v1);
		var table = $('#'+nameTable+'>tbody');
		for(var i in v2) {
			var tr = $('<tr data-cedula = "'+v2[i].ced+'"></tr>');
			tr.css('cursor','pointer');

			tr.append('<td>'+v2[i].ced+'</td>');
			tr.append('<td>'+v2[i].name+'</td>');
			tr.append('<td>'+v2[i].lastN+'</td>');
			tr.append('<td>'+v2[i].user+'</td>');
			tr.append('<td>'+v2[i].pass+'</td>');
			tr.append('<td>'+v2[i].telefono+'</td>')
			//tr.append('<td>'+v2[i].direccion+'</td>')
			tr.append('<td>'+v2[i].mail+'</td>');
			tr.append('<td>'+v2[i].empresaVin+'</td>')

			ew++;
			tr.prepend('<td>'+ew+'</td>')					
			table.append(tr);
			
			ponerPaginador(callback.cantidad, ew, nameTable);
		}
	}
	else {		
		$('#loadH3').remove();	
		var containerTable = $('#'+nameTable).parent();		
		$('<div class="alert alert-danger col-sm-4 col-sm-offset-4 text-center" style="margin-top: 10px">No hay usuarios</div>').show().appendTo(containerTable);
	}
});

function creatingTable(parametro, ctn) {
	var containerTable = $('#'+ctn);
	var table = $('<table id="tableTodoUsers" class="table-bordered table-hover tableTodo center-table">');
	var caption = $('<caption>'+parametro+'<span></span></caption>');
	var thead = $('<thead></thead>');
	var tbody = $('<tbody></tbody>');
	var tr = $('<tr></tr>');

	tr.append('<th>No</th>')
	tr.append('<th>Cédula</th>');
	tr.append('<th>Nombre</th>');
	tr.append('<th>Apellido</th>');
	tr.append('<th>Usuario</th>');
	tr.append('<th>Clave</th>');
	tr.append('<th>Telefono</th>')
	//tr.append('<th>Dirección</th>')
	tr.append('<th>Correo</th>');	
	tr.append('<th>Empresa</th>')

	thead.append(tr);
	table.append(caption);
	table.append(thead);
	table.append(tbody);

	containerTable.html('');
	containerTable.append('<h3 id="loadH3">Cargando...</h3>');
	table.css('display','none');
	containerTable.append(table);
}
function ponerPaginador(cantidad, hasta, nameTable) {
	$('#loadH3').remove();
	$('#'+nameTable).show();
	if(cantidad == hasta) {
		console.log('Se esta empezando a paginar la tabla: '+ nameTable);
		$('caption').children().html(' <span class="ctn">('+cantidad+')</span>');
		$('#'+nameTable).dataTable({
			sDom: 'TC<"clear">lfrtpi',
			oTableTools: {
			    sSwfPath: "librerias/paginador/swf/copy_csv_xls_pdf.swf",
			    "aButtons": [
		            "copy",
		            "csv",
		            "xls",
		            {
		                "sExtends": "pdf",
		                "sPdfSize": "tabloid",
		                "sToolTip": "Exportar como PDF"
		            },
		            "print"
		        ]
			}
		});
		ew=0
	}
	else{
		console.log(cantidad +' - '+ hasta)
	}
}
