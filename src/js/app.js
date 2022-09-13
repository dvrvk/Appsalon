let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    nombre: '',
    fecha: '', 
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp() {
    mostrarSeccion(); //Muestra y oculta las secciones
    tabs(); //Cambia la sección cuando se presionan los tabs
    botonesPaginador(); //Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();
    consultarAPI(); //Consulta la API en el backend de php
    nombreCliente(); //Agrega el nombre del cliente al objeto cita
    seleccionarFecha(); //Agrega la fecha de la cita en el objeto cita
}

function mostrarSeccion() {
    //Ocultar la seccion que tenga la clase de mostrar...
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior) {
        seccionAnterior.classList.remove('mostrar');
    }
    //Seleccionar la sección con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quita la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');
    
    botones.forEach( boton => {
        boton.addEventListener('click', (e)=>{
            paso =  parseInt(e.target.dataset.paso);

            mostrarSeccion();
            botonesPaginador();
        });
    });
}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1) {
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
    } else if (paso === 2) {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function() {
        
        if(paso <= pasoInicial) return;

        paso--;
        botonesPaginador();
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function() {
        
        if(paso >= pasoFinal) return;

        paso++;
        botonesPaginador();
    });

}

async function consultarAPI(){ //Garantizamos que otras funciones se ejecuten
   try  {
        const url = 'http://localhost:3000/api/servicios';
        const resultado = await fetch(url); //Video 498
        const servicios = await resultado.json();
        mostrarServicios(servicios);

        
   } catch(error){
        console.log(error);
   }
}

function mostrarServicios(servicios) {
    servicios.forEach(servicio=> {
        const { id, nombre, precio} = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `${precio}€`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id; //atributo personalizado
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }; //callback para llamar a la función //IMPORTANTE
        
        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);
        
    });
}

function seleccionarServicio(servicio) {
    const {id} = servicio; //id del servicio seleccionado
    const {servicios} = cita; //Te crea variable servicios del array de servicios del objeto cita

    //Identifica el elemento clicado
    const divServidio = document.querySelector(`[data-id-servicio="${id}"]`);

    // Comprobar si un servicio ya fue agregado (itera y devuelve true o false en caso de que exista en el array)
    if(servicios.some(agregado => agregado.id === servicio.id)) {
        //Eliminar el servicio
        cita.servicios = servicios.filter(agregado => agregado.id !== servicio.id);
        divServidio.classList.remove('seleccionado');
    } else {
        //Agregar el servicio
        cita.servicios = [...servicios, servicio]; //[...] copia de los servicios y agrega el nuevo servicio
        divServidio.classList.add('seleccionado');
    }

    console.log(cita);

}

function nombreCliente() {
    cita.nombre = document.querySelector('#nombre').value;
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay();
        if([6,0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Los fines de semana estamos cerrados', 'error');

        } else {
            cita.fecha = e.target.value;
        }
    });

}

function mostrarAlerta(mensaje, tipo){

    //Comprobar si hay alertas previas
    const alertaPrevia = document.querySelector('.alerta');
    if(!alertaPrevia) {
        //Crear la alerta
        const alerta = document.createElement('DIV');
        alerta.textContent = mensaje;
        alerta.classList.add('alerta');
        alerta.classList.add(tipo);

        //Agregar alerta al DOM
        const formulario = document.querySelector('.formulario');
        formulario.appendChild(alerta);

        //Borrar alerta tras x segundoss
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

