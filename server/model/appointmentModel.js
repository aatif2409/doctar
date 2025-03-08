const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
  progress: String, // "toaccept", "recieved", "on going", "done"
  presentDoctorIds: [{ type: String }], // or [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', unique: true }]
  appointedDoctorId:[{type:mongoose.Schema.ObjectId,ref:'doctor'}],
  patientId:[{type:mongoose.Schema.Types.ObjectId,ref:'patient'}],
  patientname:String,
  doctorname:String,
  problem: String,
  time: String,
  reviewed :Boolean 
})

const AppointmentSchema = mongoose.model( "Appointment", appointmentSchema); // changed from "users" to "Appointment"
module.exports = { AppointmentSchema } 