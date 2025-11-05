const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    requestedDate: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: [String], 
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rescheduled', 'done'],
        default: 'pending',
    },
    triage: {
        urgency: String,
        suggestedCheckup: String,
    },
    notes: {
        type: String,
        default: '', 
    },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;