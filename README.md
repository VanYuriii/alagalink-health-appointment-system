# Health Appointment Scheduling System
This web application aims to streamline patient accommodation in Barangay Health Centers, reducing wait times, overcrowding, and appointment conflicts by developing a web application that is user-friendly and patients can book an appointment wherever they are.

## Key Features
• **Patient Registration:** Allows a new user to register with their full name and date of birth.
• **Existing Patient Selection:** Lets a returning user select their name from a dropdown menu.
• **Appointment Booking:** A form to request a new appointment.
• **Date Selection:** A calendar to pick a requested appointment date.
• **Symptom Checklist:** A multi-select box to report symptoms (e.g., *"Fever,"* *"Cough,"* *"Chest Pain"*).
• *Instant Triage Feedback:* Upon submission, the user immediately sees the system's *"suggestion,"* including the *"Urgency Level"* (Low, Medium, High) and *"Suggested Checkup"* (e.g., Respiratory, General).

## Admin Dashboard Features
• **Centralized View:** A single-page dashboard for clinic staff.
• **Key Metrics:** "At-a-glance" cards showing numbers like "Total Pending Appointments" and "High Urgency Cases."
• **Prioritized Triage Queue:** A dedicated table that automatically filters and displays only the "High Urgency" pending appointments, so staff know what to address first.
• **Comprehensive Appointment List:** A full table showing all appointments in the system (pending, approved, etc.) with patient names, symptoms, and triage results.
• **Appointment Management:** The ability to select any pending appointment and update its status to "Approved" or "Rescheduled."

## Stack
Frontend: HTML, CSS, JS
Backend: Node.js + Express
Database: MongoDB Atlas

## Program Flow
1. Patient fills form in browser
2. Browser sends data -> Backend via POST request
3. Backend validates and saves data -> Database
4. Backend sends confirmation -> Browser
5. Admin sees it in dashboard
