const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const wsExpress = require('express-ws')
const { DoctorRouter, DoctorAuthRouter } = require("./route/doctorRoute");
const { PatientRoute, PatientAuthRoute } = require("./route/patientRoute");
const {
  verifyPatientToken,
  verifyDoctorToken,
  getTokenType,
} = require("./middleware/jwtparser");
const { connect } = require("./db/connect");
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/doctor-auth", DoctorAuthRouter); // login signup etc
app.use("/doctor-appointment", verifyDoctorToken, DoctorRouter);
app.use("/patient-auth", PatientAuthRoute); // login signup etc
app.use("/patient-appointment",verifyPatientToken, PatientRoute);
wsExpress(app)
const {  wsRouter,restRouter } = require("./route/chatRoute");
app.use("/get-appointment-chats",restRouter)
app.use('/ws-chat',wsRouter)
app.get('/get-token-type',getTokenType)
const start = async () => {
  try {
    const db_url = process.env.mongod_url ||""
    console.log(db_url)
    const port = process.env.PORT || 8080;
    connect(db_url);
    app.listen(port, () =>
      console.log(`server up n running on ${port} and connected to db....`)
    );
  } catch (error) {
    console.log(error);
    console.log("server did not started because of error in db connection...");
  }
};
start();
