<?php 
namespace Controllers;

use Model\Servicios;

class APIController {
    public static function index() {
        $servicios = Servicios::all();
        echo json_encode($servicios, JSON_UNESCAPED_UNICODE);
            
    }

    public static function guardar(){
        $respuesta = [
            'datos' => $_POST
        ];

        echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    }
}