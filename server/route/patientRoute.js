const {loginUser,signupUser,forgotPassword,verifyEmailToken,verifyForgotPasswordToken} = require('../controller/patient/PatientAuthenticationHandler')
const {getPatientAppointments,acceptYourDoctorForTreatment,reviewDoctor, createAppointment,getuserprofile,pastappointment} = require('../controller/patient/PatientAppointmentHandler')
const PatientRoute = require('express').Router() // jwt require 
PatientRoute.post('/create-appointment',createAppointment )
PatientRoute.route('/get-patient-appointments').get(getPatientAppointments)
PatientRoute.route('/accept-your-doctor').post(acceptYourDoctorForTreatment);
PatientRoute.route('/review-doctor').post(reviewDoctor)
PatientRoute.route('/past-appointments').get(pastappointment)
PatientRoute.route('/user-profile').get(getuserprofile);

const PatientAuthRoute = require('express').Router() // not jwt

PatientAuthRoute.route('/login').post(loginUser)
PatientAuthRoute.route('/signup').post(signupUser)
PatientAuthRoute.route('/reset-password').post(forgotPassword)
PatientAuthRoute.route('/verify-email-token').post(verifyEmailToken)
PatientAuthRoute.route('/verify-forgot-password-token').post(verifyForgotPasswordToken)
module.exports = {PatientRoute,PatientAuthRoute}