$(document).ready(function () {

	$("#boton-buscar").click(function () {
		$("#spinner").show();
		$("#error").hide();
		$(".container-info-clima").hide();
		var ciudad = $("#input-buscar").val();
		var url = window.location.href + "api/city_weather/?city_name=" + ciudad;
		var request = $.ajax(url)
			.done(function(result) {
				var info_clima = $.parseJSON(result).info_clima;
				$("#barra").show();
				$("#spinner").hide();

				console.log(info_clima.clima);
				$("#clima").text(info_clima.clima);
				$("#temp").text(info_clima.temperatura+"°C");
				$("#viento").text(info_clima.viento+"km");
				$(".container-info-clima").show();
			})
			.fail(function(error) {
				console.log(error);
				$("#error").show();
				$("#spinner").hide();
			});
	});

	// Onchange del input del buscador
	$("#input-buscar").keyup(function (event) {
		if ($("#input-buscar").val()) {
			$("#boton-buscar").removeAttr("disabled");
			$("#boton-buscar").addClass('boton-buscar-active');
		} else {
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