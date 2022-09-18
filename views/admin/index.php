<h1 class="nombre-pagina">Panel de Administración</h1>

<?php

use function PHPSTORM_META\type;

    @include_once __DIR__ . '/../templates/barra.php';
?>
<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha; ?>"
            />
        </div>
        
    </form>
</div>

<?php
    if(count($citas) === 0) {
        echo "<h2>No hay citas</h2>";
    }
?>

<div id="citas-admin">
    <ul class="citas">
        <?php 
        $idCita = null;
            foreach($citas as $key=>$cita):
                if($idCita !== $cita->id): 
                    $total = 0;
                    $idCita = $cita->id;
        ?>
                    <li>
                        <p>ID: <span><?php echo $cita->id; ?></span></p>
                        <p>HORA: <span class="horaC"><?php echo $cita->hora; ?></span></p>
                        <p>CLIENTE: <span><?php echo $cita->cliente; ?></span></p>
                        <p>EMAIL: <span><?php echo $cita->email; ?></span></p>
                        <p>TELÉFONO: <span><?php echo $cita->telefono; ?></span></p>
                        <h3>Servicios</h3>
                        <?php
                            endif;
                            $total += $cita->precio;
                        ?>
                    
                    <p class="servicio"><?php echo $cita->servicio . " " . $cita->precio . "€"; ?></p>
                           
                   
        <?php
            $actual = $cita->id;
            $proximo = $citas[$key + 1]->id ?? 0;

            if(esUltimo($actual, $proximo)):
        ?>
            <p class="total">TOTAL: <span><?php echo $total . "€"; ?></span></p>

            <form action="api/eliminar" method="POST">
                <input type="hidden" name="id" value="<?php echo $cita->id; ?>"/>
                <input type="submit" class="boton-eliminar" value="Eliminar"/>
            </form>
        <?php
            endif;
            
            endforeach;       
        ?>
    </ul>
    
</div>

<?php 

    $script = "<script src='build/js/buscador.js'></script>";
?>