const { AppointmentSchema } = require("../../model/appointmentModel");
const { DoctorSchema } = require("../../model/doctorModel");
const User = DoctorSchema;
const getAllAppointments = async (req, res) => {
  try {
    const data = await AppointmentSchema.find({
      progress: "toaccept",
    }).populate({
      path: "patientId",
      select: "name",
    });

    const modifiedData = data.map((appointment) => ({
      ...appointment.toObject(),
      patientId: appointment.patientId[0] || null,
    }));

    res.status(200).json(modifiedData);
  } catch (error) {
    console.log(error);

    res.status(500).send({ err: error });
  }
};
const updateAppointmentProgress = async (req, res) => {
  try {
    const { appointmentId,done,name } = req.body;
    console.log(appointmentId);
 
    if (!appointmentId) {
      return res
        .status(400)
        .json({ error: "Appointment ID and progress are required." });
    }
    let updatedAppointment
    if(done==false){
       updatedAppointment = await AppointmentSchema.findByIdAndUpdate(
        appointmentId,
        { progress: "ongoing" },
        {new:true}
      );
    }
    else{
       updatedAppointment=await AppointmentSchema.findByIdAndUpdate(
        appointmentId,
          {progress:'done'},
          {new:true}
        
      )
      updatedAppointment.doctorname=name;
      console.log(updateAppointmentProgress.doctorname+"!");
      
      await updatedAppointment.save();
      if (!updatedAppointment) {
        return res.status(404).json({ error: "Appointment not found." });
      }
      // No further actions needed after deletion, send response
      return res.status(200).json({ message: "Appointment deleted successfully." });
    }
    if (updatedAppointment) {
      updatedAppointment.appointedDoctorId = req.userId;
      await updatedAppointment.save();
    }
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json(updatedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating appointment progress." });
  }
}
const getDoctorAppointments = async (req, res) => {
  // on going appointment of this doctor
  try {
    const data = await AppointmentSchema.find({
      appointedDoctorId: req.userId,
      progress: "ongoing",
    });
    console.log(data);
    
    res.send(data);

  } catch (error) {
    res.status(500).send({ err: error });
  }
};

const addPresentDoctor = async (req, res) => {
  const { appointmentId } = req.body;
  const doctorId = req.userId;
  try {
    const data = await AppointmentSchema.findById(appointmentId);
    if (!data.presentDoctorIds.includes(doctorId)) {
      data.presentDoctorIds.push(doctorId);
    }
    await data.save();
    res.send(data);
  } catch (error) {
    res.status(500).send({ err: error });
  }
};
const getuserprofile = async (req, res) => {
  try {
    const Id = req.userId;
    let user = await User.findById(Id);
    console.log(user);
    delete user.password;
    delete user.verified;
    delete user.verifyToken;
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
  }
};
const getreview=async(req,res)=>{
  const userId = req.userId;

try {
 
  const data = await User.findById(userId);
  if (!data) {
    return res.status(404).send("Doctor not found.");
  }

  const appointmentIds = data.rating.map((rev) => rev.appointmentId);

  const appointments = await AppointmentSchema.find({
    _id: { $in: appointmentIds },
  });

  const enrichedRatings = data.rating.map((rev) => {
    const appointment = appointments.find(
      (app) => app._id.toString() === rev.appointmentId
    );
    return {
      ...rev._doc, 
      problem: appointment ? appointment.problem : "No problem description",
    };
  });

  res.status(200).send(enrichedRatings);
} catch (err) {
  console.error(err);
  res.status(500).send("Server error.");
}
}
module.exports = {
  getAllAppointments,
  addPresentDoctor,
  getDoctorAppointments,
  getuserprofile,
  updateAppointmentProgress,
  getreview
};
