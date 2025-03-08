const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const saltRounds = parseInt(process.env.SALTROUNDS, 10) || 10;
const jwtSecret = "secret";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aatifrais6609@gmail.com",
    pass: "qcgo dxws fpys sefv ",
  },
});
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const comparePassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
const createJwt = (id,type) => { // id and type = doctor or patient
  const token = jwt.sign(
    { _id: id,type :type },
    jwtSecret,
    //    {
    //   expiresIn: "24h",
    // }
  );
  return token;
};
const sendVerificationEmail = ( mailOptionsObject) => {
  const mailOptions = {
    ...mailOptionsObject,
    from: "aatifrais6609@gmail.com", // Sender's email
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Email verification error: " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
module.exports=  {
  generateVerificationToken,
  hashPassword,
  comparePassword,
  createJwt,
  sendVerificationEmail,
};
