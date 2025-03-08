const mongoose = require("mongoose");
const { AppointmentSchema } = require("../model/appointmentModel");

const connect = async (url) => {
  try {
    // First, establish the connection
    await mongoose.connect(url, {
      autoIndex: true, // Ensure that autoIndex is enabled
    });

    // After connection is established, drop the index
    // try {
    //   await AppointmentSchema.collection.dropIndex('presentDoctorIds_1');
    //   console.log('Index dropped');
    // } catch (e) {
    //   console.log('Error dropping index:', e.message);
    // }
  } catch (e) {
    console.log('Error connecting to MongoDB:', e.message);
  }
};

module.exports = { connect };
