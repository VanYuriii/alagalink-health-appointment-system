const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = require('../middleware/auth.js');

const Patient = require('../models/patient');
const Appointment = require('../models/appointment');

const { runTriage } = require('../logic/triage');

/**
 * @fileoverview API routes for patient management and appointment scheduling system.
 * Handles patient registration, appointment creation, admin authentication, and
 * appointment management.
 * 
 * @module routes/api
 * @requires express
 * @requires jsonwebtoken
 * @requires ../middleware/auth
 * @requires ../models/patient
 * @requires ../models/appointment
 * @requires ../logic/triage
 */

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 * @access  Public
 */
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password123') {
        const payload = {
            user: {
                id: 'admin_user_01', 
                username: 'admin'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


/**
 * @route   POST /api/patients
 * @desc    Register a new patient
 * @access  Public
 */
router.post('/patients', async (req, res) => {
    try {
        const { name, dob } = req.body;

        if (!name || !dob) {
            return res.status(400).json({ message: 'Name and date of birth are required' });
        }

        const newPatient = new Patient({
            name,
            dob,
        });

        const patient = await newPatient.save();
        res.status(201).json(patient); 

    } catch (err) {
        console.error('Error creating patient:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/patients
 * @desc    Get all patients
 * @access  Public
 */
router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ name: 1 });
        res.json(patients);

    } catch (err) {
        console.error('Error fetching patients:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


/**
 * @route   POST /api/appointments
 * @desc    Create a new appointment
 * @access  Public (Anyone can request an appointment)
 */
router.post('/appointments', async (req, res) => {
    try {
        const { patientId, requestedDate, symptoms, notes } = req.body; 

        if (!patientId || !requestedDate || !symptoms || symptoms.length === 0) {
            return res.status(400).json({ message: 'Patient, date, and symptoms are required' });
        }

        const triageResult = runTriage(symptoms);

        const newAppointment = new Appointment({
            patient: patientId,
            requestedDate,
            symptoms,
            notes: notes, 
            triage: {
                urgency: triageResult.urgency,
                suggestedCheckup: triageResult.suggestedCheckup,
            },
            status: 'pending',
        });

        const appointment = await newAppointment.save();

        res.status(201).json(appointment);

    } catch (err) {
        console.error('Error creating appointment:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments (for admin)
 * @access  PRIVATE - Requires token
 */
router.get('/appointments', verifyToken, async (req, res) => {
    try {
       
        const appointments = await Appointment.find()
            .populate('patient', 'name dob') 
            .sort({ requestedDate: -1 }); 
        res.json(appointments);

    } catch (err) {
        console.error('Error fetching appointments:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PATCH /api/appointments/:id
 * @desc    Update an appointment's status (for admin)
 * @access  PRIVATE - Requires token
 */
router.patch('/appointments/:id', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const apptId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: 'New status is required' });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            apptId,
            { status: status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(updatedAppointment);

    } catch (err) {
        console.error('Error updating appointment:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;