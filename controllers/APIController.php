<?php 
namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicios;

class APIController {
    public static function index() {
        $servicios = Servicios::all();
        echo json_encode($servicios, JSON_UNESCAPED_UNICODE);
            
    }

    public static function guardar(){
        //Almacena la cita y devuelve el id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        $id = $resultado['id'];
        
        //Almacena los servicios con el ID de la Cita
        $idServicios = explode(",", $_POST['servicios']); //Separamos los idServicios por las comas
        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];

            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }


        echo json_encode(['resultado' => $resultado], JSON_UNESCAPED_UNICODE);
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD']==='POST') {
            $id = $_POST['id'];

            if(filter_var($id, FILTER_VALIDATE_INT)) {
                $cita = Cita::find($id);
            }

            if($cita) {
                $cita->eliminar();
            }
               
            header('Location:' . $_SERVER["HTTP_REFERER"]);
        }
    }
}