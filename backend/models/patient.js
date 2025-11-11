const mongoose = require('mongoose');
/**
 * Mongoose schema for patient records.
 * 
 * Defines the basic structure for storing patient information in the
 * MongoDB database. Includes automatic timestamp tracking for record
 * creation and updates.
 * 
 * @typedef {Object} PatientSchema
 * @property {string} name - Full name of the patient (required)
 * @property {Date} dob - Date of birth of the patient (required)
 * @property {Date} createdAt - Auto-generated timestamp of record creation
 * @property {Date} updatedAt - Auto-generated timestamp of last update
 */
const patientSchema = new mongoose.Schema({
    //Full name of the patient.
    name: {
        type: String,
        required: true,
    },
    //Birth date of the patient. 
    dob: {
        type: Date,
        required: true,
    },
}, { timestamps: true }); //automatic createdAt and updatedAt fields


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;