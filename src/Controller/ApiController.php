<?php

namespace App\Controller;

use FOS\RestBundle\Controller\AbstractFOSRestController;
use FOS\RestBundle\Controller\Annotations as Rest;
use FOS\RestBundle\Controller\FOSRestController;
use JMS\SerializerBundle\JMSSerializerBundle;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;

/**
 * Class ApiController
 *
 * @Route("/api")
 */
class ApiController extends AbstractFOSRestController
{

		public function __construct()
		{
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
    public function getCityWeather(Request $request) {
			return new Response("hola");
		}

}