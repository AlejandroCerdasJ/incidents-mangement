document.addEventListener('DOMContentLoaded', function() {
    const incidents = [
        {
            id: 1,
            definition: "Server down",
            priority: "P1 Critical",
            summary: "Lost the connection",
            impactedServices: "Web page",
            status: "Open",
            date: "9/11/2024"
        },
        {
            id: 2,
            definition: "Slow response time",
            priority: "P2 High",
            summary: "The server is responding slowly",
            impactedServices: "Database",
            status: "Open",
            date: "10/11/2024"
        }
    ];

    function loadIncidents() {
        const incidentList = document.getElementById('incident-list');
        incidentList.innerHTML = '';
        incidents.forEach(function(incident) {
            const incidentCard = document.createElement('div');
            incidentCard.className = 'd-flex flex-column mb-2';
            incidentCard.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body row pb-0">
                        <div class="col-sm-1 m-1 badge text-bg-secondary "><p class="card-text ">#${incident.id}</p></div>
                        <div class="col-sm-2"><p class="card-text"><span class="fw-bold badge bg-danger">${incident.priority}</span></p></div>
                        <div class="col-sm-7"><h5 class="card-title">${incident.definition}</h5></div>
                        <div class="col-sm-1 m-1 badge text-bg-info "><p class="card-text">${incident.status}</p></div>
                    </div>
                    <div class="card-body row p-1">   
                        <div class="col-sm-6"><p class="card-text">${incident.impactedServices}</p></div>
                        <div class="col-sm-6 d-flex justify-content-end"><p class="card-text"><small class="text-muted">Date: ${incident.date}</small></p></div>
                    </div>
                </div>
            `;
            incidentList.appendChild(incidentCard);
        });
    }

    document.getElementById('incident-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const definition = document.getElementById("definition").value;
        const priority = document.getElementById("priority").value;
        const summary = document.getElementById("summary").value;
        const impactedServices = document.getElementById("impacted-services").value;

        const newIncident = {
            id: incidents.length + 1,
            definition: definition,
            priority: priority,
            summary: summary,
            impactedServices: impactedServices,
            status: "Open",
            date: new Date().toLocaleDateString() // fecha actual
        };
        
        incidents.push(newIncident);

        const modal = bootstrap.Modal.getInstance(document.getElementById('incidentModal'));
        modal.hide();
        loadIncidents();
    });

    document.getElementById('incidentModal').addEventListener('show.bs.modal', function() {
        document.getElementById('incident-form').reset();
    });

    loadIncidents();
});
