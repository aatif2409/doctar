const { PatientSchema } = require("../../model/patientModel");
const User = PatientSchema;
const {
  comparePassword,
  createJwt,
  generateVerificationToken,
  hashPassword,
  sendVerificationEmail,
} = require("../../Others/AuthFuntions");
async function signupUser(req, res) {
  try {
    const { name, email, password, mobile, dob, gender, age } = req.body;
    if (!name || !email || !password || !mobile || !dob || !gender || !age) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(500).json({ success: false, data: { msg: "User already Exist..." } });
      return;
    }
    const hashedpassword = await hashPassword(password);
    const token = generateVerificationToken();
    const data = await User.create({
      name,
      email,
      password: hashedpassword,
      mobile,
      verifyToken: token,
      verified: false,
      age: parseInt(age),
      dob: dob,
      gender: gender,
    });
    if (data) {
      const verificationLink = `http://localhost:3000/auth/signupverification/${token}?type=Patient`;
      const mailoptions = {
        to: data.email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email: ${verificationLink}`,
      };
      sendVerificationEmail(mailoptions);
      res.json({ success: true, data: { msg: "User signup successful." } });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: "Internal Server Error" });
    console.error(error);
  }
}
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const data = await User.findOne({ email: email });
    if (data) {
      const isUser = await comparePassword(password, data.password);
      if (isUser) {
        if(data.verified==false){
          return res.status(500).json({message:"User not verified"})
        }
        const token = createJwt(data._id.toString(), "patient");
        res.json({
          success: true,
          name:data.name,
          data: { token: token, msg: "Login Successfully !!!" },
        });
      } else {
        res.status(500).json({ success: false, data: { msg: "Wrong  Password" } });
      }
    } else {
      res.status(500).json({ success: false, data: { msg: "Wrong Credentials" } });
    }
  } catch (error) {
    res.json({
      success: false,
      data: { msg: JSON.stringify({ error: error }) },
    });
    console.log(error);
  }
}
const verifyEmailToken = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ msg: "Verification token is missing." });
  }
  try {
    const user = await User.findOne({ verifyToken: token });
    if (!user) {
      return res.status(400).json({
        success: true,
        data: { msg: "User not found or already verified." },
      });
    }
    user.verified = true;
   
    await user.save(); // Save the updated user record
    console.log(user);
    res.status(200).json({
      success: true,
      data: { msg: "User  verification successfully." },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An error occurred during email verification." });
  }
};
async function verifyForgotPasswordToken(req, res) {
  try {
    const { token, password } = req.body;

    const hashedpassword = await hashPassword(password);
    const data = await User.findOne({ verifyToken: token });
    console.log(data);
    if (!data) {
      return res.status(404).send("User not found or invalid token.");
    }
    if (data) {
      
      data.verified = true;
      data.password = hashedpassword;
      data.save();
      res.json({
        success: true,
        data: { msg: "password updated successfully" },
      });
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
}
async function forgotPassword(req, res) {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
     const token=user.verifyToken;
      console.log(token+"in patient");
      user.save();
      const verificationLink = `http://localhost:3000/auth/reset-password/reset?token=${token}&type=patient`;
      const mailoptions = {
        to: user.email,
        subject: "Reset password",
        text: `Please click the following link to Reset Password: ${verificationLink}`,
      };
    
      
      sendVerificationEmail(mailoptions);
      res.json({
        success: true,
        data: {
          msg: "Please Check your mail for reset password.",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      data: { msg: JSON.stringify({ error: error }) },
    });
    console.log(error);
  }
}
module.exports = {
  signupUser,
  forgotPassword,
  loginUser,
  verifyEmailToken,
  verifyForgotPasswordToken,
};
