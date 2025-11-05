const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
}, { timestamps: true });


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;