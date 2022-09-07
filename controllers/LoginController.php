<?php
namespace Controllers;

use Classes\Email;
use MVC\Router;
use Model\Usuario;

class LoginController {
    public static function login(Router $router){
        $alertas = [];
        $auth = new Usuario;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            
            $alertas = $auth->validarLogin();

            if(empty($alertas)){
                //Comrpobar que exista el usuario
                $usuario = Usuario::where('email', $auth->email);
                if($usuario) {
                    //Verificar el password
                    if($usuario->comprobarPasswordAndVerificado($auth->password)){
                        //Autenticar al usuario
                        isSession();
                        
                        $_SESSION['id'] = $usuario->id;
                        $_SESSION['nombre'] = $usuario->nombre . " " . $usuario->apellido;
                        $_SESSION['email'] = $usuario->email;
                        $_SESSION['login'] = true;

                        //Redireccionamiento
                        if($usuario->admin === '1') {
                            $_SESSION['admin'] = $usuario->admin ?? '0';
                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }
                        
                    };
                } else {
                    Usuario::setAlerta('error', "El usuario no existe");
                }
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/login',[
            'alertas' => $alertas,
            'auth' => $auth
        ]);
    }

    public static function logout(){
        echo "Cerrar sesión";
    }

    public static function olvide(Router $router){
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new Usuario($_POST);
            $alertas = $auth->validarEmail();

            if(empty($alertas)){
                $usuario = Usuario::where('email', $auth->email);
                if($usuario && $usuario->confirmado === '1') {
                    //Generar un token cambiar el password
                    $usuario->crearToken();
                    $usuario->guardar();
                    
                    //Enviar instrucciones
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarIntrucciones();

                    //Alerta de exito
                    Usuario::setAlerta('exito', 'Revisa tu email');
                } else {
                    Usuario::setAlerta('error', 'No existe o no está confirmada la cuenta');

                }
                
            }
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/olvide-password', [
            'alertas' => $alertas
        ]);
    }

    public static function recuperar(Router $router){
        $alertas = [];
        $error = false;

        if(isset($_GET['token'])) {
            $token = s($_GET['token']);

            // Buscar usuario por su token
            $usuario = Usuario::where('token', $token);
            if(empty($usuario) || $usuario->token === '') {
                Usuario::setAlerta('error', 'Token No Válido');
                $error = true;
            }

            if($_SERVER['REQUEST_METHOD'] === ' POST') {
                //Leer el nuevo password y guardarlo
            }

        } else {
            Usuario::setAlerta('error', 'Token No Válido');
            $error = true;
        }

        $alertas = Usuario::getAlertas();
        $router->render('auth/recuperar-password', [
            'alertas' => $alertas,
            'error' => $error
        ]);
    }

    public static function crear(Router $router){
        $usuario = new Usuario();
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            //Revisar que alertas este vacio
            if(empty($alertas)){
                //Verifica que el usuario NO este registrado
                $resultado = $usuario->existeUsuario();

                if($resultado->num_rows) {
                    //Esta registrado
                    $alertas = Usuario::getAlertas();
                } else {
                    //No está registrado - Hasear el Password
                    $usuario->hashPassword();

                    //Generar un token único
                    $usuario->crearToken();

                    //Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarConfirmacion();

                    //Crear el usuario
                    $resultado = $usuario->guardar();
                    if($resultado) {
                        header('Location: /mensaje');
                    }
                                  
                }
            }
        }

        $router->render('auth/crear-cuenta', [
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);

    }

    public static function mensaje(Router $router) {
        $router->render('auth/mensaje', []);
    }

    public static function confirmar(Router $router){
        $alertas = [];

        //Asegurarse que token esta el GET
        if(isset($_GET['token'])) {
            $token = s($_GET['token']);

            $usuario = Usuario::where('token', $token);
            
            //Asegurarse que token existe y no está vacio
            if(empty($usuario) || $usuario->token ==='') {
                //Mostrar mensaje de error
                Usuario::setAlerta('error','Token no válido');
            } else {
                //Modificar usuario confirmado
                $usuario->confirmado = '1';
                $usuario->token = "";
                $usuario->guardar();
                Usuario::setAlerta('exito','Cuenta confirmada correctamente');
            }
        } else {
            Usuario::setAlerta('error','Token no válido');
        }
        
        //Obtener alertas
        $alertas = Usuario::getAlertas();

        //Renderizar la vista
        $router->render('auth/confirmar-cuenta', [
            'alertas' => $alertas,
        ]);
    }
}