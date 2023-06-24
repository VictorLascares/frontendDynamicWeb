let clientes;

$(document).ready(function () {
    obtenerClientes();
    document.querySelector("#formulario").addEventListener('submit', agregarCliente);
})

function obtenerClientes() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:9000/ClienteWebService/listar',
        contentType: 'application/json; charset="UTF-8',
        dataType: 'json',
        success: function (respuesta) {
            clientes = respuesta;
            listarClientes(respuesta);
        },
        error: function (respuesta) {
            console.log("Error al listar" + respuesta)
        }
    })
}



function listarClientes() {
    limpiarHTML();
    const contenedorClientes = document.querySelector("#clients");
    clientes.forEach(cliente => {
        const { clienteId, clienteNombre, clienteActivo, clientefechacreacion, clientefechamodificacion } = cliente;
        let newFechaCreacion = new Date(clientefechacreacion);
        let newFechaModificacion = new Date(clientefechamodificacion);

        const contenedor = document.createElement('div');
        contenedor.classList.add("bg-dark", "p-2", "mb-2", "rounded", "text-white");

        const contenedorNombre = document.createElement('p');
        contenedorNombre.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorNombre.textContent = "Nombre: ";
        const textoNombre = document.createElement('span');
        textoNombre.classList.add("text-white", "fw-normal");
        textoNombre.textContent = clienteNombre;
        contenedorNombre.appendChild(textoNombre);

        const contenedorActivo = document.createElement("p");
        contenedorActivo.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorActivo.textContent = "Activo: ";
        const textoActivo = document.createElement('span');
        textoActivo.classList.add("text-white", "fw-normal");
        textoActivo.textContent = clienteActivo ? "Si" : "No";
        contenedorActivo.appendChild(textoActivo);

        const contenedorFechaCreacion = document.createElement('p');
        contenedorFechaCreacion.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorFechaCreacion.textContent = "Fecha de Creacion: ";
        const textoFechaCreacion = document.createElement('span');
        textoFechaCreacion.classList.add("text-white", "fw-normal");
        textoFechaCreacion.textContent = newFechaCreacion;
        contenedorFechaCreacion.appendChild(textoFechaCreacion);

        const contenedorFechaModificacion = document.createElement('p');
        contenedorFechaModificacion.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorFechaModificacion.textContent = "Fecha de Modificacion: ";
        const textoFechaModificacion = document.createElement('span');
        textoFechaModificacion.classList.add("text-white", "fw-normal");
        textoFechaModificacion.textContent = newFechaModificacion;
        contenedorFechaModificacion.appendChild(textoFechaModificacion);

        const contenedorBtns = document.createElement("div");
        contenedorBtns.classList.add("mt-3", "d-flex", "justify-content-end", "gap-2")

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-warning");
        btnEditar.dataset.id = clienteId;
        btnEditar.textContent = "Editar";

        contenedorBtns.appendChild(btnEditar);

        contenedor.appendChild(contenedorNombre);
        contenedor.appendChild(contenedorActivo);
        contenedor.appendChild(contenedorFechaCreacion);
        contenedor.appendChild(contenedorFechaModificacion);
        contenedor.appendChild(contenedorBtns);
        contenedorClientes.appendChild(contenedor);
    });
}

function agregarCliente(e) {
    e.preventDefault();
    let cliente = {
        clienteActivo: $('#activo')[0].checked,
        clienteNombre: $('#nombre').val(),
    }

    console.log(cliente);
    if (validarCampos(cliente)) {
        alert("Todos los campos son obligatorios");
    } else {
        $.ajax({
            type: 'ajax',
            method: 'post',
            url: 'http://localhost:9000/ClienteWebService/guardar',
            data: JSON.stringify(cliente),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                obtenerClientes();
                document.querySelector("#formulario").reset();
            }
        })
    }

}

function validarCampos(cliente) {
    return Object.values(cliente).includes("");
}

function limpiarHTML() {
    const contenedorClientes = document.querySelector("#clients");
    while (contenedorClientes.firstChild) {
        contenedorClientes.removeChild(contenedorClientes.firstChild)
    }
}


$('#clients').on('click', '.btn-warning', function () {
    document.querySelector("#title-form").textContent = "Editar Cliente";
    document.querySelector("#btn-form").textContent = "Editar";
    document.querySelector("#formulario").removeEventListener("submit", agregarCliente, false);
    document.querySelector("#formulario").addEventListener('submit', editarCliente);
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'ajax',
        method: 'get',
        url: `http://localhost:9000/ClienteWebService/buscar/${id}`,
        contentType: 'application/json; charset=UTF-8',
        success: function (res) {
            $('#id').val(id);
            $('#nombre').val(res.clienteNombre);
            $('#activo').prop('checked', res.clienteActivo);
        },
        error: function (res) {
            console.log("Error al buscar cliente: " + res);
        }
    })
})

function editarCliente(e) {
    e.preventDefault();

    let cliente = {
        clienteActivo: $('#activo')[0].checked,
        clienteNombre: $('#nombre').val(),
    }

    const id = $('#id').val()

    if (validarCampos(cliente)) {
        alert("Todos los campos son obligatorios");
    } else {
        $.ajax({
            type: 'ajax',
            method: 'put',
            url: `http://localhost:9000/ClienteWebService/editar/${id}`,
            data: JSON.stringify(cliente),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                obtenerClientes();
                document.querySelector("#title-form").textContent = "Agregar Cliente";
                document.querySelector("#btn-form").textContent = "Agregar";
                const formulario = document.querySelector("#formulario");
                formulario.removeEventListener("submit", editarCliente, false);
                formulario.addEventListener('submit', agregarCliente);
                formulario.reset();
            }
        })
    }

}