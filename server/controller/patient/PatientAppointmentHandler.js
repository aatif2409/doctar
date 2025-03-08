const { AppointmentSchema } = require("../../model/appointmentModel");
const { Chat } = require("../../model/chatModel");
const { DoctorSchema } = require("../../model/doctorModel");
const { PatientSchema } = require("../../model/patientModel");
const mongoose = require('mongoose');

const User = PatientSchema;
const createAppointment = async (req, res) => {
  try {
    const { problem, time ,patientname} = req.body;
    const userId = req.userId;
    const data = await AppointmentSchema.create({
      patientId: userId,
      time: time,
      problem: problem,
      progress: "toaccept",
      reviewed: false,
      appointedDoctorId:undefined,
      presentDoctorIds:[],
      doctorname:"",
      patientname:patientname
     
    });
    res.send(data);
  } catch (e) {
    console.log(e);
    
    res.status(500).send("error while creaating appoiintment");
  }
};
const getPatientAppointments = async (req, res) => {
  const userId = req.userId;
  // console.log(userId);
  const objectId = new mongoose.Types.ObjectId(userId);
  console.log(objectId);
  
  try {
    const appointments = await AppointmentSchema.find({
      patientId: { $elemMatch: { $eq: objectId } },
      progress: { $ne: "done" }
    }).populate({
      path: 'appointedDoctorId',
      select: 'name'
    });
    const modifiedData = appointments.map(appointment => {
      const appointmentObj = appointment.toObject();
      return {
        ...appointmentObj,
        doctorName: appointmentObj.appointedDoctorId && appointmentObj.appointedDoctorId.length > 0
          ? appointmentObj.appointedDoctorId[0].name
          : 'No doctor assigned',
        appointedDoctorId: appointmentObj.appointedDoctorId && appointmentObj.appointedDoctorId.length > 0
          ? appointmentObj.appointedDoctorId[0]._id
          : null
      };
    });
    console.log(modifiedData);
    res.status(200).json(modifiedData);
  } catch (error) {
    console.log(error);
    res.status(500).send({ err: error });
  }
};
const acceptYourDoctorForTreatment = async (req, res) => {
  try {
    const { doctorId, appointmentId } = req.body;
    const appointment = await AppointmentSchema.findById(appointmentId);
    appointment.appointedDoctorId = doctorId;
    appointment.presentDoctorIds = [];
    appointment.save();
    appointment.progress="ongoing"
    res.send(appointment);
    return;
  } catch (e) {
    res.status(500).send("Error in accepting doctor", e);
  }
};
const pastappointment=async(req,res)=>{
  try{
    const userId=req.userId;
    const appoiintments=await AppointmentSchema.find({
      patientId:userId,
      progress:"done"
    }).populate({
       path:'appointedDoctorId',
        select:'name'
    })
    console.log(appoiintments);
    res.status(200).send(appoiintments);
  }catch(err){
    console.log(err);
    res.status(500).json("Error")
  }
}
const reviewDoctor = async (req, res) => {
  const { appointmentId, rating,message} = req.body;
    const userId = req.userId;
  
    if (rating < 1 || rating > 5) {
      return res.status(400).send("Rating must be between 1 and 5.");
    }

    try {
      
      const appointment = await AppointmentSchema.findById(appointmentId);
      const patientname=appointment.patientname;
      
      if (!appointment) {
        return res.status(404).send("Appointment not found.");
      }

      if (appointment.patientId.toString() !== userId) {
        return res
          .status(403)
          .send("You are not authorized to review this appointment.");
      }

      if (appointment.reviewed) {
        return res.status(400).send("This appointment has already been reviewed.");
      }
      
      const doctor = await DoctorSchema.findById(appointment.appointedDoctorId);
      if (!doctor) {
        return res.status(404).send("Doctor not found.");
      }

      const newReview = {
        appointmentId:appointmentId,
        patientName:patientname,
        rate: rating,
        comment:message,
      };

      doctor.rating.push(newReview);
      await doctor.save();
      console.log(doctor);
      
      appointment.reviewed = true;
      await appointment.save();

      res.status(200).send({
        message: "Review submitted successfully.",
        doctor,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while submitting the review.");
    }
};
const getuserprofile=async(req,res)=>{
  try{
    const Id=req.userId;
   let user=await User.findById(Id);
    console.log(user);
    delete(user.password);
    delete(user.verified);
    delete(user.verifyToken);
    return res.status(200).json({user});
  }catch(err){
    console.log(err);

  }
}
module.exports = {
  getPatientAppointments,
  reviewDoctor,
  acceptYourDoctorForTreatment,
  createAppointment,
  getuserprofile,
  pastappointment
};
