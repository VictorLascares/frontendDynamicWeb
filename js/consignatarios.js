const contenedorConsignatarios = document.querySelector("#consignees");
const formulario = document.querySelector("#formulario");
const titleForm = document.querySelector("#title-form");
const btnForm = document.querySelector("#btn-form");
const selectCliente = document.querySelector("#cliente");

let consignatarios;

$(document).ready(function () {
    obtenerConsignatarios();
    obtenerClientes();
    formulario.addEventListener('submit', agregarConsignatarios);
})

function obtenerConsignatarios() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:9000/ConsignatarioWebService/listar',
        contentType: 'application/json; charset="UTF-8',
        dataType: 'json',
        success: function (respuesta) {
            consignatarios = respuesta;
            listarConsignatarios();
        },
        error: function (respuesta) {
            console.log("Error al listar" + respuesta)
        }
    })
}

function obtenerClientes() {
    $.ajax({
        method: 'get',
        url: 'http://localhost:9000/ClienteWebService/listar',
        contentType: 'application/json; charset="UTF-8',
        dataType: 'json',
        success: function (respuesta) {
            listarClientes(respuesta);
        },
        error: function (respuesta) {
            console.log("Error al listar" + respuesta)
        }
    })
}

function listarClientes(clientes) {
    clientes.forEach(cliente => {
        const { clienteNombre, clienteId } = cliente;

        const optionCliente = document.createElement("option");
        optionCliente.value = clienteId;
        optionCliente.textContent = clienteNombre;

        selectCliente.appendChild(optionCliente);
    })
}



function listarConsignatarios() {
    limpiarHTML();
    consignatarios.forEach(consignatario => {
        const { consignatarioid, consignatarionombre, consignatarioActivo, consignatariofechacreacion, consignatariofechamodificacion, cliente: { clienteNombre } } = consignatario;
        let newFechaCreacion = new Date(consignatariofechacreacion);
        let newFechaModificacion = new Date(consignatariofechamodificacion);

        const contenedor = document.createElement('div');
        contenedor.classList.add("bg-dark", "p-2", "mb-2", "rounded", "text-white");

        const contenedorNombre = document.createElement('p');
        contenedorNombre.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorNombre.textContent = "Nombre: ";
        const textoNombre = document.createElement('span');
        textoNombre.classList.add("text-white", "fw-normal");
        textoNombre.textContent = consignatarionombre;
        contenedorNombre.appendChild(textoNombre);

        const contenedorActivo = document.createElement("p");
        contenedorActivo.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorActivo.textContent = "Activo: ";
        const textoActivo = document.createElement('span');
        textoActivo.classList.add("text-white", "fw-normal");
        textoActivo.textContent = consignatarioActivo ? "Si" : "No";
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

        const contenedorCliente = document.createElement('p');
        contenedorCliente.classList.add("text-secondary", "fw-bold", "m-0");
        contenedorCliente.textContent = "Cliente: ";
        const textoCliente = document.createElement('span');
        textoCliente.classList.add("text-white", "fw-normal");
        textoCliente.textContent = clienteNombre;
        contenedorCliente.appendChild(textoCliente);

        const contenedorBtns = document.createElement("div");
        contenedorBtns.classList.add("mt-3", "d-flex", "justify-content-end", "gap-2")

        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-warning");
        btnEditar.dataset.id = consignatarioid;
        btnEditar.textContent = "Editar";

        contenedorBtns.appendChild(btnEditar);

        contenedor.appendChild(contenedorNombre);
        contenedor.appendChild(contenedorActivo);
        contenedor.appendChild(contenedorFechaCreacion);
        contenedor.appendChild(contenedorFechaModificacion);
        contenedor.appendChild(contenedorCliente);
        contenedor.appendChild(contenedorBtns);
        contenedorConsignatarios.appendChild(contenedor);
    });
}

function agregarConsignatarios(e) {
    e.preventDefault();
    let consignatario = {
        consignatarioid: Number($('#id').val()),
        consignatarioactivo: $('#activo')[0].checked,
        consignatarionombre: $('#nombre').val(),
        cliente: {
            clienteid: Number($('#cliente').val())
        }
    }


    if (validarCampos(consignatario)) {
        alert("Todos los campos son obligatorios");
    } else {
        console.log(consignatario);
        $.ajax({
            type: 'ajax',
            method: 'post',
            url: 'http://localhost:9000/ConsignatarioWebService/guardar',
            data: JSON.stringify(consignatario),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                obtenerConsignatarios();
                formulario.reset();
            }
        })
    }

}

function validarCampos(trabajo) {
    return Object.values(trabajo).includes("");
}

function limpiarHTML() {
    while (contenedorConsignatarios.firstChild) {
        contenedorConsignatarios.removeChild(contenedorConsignatarios.firstChild)
    }
}


$('#consignees').on('click', '.btn-warning', function () {
    titleForm.textContent = "Editar Consignatario";
    btnForm.textContent = "Editar";
    formulario.removeEventListener("submit", agregarConsignatarios, false);
    formulario.addEventListener('submit', editarConsignatario);
    let id = $(this).attr('data-id');

    $.ajax({
        type: 'ajax',
        method: 'get',
        url: `http://localhost:9000/ConsignatarioWebService/buscar/${id}`,
        contentType: 'application/json; charset=UTF-8',
        success: function (res) {
            $('#id').val(id);
            $('#nombre').val(res.consignatarionombre);
            $('#activo').prop('checked', res.consignatarioActivo);
            $('#cliente').val(res.cliente.clienteId);
        },
        error: function (res) {
            console.log("Error al buscar consignatario: " + res);
        }
    })
})

function editarConsignatario(e) {
    e.preventDefault();
    let consignatario = {
        consignatarioid: Number($('#id').val()),
        consignatarioactivo: $('#activo')[0].checked,
        consignatarionombre: $('#nombre').val(),
        cliente: {
            clienteid: Number($('#cliente').val())
        }
    }

    const id = $('#id').val()

    if (validarCampos(consignatario)) {
        alert("Todos los campos son obligatorios");
    } else {
        $.ajax({
            type: 'ajax',
            method: 'put',
            url: `http://localhost:9000/ConsignatarioWebService/editar/${id}`,
            data: JSON.stringify(consignatario),
            contentType: 'application/json; charset=UTF-8',
            success: function (res) {
                obtenerConsignatarios();
                titleForm.textContent = "Agregar Consignatario";
                btnForm.textContent = "Agregar";
                formulario.removeEventListener("submit", editarConsignatario, false);
                formulario.addEventListener('submit', agregarConsignatarios);
                formulario.reset();
            }
        })
    }

}