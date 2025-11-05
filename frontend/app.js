
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:5000/api';

    /**
     * @param {string} endpoint - The API endpoint (e.g., '/patients')
     * @param {string} method - 'GET', 'POST', 'PATCH'
     * @param {object} [body] - The data to send
     * @returns {Promise<object>} The JSON response
     */
    async function apiCall(endpoint, method, body) {
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (endpoint !== '/admin/login') {
                const token = sessionStorage.getItem('admin_token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            }

            if (body) {
                config.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_URL}${endpoint}`, config);
            const data = await response.json(); 

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }
            return data;

        } catch (err) {
            console.error(`API Error (${method} ${endpoint}):`, err.message);
            alert(`Error: ${err.message}`);
            if (err.message === 'Token is invalid' || err.message === 'No token provided') {
                sessionStorage.removeItem('admin_token');
                window.location.href = 'admin-login.html';
            }
        }
    }

    if (document.body.id === 'patient-portal') {
        const patientSelect = document.getElementById('patient-select');
        const registerForm = document.getElementById('register-form');
        const bookingForm = document.getElementById('booking-form');
        const symptomCheckboxes = document.getElementById('symptom-checkboxes');
        const notesTextarea = document.getElementById('appt-notes');

        const allSymptoms = [
            "fever", "cough", "headache", "stomach_pain", "nausea",
            "difficulty_breathing", "chest_pain"
        ];

        async function loadPatients() {
            const patients = await apiCall('/patients', 'GET');
            if (!patients) return;

            patientSelect.innerHTML = '<option value="">Select a patient</option>'; 
            patients.forEach(patient => {
                const option = document.createElement('option');
                option.value = patient._id;
                const dob = new Date(patient.dob).toLocaleDateString();
                option.textContent = `${patient.name} (DoB: ${dob})`;
                patientSelect.appendChild(option);
            });
        }

        function createSymptomCheckboxes() {
            allSymptoms.forEach(symptom => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = symptom;

                const displayName = symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('_', ' ');

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(` ${displayName}`));
                symptomCheckboxes.appendChild(label);
            });
        }

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const dob = document.getElementById('reg-dob').value;

            const newPatient = await apiCall('/patients', 'POST', { name, dob });
            if (newPatient) {
                alert(`Patient "${newPatient.name}" registered successfully!`);
                registerForm.reset();
                loadPatients(); 
            }
        });

        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const patientId = patientSelect.value;
            const requestedDate = document.getElementById('appt-date').value;
            const notes = notesTextarea.value; 

            const selectedSymptoms = [];
            symptomCheckboxes.querySelectorAll('input[type="checkbox"]:checked')
                .forEach(cb => selectedSymptoms.push(cb.value));

            if (!patientId || !requestedDate || selectedSymptoms.length === 0) {
                alert('Please fill out all fields and select at least one symptom.');
                return;
            }

            const newAppointment = await apiCall('/appointments', 'POST', {
                patientId,
                requestedDate,
                symptoms: selectedSymptoms,
                notes: notes, 
            });

            if (newAppointment) {
                alert(`Appointment requested!
Urgency: ${newAppointment.triage.urgency}
Suggested Checkup: ${newAppointment.triage.suggestedCheckup}`);
                bookingForm.reset();
            }
        });

        loadPatients();
        createSymptomCheckboxes();
    }

  
    if (document.body.id === 'admin-login-page') {
        const loginForm = document.getElementById('login-form');
        const passwordInput = document.getElementById('password');
        const showPasswordCheckbox = document.getElementById('show-password-toggle');

        if (showPasswordCheckbox) {
            showPasswordCheckbox.addEventListener('change', () => {
                passwordInput.type = showPasswordCheckbox.checked ? 'text' : 'password';
            });
        }

        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = passwordInput.value;

                const response = await apiCall('/admin/login', 'POST', { username, password });

                if (response && response.token) {
                    sessionStorage.setItem('admin_token', response.token);
                    window.location.href = 'admin.html';
                }
            });
        }
    }


    
    if (document.body.id === 'admin-dashboard') {

        const token = sessionStorage.getItem('admin_token');
        if (!token) {
            alert('You must be logged in to view this page.');
            window.location.href = 'admin-login.html';
            return; 
        }
        
        const metricTotal = document.getElementById('metric-total');
        const metricPending = document.getElementById('metric-pending');
        const metricHighUrgency = document.getElementById('metric-high-urgency');

        const manageSelect = document.getElementById('manage-select');
        const manageForm = document.getElementById('manage-form');
        const newStatusSelect = document.getElementById('manage-new-status'); 
        const logoutButton = document.getElementById('logout-button');

        const searchActiveInput = document.getElementById('search-active');
        const searchCompletedInput = document.getElementById('search-completed');

        const activeTableBody = document.getElementById('active-appointments-table-body');
        const completedTableBody = document.getElementById('completed-appointments-table-body');

        let allAppointmentsData = [];

        function generateTableRows(appointmentsList) {
            return appointmentsList.map(appt => {
                const patientName = appt.patient ? appt.patient.name : 'Unknown';
                const patientDob = appt.patient ? new Date(appt.patient.dob).toLocaleDateString() : 'N/A';
                const apptDate = new Date(appt.requestedDate).toLocaleDateString();

                const statusClass = appt.status === 'pending' ? 'status-pending' :
                    appt.status === 'approved' ? 'status-approved' :
                        appt.status === 'rescheduled' ? 'status-rescheduled' : 'status-done';

                const urgencyClass = `urgency-${appt.triage.urgency}`;

                const notesHtml = (appt.notes && appt.notes.trim() !== '')
                    ? `<br><br><small style="color: var(--dark); white-space: pre-wrap;"><strong>Patient Notes:</strong> ${appt.notes}</small>`
                    : ''; 

                return `
          <tr>
            <td>
              <strong>${patientName}</strong><br>
              <small>DoB: ${patientDob}</small>
            </td>
            <td>${apptDate}</td>
            <td><span class="badge ${statusClass}">${appt.status}</span></td>
            <td><span class="badge ${urgencyClass}">${appt.triage.urgency}</span></td>
            <td>${appt.triage.suggestedCheckup}</td>
            <td>
              ${appt.symptoms.join(', ')}
              ${notesHtml} <!-- Add the notes HTML here -->
            </td>
          </tr>
        `;
            }).join('');
        }


        function renderDashboard(searchTermActive = '', searchTermCompleted = '') {

            const activeAppts = allAppointmentsData.filter(a => a.status !== 'done');
            const completedAppts = allAppointmentsData.filter(a => a.status === 'done');

            const filteredActive = activeAppts.filter(a =>
                a.patient && a.patient.name.toLowerCase().includes(searchTermActive.toLowerCase())
            );

            const filteredCompleted = completedAppts.filter(a =>
                a.patient && a.patient.name.toLowerCase().includes(searchTermCompleted.toLowerCase())
            );

            const pendingAppts = activeAppts.filter(a => a.status === 'pending');
            const highUrgencyAppts = pendingAppts.filter(a =>
                a.triage && a.triage.urgency === 'High'
            );
           
            metricTotal.textContent = allAppointmentsData.length;
            metricPending.textContent = pendingAppts.length;
            metricHighUrgency.textContent = highUrgencyAppts.length;

            activeTableBody.innerHTML = generateTableRows(filteredActive);

            completedTableBody.innerHTML = generateTableRows(filteredCompleted);

            manageSelect.innerHTML = '<option value="">Select an active appointment...</option>'; 
            filteredActive.forEach(appt => {
                const option = document.createElement('option');
                option.value = appt._id;
                const apptDate = new Date(appt.requestedDate).toLocaleDateString();
                const patientName = appt.patient ? appt.patient.name : 'Unknown';

                let notesSnippet = '';
                if (appt.notes && appt.notes.trim() !== '') {
                    notesSnippet = ` -- Notes: ${appt.notes.substring(0, 20)}...`; 
                }

                option.textContent = `[${apptDate}] ${patientName} (${appt.status}) - ${appt.symptoms.join(', ')}${notesSnippet}`;
                manageSelect.appendChild(option);
            });
        }

        async function loadDashboard() {
            const appointments = await apiCall('/appointments', 'GET');
            if (appointments) {
                allAppointmentsData = appointments; 
                renderDashboard(); 
            }
        }


        manageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const apptId = manageSelect.value;
            const newStatus = newStatusSelect.value; 

            if (!apptId || !newStatus) {
                alert('Please select an appointment and a new status.');
                return;
            }

            const updatedAppt = await apiCall(`/appointments/${apptId}`, 'PATCH', {
                status: newStatus,
            });

            if (updatedAppt) {
                alert(`Appointment status updated to "${newStatus}"!`);
                loadDashboard();
                manageForm.reset();
            }
        });

        searchActiveInput.addEventListener('input', (e) => {
            renderDashboard(e.target.value, searchCompletedInput.value);
        });

        searchCompletedInput.addEventListener('input', (e) => {
            renderDashboard(searchActiveInput.value, e.target.value);
        });

        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('admin_token');
            alert('You have been logged out.');
            window.location.href = 'admin-login.html';
        });

        loadDashboard();
    }

}); 