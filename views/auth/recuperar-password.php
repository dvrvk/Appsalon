<h1 class="nombre-pagina">Restablecer Password</h1>
<p class="descripcion-pagina">Escribe la nueva contraseña a continuación</p>
<?php 
    include_once __DIR__ . '/../templates/alertas.php';
?>
<?php 
if($error) return;
?>
<form class="formulario" method="post">
    <div class="campo">
        <label for="password">Contraseña</label>
        <input 
            type="password" 
            name="password" 
            id="password"
            placeholder="Tu nueva contraseña"
        />
    </div>
    <input type="submit" class="boton" value="Restablecer Contraseña">
</form>

<div class="acciones">
        <a href="/">Iniciar Sesión</a>
        <a href="/crear-cuenta">Crear cuenta</a>
</div>