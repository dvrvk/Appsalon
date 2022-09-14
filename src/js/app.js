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
    seleccionarHora(); //Añade la hora de la cita en el objeto

    mostrarResumen(); //Muestra el resumen de la cita
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

        mostrarResumen();

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
            mostrarAlerta('Los fines de semana estamos cerrados', 'error', '.formulario');

        } else {
            cita.fecha = e.target.value;
        }
    });

}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        const horaCita = e.target.value;
        const hora = horaCita.split(':')[0]; //Separar una cadena de texto (forma un array)(cojo el puesto 0 de array)
        const min = horaCita.split(':')[1];
        if(hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Fuera de horario', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true){

    //Comprobar si hay alertas previas
    const alertaPrevia = document.querySelector('.alerta');

    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //Crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    //Agregar alerta al DOM
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    //Borrar alerta tras x segundoss
    if(desaparece) {
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
        
}

function mostrarResumen() {
    const resumen = document.querySelector('.contenido-resumen');
    
    // Limpiar el contenido de resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    };

    if(Object.values(cita).includes('') || cita.servicios.length === 0) { //Object.values permite iterar por todos los valores del objeto
        mostrarAlerta('Faltan datos de servicios, fecha u hora', 'error', '.contenido-resumen', false);
        
        return;
    } 

    // Formatear div de resumen
    const {nombre, fecha, hora, servicios} = cita;
    
    //Heading para Servicios en Resumen
    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    //Iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const { id, precio, nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span>Precio: </span>${precio}€`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    });

    //Heading de información cliente
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Información Cita';
    resumen.appendChild(headingCita);

    // Muestro información del cliente y cita
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre: </span>${nombre}`;

    //FORMATEAR LA FECHA en Español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate();
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year, mes, dia));
    const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);
    //Fin

    const fechaCliente = document.createElement('P');
    fechaCliente.innerHTML = `<span>Fecha: </span>${fechaFormateada}`;

    const horaCliente = document.createElement('P');
    horaCliente.innerHTML = `<span>Hora: </span>${hora}`;
    
    //Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = ' Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCliente);
    resumen.appendChild(horaCliente);
    resumen.appendChild(botonReservar);

}

async function reservarCita() {
    const {nombre, fecha, hora, servicios} = cita;
    const idServicios = servicios.map(servicio => servicio.id); //identifica el campo id y lo retorna
    
    const datos = new FormData();
    datos.append('nombre', nombre);
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('servicios', idServicios);

    //Petición hacia la api
    const url = 'http://localhost:3000/api/citas';
    const respuesta = await fetch(url, {
        method: 'POST',
        body: datos
    });

    const resultado = await respuesta.json();
    console.log(resultado);

    //console.log([...datos]); //puedo ver los datos
}

