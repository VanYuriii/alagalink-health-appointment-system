const mongoose = require('mongoose');

/**
 * Mongoose schema for medical appointments.
 * 
 * Defines the structure and validation rules for appointment documents
 * in the MongoDB database. Includes automatic timestamp tracking for
 * creation and updates.
 * 
 * @typedef {Object} appointmentSchema
 * @property {mongoose.Schema.Types.ObjectId} patient - Reference to Patient model (required)
 * @property {Date} requestedDate - Requested appointment date and time (required)
 * @property {string[]} symptoms - Array of patient symptoms (required)
 * @property {string} status - Appointment status (required, default: 'pending')
 * @property {Object} triage - Automated triage assessment results
 * @property {string} triage.urgency - Urgency level from triage system
 * @property {string} triage.suggestedCheckup - Recommended checkup type
 * @property {string} notes - Additional notes or comments (default: empty string)
 * @property {Date} createdAt - Auto-generated timestamp of creation
 * @property {Date} updatedAt - Auto-generated timestamp of last update
 */

const appointmentSchema = new mongoose.Schema({
    /**
     * Reference to the patient requesting the appointment.
     * Links to the Patient collection via ObjectId.
     */
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    // Requested date and time for the appointment.
    requestedDate: {
        type: Date,
        required: true,
    },
    // List of symptoms reported by the patient.
    symptoms: {
        type: [String], 
        required: true,
    },
    //Current status of the appointment.
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rescheduled', 'done'],
        default: 'pending',
    },
    //Triage results from the automated assessment.
    triage: {
        urgency: String,
        suggestedCheckup: String,
    },
    //Optional notes or comments about the appointment.
    notes: {
        type: String,
        default: '', 
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;