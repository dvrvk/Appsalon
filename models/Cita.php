<?php 

namespace Model;

class Cita extends ActiveRecord {
    // Base de datos
    protected static $tabla = 'citas';
    protected static $columnasDB = ['id', 'fecha', 'hora', 'usuarioid'];

    // Atributos (para instanciar)
    public $id;
    public $fecha;
    public $hora;
    public $usuarioid;

    // Constructor
    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? null;
        $this->hora = $args['hora'] ?? null;
        $this->usuarioid = $args['usuarioid'] ?? null;
    }
}