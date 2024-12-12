document.addEventListener('DOMContentLoaded', function () {

    let isEditing = false;
    let incidents = [];
    let priorities = [];
    let status = [];
    let usuarios = [];
    let editingId;
    const API_URL = 'backend/incidencias.php';

    async function loadIncidents() {
        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
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

    function renderIncidents(incidents) {
        const incidentList = document.getElementById('incident-list');
        incidentList.innerHTML = '';
        incidents.forEach(incident => {
            const priorityName = priorities.find(priority => priority.id_prioridad === incident.id_prioridad)?.nombre || 'Desconocido';
            const priorityColor = priorities.find(priority => priority.id_prioridad === incident.id_prioridad)?.color || 'Desconocido';
            const statusName = status.find(status => status.id_status === incident.id_status)?.nombre || 'Desconocido';
            const userName = usuarios.find(usuario => usuario.id_usuario === incident.id_usuario)?.userName || 'Desconocido';
            console.log(userName);
            const incidentCard = document.createElement('div');
            incidentCard.className = 'd-flex flex-column mb-2';
            incidentCard.innerHTML = `
            <div class="card mb-3 custom-card">
                <div class="card-body row pb-0 align-items-center">
                    
                    <div class="col-12 col-md-2 mb-2 mb-md-0 text-center text-md-start">
                        <span class="badge text-bg-secondary">#${incident.id_incidencias}</span>
                    </div>
                    
                    <div class="col-6 col-md-2 mb-2 mb-md-0 text-center">
                        <span class="fw-bold badge bg-danger">${priorityName}</span>
                    </div>

                    <div class="col-12 col-md-5 mb-2 mb-md-0 text-center text-md-start">
                        <h5 class="card-title mb-0">${incident.descripcion}</h5>
                    </div>

                    <div class="col-6 col-md-2 mb-2 mb-md-0 text-center">
                        <span class="badge bg-info">${statusName}</span>
                    </div>
                </div>
                <div class="card-body row p-1 align-items-center">

                    <div class="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <p class="card-text"><span class="fw-bold">${userName}</span></p>
                    </div>

                    <div class="col-12 col-md-6 text-center text-md-end">
                        <p class="card-text"><small class="text-muted">Creation Date: ${incident.fecha_creacion}</small></p>
                    </div>
                </div>
            </div>
        `;
            incidentList.appendChild(incidentCard);
        });


    }

    function handleEditIncident(event) {
        try {
            const incidentId = event.target.dataset.id;
            const incident = incidents.find(incident => incident.id === parseInt(incidentId));

            document.getElementById('name').value = incident.definition;
            document.getElementById('priority').value = incident.priority;

            isEditing = true;
            editingId = incidentId;

            const incidentModal = new bootstrap.Modal(document.getElementById('incidentModal'));
            incidentModal.show();
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function handleDeleteIncident(event) {
        const id = parseInt(event.target.dataset.id);
        const response = await fetch(API_URL, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (response.ok) {
            loadIncidents();
        } else {
            console.error('Error:', response.status);
        }
    }

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

    function selectPriority(event, priority) {
        const priorityButton = document.getElementById('priorityDropdown');
        priorityButton.textContent = priority.nombre;
        priorityButton.dataset.priorityId = priority.id_prioridad;
    }

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

    document.getElementById('incidentModal').addEventListener('show.bs.modal', function () {
        if (!isEditing) {
            document.getElementById('incident-form').reset();
        }
    });

    document.getElementById("incidentModal").addEventListener('hidden.bs.modal', function () {
        editingId = null;
        isEditing = false;
    })
    loadPriorities();
    loadIncidents();
});
