<h1 class="nombre-pagina">Recuperar Contraseña</h1>
<p class="descripcion-pagina">Escribe tu email para recuperar tu contraseña</p>
<?php 
    include_once __DIR__ . '/../templates/alertas.php';
?>
<form class="formulario" action="/olvide" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Tu email">
    </div>

    <input type="submit" value="Recuperar" class="boton">
</form>

<div class="acciones">
        <a href="/">¿Ya tienes cuenta? Inicia sesión</a>
        <a href="/crear-cuenta">¿No tienes cuenta? Crear cuenta</a>
</div>