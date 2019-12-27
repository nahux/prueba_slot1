<?php

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Unirest;

/**
 * Class ApiController
 *
 * @Route("/api")
 */
class ApiController extends AbstractFOSRestController
{
	private const APP_ID_PARAMETER = "&units=metric&lang=es&appid=";
	private $api_url;
	private $api_secret;

	public function __construct($api_url, $api_secret)
	{
		$this->api_url = $api_url;
		$this->api_secret = $api_secret;
	}

	/**
	 * @Rest\Get("/city_weather/", name="city_weather")
	 *
	 * @SWG\Response(
	 *     response=200,
	 *     description="Consulta exitosa"
	 * ),
	 * @SWG\Response(
	 *     response="400",
	 *     description="Consulta mal formada"
	 *  ),
	 * @SWG\Response(
	 *     response="404",
	 *     description="No se ha encontrado la ciudad"
	 *  ),
	 * @SWG\Response(
	 *     response=500,
	 *     description="Ocurrió un error interno"
	 * ),
	 *
	 * @SWG\Parameter(
	 *     name="city_name",
	 *     in="header",
	 *     type="string",
	 *     description="Nombre de la ciudad a buscar el clima",
	 *     schema={
	 *     }
	 * )
	 *
	 * @SWG\Tag(name="Clima")
	 * 
	 * @author Nahuel Aparicio
	 * @param Request request
	 * @return JsonResponse
	 */
	public function getCityWeather(Request $request)
	{
		try {
			// Traigo el nombre de la ciudad que indica el usuario
			$city_name = $request->get('city_name');
			
			// Valido que esté la ciudad
			if (isset($city_name) && !empty($city_name)) {
				// Seteo los parámetros de la url con la ciudad y el secret de la api de OpenWeather
				$url_parameters = "?q=" . $city_name . self::APP_ID_PARAMETER . $this->api_secret;
				
				// Llamo a la API de OpenWeather para buscar el clima de la ciudad
				$response = Unirest\Request::get($this->api_url . $url_parameters);
				
				// Si es exitoso
				if ($response->code == 200) {
					$response_obj = $response->body;
					$weather_info = [
						"clima" => $response_obj->weather[0]->description,
						"temperatura" => $response_obj->main->temp,
						"viento" => $response_obj->wind->speed
					];
					$mensaje = "Consulta exitosa";
					// Armo la respuesta
					$params = ["estado" => 200, "mensaje" => "Consulta exitosa", "data" => $weather_info];
				} else {
					// Seteo mensaje si hay error
					switch ($response->code) {
						case 404:
							$mensaje = "Ciudad no encontrada";
							break;
						case 500:
							$mensaje = "Error del servicio externo";
							break;
						default:
							$mensaje = "Ocurrió un error";
							break;
					}
					// Armo la respuesta
					$params = ["estado" => $response->code, "mensaje" => $mensaje, "data" => ""];
				}
				return new Response(json_encode($params), $response->code);
			} else {
				// La consulta esta mal formada, armo una respuesta
				$params = ["estado" => 400, "mensaje" => "Consulta mal formada", "data" => ""];
				return new Response(json_encode($params), 400);
			}
		} catch (\Exception $ex) {
			return new Response(json_encode("Ocurrió un error interno - " . $ex->getMessage()), 500);
		}
	}
}
