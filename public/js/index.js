$(document).ready(function () {

	$("#boton-buscar").click(function () {
		$("#spinner").show();
		$("#error").hide();
		var ciudad = $("#input-buscar").val();
		var url = window.location.href + "api/city_weather/?city_name=" + ciudad;
		var request = $.ajax(url)
			.done(function(result) {
				console.log(result);
				$("#barra").show();
				$("#spinner").hide();
			})
			.fail(function(error) {
				console.log(error);
				$("#error").show();
				$("#spinner").hide();
			});
	});

	$("#input-buscar").keyup(function (event) {
		if ($("#input-buscar").val()) {
			$("#boton-buscar").removeAttr("disabled");
			$("#boton-buscar").addClass('boton-buscar-active');
		} else {
			$("#boton-buscar").attr("disabled", "");
			$("#boton-buscar").removeClass('boton-buscar-active');
		}
	}); 

});