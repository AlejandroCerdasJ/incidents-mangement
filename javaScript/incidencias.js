document.addEventListener('DOMContentLoaded', function () {

    let isEditing = false;
    let incidents = [];
    let priorities = [];
    let status = [];
    let usuarios = [];
    let watchers = [];
    let responders = [];
    let roles = [];
    let rolesUser = [];
    const API_URL = 'backend/incidencias.php';

    async function loadPriorities() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                insertPriorities(data.prioridades);
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadIncidents() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                incidents = data.incidencias;
                priorities = data.prioridades;
                status = data.status;
                usuarios = data.usuarios;
                renderIncidents(incidents);
            } else {
                if (response.status === 401) {
                    window.location.href = 'index.html';
                }
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadWatchersResponders() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                watchers = data.watchers;
                responders = data.responder
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadRoles() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                roles = data.roles;
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function loadRolUser(){
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                rolesUser = data.rolesporusuario;
            } else {
                console.error('Error:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function renderWatchersResponders(incidentId) {
        console.log(incidentId);
        const infoList = document.getElementById('info-list');
        infoList.innerHTML = '';
        
        // Encuentra la incidencia
        const incident = incidents.find(incident => incident.id_incidencias === parseInt(incidentId));
        console.log(rolesUser);
        if (incident) {
            // Filtrar todos los watchers y responders correspondientes a la incidencia
            const watchersForIncident = watchers.filter(watcher => watcher.id_incidencia === incident.id_incidencias);
            const respondersForIncident = responders.filter(responder => responder.id_incidencia === incident.id_incidencias);
    
            // Crear la lista de nombres de usuarios para watchers y responders
            const watcherUserNames = watchersForIncident.map(watcher => {
                const user = usuarios.find(usuario => usuario.id_usuario === watcher.id_usuario);
                return user ? user.userName : 'Desconocido';
            });
    
            const responderUserNames = respondersForIncident.map(responder => {
                const user = usuarios.find(usuario => usuario.id_usuario === responder.id_usuario);
                return user ? user.userName : 'Desconocido';
            });
    
            const incidentCard = document.createElement('div');
            incidentCard.className = 'd-flex flex-column mb-2';
            incidentCard.innerHTML = `
                <div class="card mb-3 custom-card">
                    <div class="card-body row pb-0">
                        <div class="col">
                            <p class="card-title">Incident ID: ${incident.id_incidencias}</p>
                        </div>
    
                        <div class="row">
                            <div class="col">
                                <h5 class="card-title text-uppercase font-weight-bold mb-3">Watchers</h5>
                                <div class="dropdown position-relative">
                                    <button class="btn btn-info btn-sm dropdown-toggle" type="button" id="dropdownWatcherButton" data-bs-toggle="dropdown" aria-expanded="false">Add Watcher</button>
                                    <ul class="dropdown-menu dropdown-status position-absolute" style="z-index: 1050;" aria-labelledby="dropdownWatcherButton">
                                        ${usuarios.map(item => `
                                            <li class="dropdown-item-wrapper">
                                                <a class="dropdown-item usuario-watcher" href="#" data-id="${item.id_usuario}" incident-id="${incident.id_incidencias}">
                                                    ${item.userName}
                                                </a>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <ul class="list-group">
                                    ${watchersForIncident.map(watcher => {
                                        const user = usuarios.find(usuario => usuario.id_usuario === watcher.id_usuario);
                                        // Buscar el rol correspondiente en rolesporincidencia
                                        const watcherRole = rolesUser.find(role => 
                                            role.id_usuario === watcher.id_usuario && 
                                            role.id_incidencia === incident.id_incidencias);
                                        const selectedRoleId = watcherRole ? watcherRole.id_rol : null;
                                        return `
                                            <li class="list-group-item">
                                                ${user ? user.userName : 'Desconocido'}
                                                <select class="form-select role-select" data-id="${watcher.id_usuario}" data-incident-id="${incident.id_incidencias}">
                                                    ${roles.map(role => `
                                                        <option value="${role.id_rol}" ${role.id_rol === selectedRoleId ? 'selected' : ''}>
                                                            ${role.nombre}
                                                        </option>
                                                    `).join('')}
                                                </select>
                                            </li>
                                        `;
                                    }).join('')}
                                </ul>
                            </div>
    
                            <div class="col">
                                <h5 class="card-title text-uppercase font-weight-bold mb-3">Responders</h5>
                                <div class="dropdown position-relative">
                                    <button class="btn btn-info btn-sm dropdown-toggle" type="button" id="dropdownResponderButton" data-bs-toggle="dropdown" aria-expanded="false">Add Responder</button>
                                    <ul class="dropdown-menu dropdown-status position-absolute" style="z-index: 1050;" aria-labelledby="dropdownResponderButton">
                                        ${usuarios.map(item => `
                                            <li class="dropdown-item-wrapper">
                                                <a class="dropdown-item usuario-responder" href="#" data-id="${item.id_usuario}" incident-id="${incident.id_incidencias}">
                                                    ${item.userName}
                                                </a>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <ul class="list-group">
                                    ${respondersForIncident.map(responder => {
                                        const user = usuarios.find(usuario => usuario.id_usuario === responder.id_usuario);
                                        // Buscar el rol correspondiente en rolesporincidencia
                                        const responderRole = rolesUser.find(role => 
                                            role.id_usuario === responder.id_usuario && 
                                            role.id_incidencia === incident.id_incidencias);
                                        const selectedRoleId = responderRole ? responderRole.id_rol : null;
                                        return `
                                            <li class="list-group-item">
                                                ${user ? user.userName : 'Desconocido'}
                                                <select class="form-select role-select" data-id="${responder.id_usuario}" data-incident-id="${incident.id_incidencias}">
                                                    ${roles.map(role => `
                                                        <option value="${role.id_rol}" ${role.id_rol === selectedRoleId ? 'selected' : ''}>
                                                            ${role.nombre}
                                                        </option>
                                                    `).join('')}
                                                </select>
                                            </li>
                                        `;
                                    }).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            infoList.appendChild(incidentCard);
        }
    
        // Función para manejar el cambio de rol
        document.querySelectorAll('.role-select').forEach(select => {
            select.addEventListener('change', async (event) => {
                const newRoleId = parseInt(event.target.value); // Nuevo id de rol
                const userId = parseInt(event.target.dataset.id);
                const incidentId = parseInt(event.target.dataset.incidentId);
    
                // Actualiza el rol en el array de watchers o responders según el id
                const targetArray = (event.target.closest('.col').querySelector('h5').innerText === 'Watchers') ? watchers : responders;
                const target = targetArray.find(item => item.id_usuario == userId && item.id_incidencia == incidentId);
                
                if (target) {
                    target.id_rol = newRoleId;
                    console.log(userId, newRoleId, incidentId);

                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_usuario: userId,
                            id_rol: newRoleId,
                            id_incidencia: incidentId
                        }),
                        credentials: 'include'
                    })
                    if (!response.ok) {
                        console.error('Error:', response.status);
                    }
                    // Aquí podrías hacer una llamada al servidor para guardar estos cambios, si es necesario.
                }else{
                    console.error('Usuario no encontrado');
                }
            });
        });
    }
    
    

    function renderIncidents(incidents) {
        const incidentList = document.getElementById('incident-list');
        incidentList.innerHTML = '';
        incidents.forEach(incident => {
            const priorityName = priorities.find(priority => priority.id_prioridad === incident.id_prioridad)?.nombre || 'Desconocido';
            const priorityColor = priorities.find(priority => priority.id_prioridad === incident.id_prioridad)?.color || 'Desconocido';
            const statusName = status.find(status => status.id_status === incident.id_status)?.nombre || 'Desconocido';
            const userName = usuarios.find(usuario => usuario.id_usuario === incident.id_usuario)?.userName || 'Desconocido';
            const incidentCard = document.createElement('div');
            incidentCard.className = 'd-flex flex-column mb-2';
            incidentCard.setAttribute('data-id', incident.id_incidencias);
            incidentCard.innerHTML = `
            <div class="card mb-3 custom-card">
                <div class="card-body row pb-0">

                    <div class="col">
                        <div class="row mb-2 mb-md-0 text-center text-md-start">
                            <!-- ID del incidente -->
                            <div class="col  text-start">
                                <span class="badge text-bg-secondary text-truncate">#${incident.id_incidencias}</span>
                            </div>

                            <!-- Prioridad -->
                            <div class="col-6  text-end">
                                <span class="fw-bold badge bg-${priorityColor}">${priorityName}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-6"> 
                        <!-- Descripción -->
                            <h5 class="card-title mb-0">${incident.descripcion}</h5>
                        
                    </div>

                    <div class="col">
                        <!-- Estado con Dropdown -->
                        <div class="dropdown position-relative">
                            <button class="btn btn-info btn-sm dropdown-toggle" type="button" id="dropdownStatusButton" data-bs-toggle="dropdown" aria-expanded="false">
                                ${statusName}
                            </button>
                            <ul class="dropdown-menu dropdown-status position-absolute" style="z-index: 1050;" aria-labelledby="dropdownStatusButton">
                                <!-- Itera sobre el arreglo de status y crea las opciones -->
                                ${status.map(item => `
                                    <li>
                                        <a class="dropdown-item change-status" href="#" data-id="${incident.id_incidencias}" data-status="${item.id_status}">
                                            ${item.nombre}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>

                    <div class="col">
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <!-- Usuario -->
                            <p class="card-text mb-0 fw-bold">
                                ${userName}
                            </p>
                            <!-- Fecha de creación -->
                            <p class="card-text mb-0">
                                <small class="text-muted">Creation Date: ${incident.fecha_creacion}</small>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        `;
            incidentList.appendChild(incidentCard);
        });
    }



    // Logica del dropdown en el formulario
    function insertPriorities(priorities) {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.innerHTML = '';

        priorities.forEach(priority => {
            const dropdownItem = document.createElement('li');
            const dropdownLink = document.createElement('a');
            dropdownLink.classList.add('dropdown-item');
            dropdownLink.textContent = `P${priority.id_prioridad} ` + priority.nombre;
            dropdownLink.dataset.id = priority.id_prioridad;
            dropdownLink.addEventListener('click', (event) => {
                selectPriority(event, priority);
            });

            dropdownItem.appendChild(dropdownLink);
            dropdownMenu.appendChild(dropdownItem);
        });
    }
    // Trabaja con la logica del dropdown 
    function selectPriority(event, priority) {
        const priorityButton = document.getElementById('priorityDropdown');
        priorityButton.textContent = priority.nombre;
        priorityButton.dataset.priorityId = priority.id_prioridad;
    }

    // Evgento que se dispara cuando se envia el formulario
    document.getElementById('incident-form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const priorityId = parseInt(document.getElementById('priorityDropdown').dataset.priorityId);
        const description = document.getElementById('description').value;
        const status = 2;

        if (isEditing) {
            const response = await fetch(`${API_URL}?id=${edittingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: name,
                    descripcion: description,
                    id_status: status,
                    id_prioridad: priorityId,
                }),
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Error trying to save a task');
            }
        } else {
            const newTask = {
                nombre: name,
                descripcion: description,
                id_status: status,
                id_prioridad: priorityId,
            };
            console.log(newTask);
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask),
                credentials: 'include'
            });
            if (!response.ok) {
                console.error('Error trying to save a task');
            }
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('incidentModal'));
        modal.hide();
        loadIncidents();
    })



    document.getElementById('incident-list').addEventListener('click', async function (event) {
        const incidentElement = event.target.closest('[data-id]');
        const incidentId = incidentElement.getAttribute('data-id');
        renderWatchersResponders(incidentId);
    });

    //Evento que guarda los watchers en la db
    document.getElementById('info-list').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('.usuario-watcher')) {
            const watcherId = parseInt(event.target.dataset.id);
            const incidentId = parseInt(event.target.getAttribute('incident-id'));
            console.log(watcherId, incidentId);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_incidencias: incidentId,
                        id_usuario: watcherId,
                        action: 'watcher'
                    }),
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.error('Error:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        loadWatchersResponders();
    })

    //Evento que guarda los responders en la db
    document.getElementById('info-list').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('.usuario-responder')) {
            const responderId = parseInt(event.target.dataset.id);
            const incidentId = parseInt(event.target.getAttribute('incident-id'));
            console.log(responderId, incidentId);

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_incidencias: incidentId,
                        id_usuario: responderId,
                        action: 'responder'
                    }),
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.error('Error:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        loadWatchersResponders();
    })


    //Evento que se dispara cuando para actualizar el estado de una incidencia
    document.getElementById('incident-list').addEventListener('click', async function (event) {
        if (event.target && event.target.matches('.change-status')) {
            const incidentId = event.target.dataset.id;
            const newStatus = event.target.dataset.status;

            try {
                const incident = incidents.find(incident => incident.id_incidencias === parseInt(incidentId));

                if (incident) {
                    const updatedIncident = { ...incident, id_status: parseInt(newStatus) };
                    console.log(incidentId);
                    const response = await fetch(`${API_URL}?id=${incidentId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id_incidencias: updatedIncident.id_incidencias,
                            nombre: updatedIncident.nombre,
                            descripcion: updatedIncident.descripcion,
                            id_status: updatedIncident.id_status,
                            id_prioridad: updatedIncident.id_prioridad
                        }),
                        credentials: 'include'
                    });

                    if (response.ok) {
                        loadIncidents();
                    } else {
                        console.error('Error:', response.status);
                    }
                } else {
                    console.error('Incidente no encontrado');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    //Evento que se dispara cuando se abre el modal
    document.getElementById('incidentModal').addEventListener('show.bs.modal', function () {
        if (!isEditing) {
            document.getElementById('incident-form').reset();
        }
    });

    //Evento que se dispara cuando se cierra el modal
    document.getElementById("incidentModal").addEventListener('hidden.bs.modal', function () {
        editingId = null;
        isEditing = false;
    })
    loadPriorities();
    loadIncidents();
    loadWatchersResponders();
    loadRoles();
    loadRolUser();
});
