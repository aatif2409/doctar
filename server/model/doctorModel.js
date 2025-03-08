const mongoose = require('mongoose')
const ratingSchema = new mongoose.Schema({
  appointmentId: String,
  patientName:String,
  rate: Number,
  comment:String
})
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
  },
  verifyToken: {
    type: String,
  },
  mobile: {
    type: String,
    required: true,
  },
  experience: Number,
  specialization: String,
  gender: String,
  rating: [ratingSchema]
})

const DoctorSchema = mongoose.model("doctor", doctorSchema);
module.exports = { DoctorSchema }