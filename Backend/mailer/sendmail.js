const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

const loginSendMail = async (email) => {
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Login Sucessfull`,
            html: ` <div style="margin-top: 50px;">
            <tr>
               <td color: #161c2d; font-size: 18px; font-weight: 600;">
                  User login successful with email: ${email},
               </td>
           </tr> 
</div>`,
        }
        await transporter.sendMail(mailOptions);
        return "Mail sent successfully";
    } catch (error) {
        throw new Error("Failed to send mail. Please try again later.");
    }
}
const forgotPasswordSendMail = async (email, otp) => {
    try {

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `Password Reset OTP`,
            html: ` <div style="margin-top: 50px;">
            <tr>
               <td color: #161c2d; font-size: 18px; font-weight: 600;">
                  Your OTP is ${otp}. It is valid for 10 minutes.
               </td>
           </tr> 
</div>`,
        }
        await transporter.sendMail(mailOptions);
        return "Mail sent successfully";
    } catch (error) {
        throw new Error("Failed to send mail. Please try again later.");
    }
}

module.exports = { loginSendMail, forgotPasswordSendMail };