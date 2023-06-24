
const contenedorEmpleados = document.querySelector("#employees");
const selectJobs = document.querySelector("#jobs");
const selectOrder = document.querySelector("#order");
const formFiltros = document.querySelector("#form-filtros");
let empleados;

$(document).ready(function () {
    obtenerEmpleados();
    obtenerTrabajos();
    selectJobs.addEventListener("change", filtrarPorTrabajo);
    selectOrder.addEventListener("change", ordenar);
    formFiltros.addEventListener("submit", limpiarFiltros)
})

function obtenerEmpleados() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:9000/EmployeeWebService/listar',
        contentType: 'application/json; charset="UTF-8',
        dataType: 'json',
        success: function (respuesta) {
            empleados = respuesta;
            listarEmpleados(respuesta);
        },
        error: function (respuesta) {
            console.log("Error al listar" + respuesta)
        }
    })
}

function listarEmpleados() {
    for (let i = 0; i < empleados.length; i++) {
        const { id, name, last_name, birthdate, gender, job } = empleados[i];
        let newBirthDate = birthdate.split("T")[0];

        const contenedor = document.createElement('tr');
        contenedor.classList.add("bg-dark", "p-2", "mb-2", "rounded", "text-white");

        const textoNumero = document.createElement('th');
        textoNumero.scope = "row";
        textoNumero.textContent = i + 1;

        const textoNombre = document.createElement('td');
        textoNombre.textContent = name;

        const textoApellido = document.createElement('td');
        textoApellido.textContent = last_name;

        const textoFechaNacimiento = document.createElement('td');
        textoFechaNacimiento.textContent = newBirthDate;

        const textoGenero = document.createElement('td');
        textoGenero.textContent = gender.name;

        const textoTrabajo = document.createElement('td');
        textoTrabajo.textContent = job.name;

        contenedor.appendChild(textoNumero);
        contenedor.appendChild(textoNombre);
        contenedor.appendChild(textoApellido);
        contenedor.appendChild(textoFechaNacimiento);
        contenedor.appendChild(textoTrabajo);
        contenedor.appendChild(textoGenero);
        contenedorEmpleados.appendChild(contenedor);
    };
}

function obtenerTrabajos() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:9000/JobWebService/listar',
        contentType: 'application/json; charset="UTF-8',
        dataType: 'json',
        success: function (respuesta) {
            listarTrabajos(respuesta);
        },
        error: function (respuesta) {
            console.log("Error al listar" + respuesta)
        }
    })
}

function listarTrabajos(trabajos) {
    const selectTrabajo = document.querySelector("#jobs");

    trabajos.forEach(trabajo => {
        const optionTrabajo = document.createElement("option");
        optionTrabajo.textContent = trabajo.name;
        optionTrabajo.value = trabajo.id;

        selectTrabajo.appendChild(optionTrabajo);
    })
}

function filtrarPorTrabajo(e) {
    const trabajo = {
        id: Number(e.target.value)
    }

    $.ajax({
        type: 'ajax',
        method: 'post',
        url: 'http://localhost:9000/JobWebService/listarEmpleados',
        data: JSON.stringify(trabajo),
        contentType: 'application/json; charset=UTF-8',
        success: function (res) {
            empleados = res;
            limpiarHtml();
            listarEmpleados();
        }
    })
}


function limpiarHtml() {
    while (contenedorEmpleados.firstChild) {
        contenedorEmpleados.removeChild(contenedorEmpleados.firstChild);
    }
}

function limpiarFiltros(e) {
    e.preventDefault();
    formFiltros.reset();
    limpiarHtml();
    obtenerEmpleados();
}

function ordenar(e) {
    const job = selectJobs.value;
    const orden = e.target.value;
    if (job !== "null" && orden == "apellido") {
        $.ajax({
            type: 'ajax',
            method: 'post',
            url: 'http://localhost:9000/JobWebService/listarEmpleadosApellido',
            data: JSON.stringify({ id: Number(job) }),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                empleados = res;
                limpiarHtml();
                listarEmpleados();
            }
        })
    }
}