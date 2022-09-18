<?php

function debuguear($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

//Esta la sesión iniciada
function isSession() {
    if(!isset($_SESSION)) {
        session_start();
    }
}

//Función que revisa que el usuario esté autenticado
function isAuth() : void {
    if(!isset($_SESSION['login'])) {
        header('Location: /');
    }
}

//Compobar que es admin
function isAdmin(): void {
    if(!isset($_SESSION['admin'])) {
        header('Location: /');
    }
}

// Saber si es el utlimo servicio
function esUltimo(string $actual, string $proximo) :bool {
    if ($actual !== $proximo) {
        return true;
    }

    return false;
}

