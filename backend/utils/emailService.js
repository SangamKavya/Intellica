const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Login',
    text: `            Hello Welcome To Our MIC INTELLICA PORTAl 
                      Your OTP is: ${otp}. It expires in 10 minutes.
                                  Have A Great Day`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

module.exports = { sendOTP };