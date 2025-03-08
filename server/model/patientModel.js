const mongoose = require('mongoose')
const patientSchema  = new mongoose.Schema({
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
    age: Number,
    dob:String,
    gender:String,
})
const PatientSchema = mongoose.model("patient", patientSchema);
module.exports={PatientSchema}
