$(document).ready(function () {

	$("#boton-buscar").click(function () {
		// Muestro spinner cargando y borro el contenido anterior
		$("#spinner").show();
		$("#error").hide();
		$(".container-info-clima").hide();

		// Traigo ciudad del input
		var ciudad = $("#input-buscar").val();
		// Llamo por ajax a la api
		var url = window.location.href + "api/city_weather/?city_name=" + ciudad;
		var request = $.ajax(url)
			.done(function(result) {
				// Muestro la barra separadora y oculto el spinner
				$("#barra").show();
				$("#spinner").hide();
				
				var info_clima = $.parseJSON(result).info_clima;
				// Seteo los valores y los muestro
				var titulo_ciudad = ciudad.toLowerCase(); // Ciudad
				$("#ciudad").text(titulo_ciudad);
				$("#ciudad").css('text-transform', 'capitalize');
				$("#clima").text(info_clima.clima); // Clima
				$("#temp").text(info_clima.temperatura+"°C"); // Temperatura
				$("#viento").text(info_clima.viento+"km"); // Viento
				$(".container-info-clima").show();
			})
			.fail(function(error) {
				// Ocurrio error, muestra mensaje y oculta spinner
				$("#error").show();
				$("#spinner").hide();
			});
	});

	// Onchange del input del buscador
	$("#input-buscar").keyup(function (event) {
		if ($("#input-buscar").val()) {
			// Si hay texto en el input habilito el boton buscar
			$("#boton-buscar").removeAttr("disabled");
			$("#boton-buscar").addClass('boton-buscar-active');
		} else {
			// Si NO hay texto en el input deshabilito el boton buscar
			$("#boton-buscar").attr("disabled", "");
			$("#boton-buscar").removeClass('boton-buscar-active');
		}
	});
	// Enter en el input del buscador para mandar a buscar
	$("#input-buscar").on("keypress", function(e) {
		if(e.which === 13){
			$("#boton-buscar").trigger("click");
		}
	});

});