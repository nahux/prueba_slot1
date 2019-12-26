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
	private const APP_ID_PARAMETER = "&lang=es&appid=";
	private $api_url;
	private $api_secret;

	public function __construct($api_url, $api_secret)
	{
		$this->api_url = $api_url;
		$this->api_secret = $api_secret;
	}

	/**
	 * @author Nahuel Aparicio
	 * @param String url
	 * @return Response
	 */
	private function callRequest($url_parameters){
	
		// $response = $client-
			
		// return $response;
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
		// Seteo la url con la ciudad y el secret de la api de OpenWeather
		$url_parameters = "?q=La Plata" . self::APP_ID_PARAMETER. $this->api_secret;

		$response = Unirest\Request::get($this->api_url, $url_parameters);
		return new Response(json_encode($response));
	}
}
