const Sib = require("../../config/email/brevo.js");
const fs = require("fs");
const path = require("path");

const sendEmail = async (data) => {
  try {
    /* Choose the template file */
    let templatePath;
    if (data?.template == "otp_verify") {
      templatePath = path.join(__dirname, "../../../public/sentOtpEmail.html");
    }

    const template = fs.readFileSync(templatePath, "utf8");
    let htmlContent;
    if (data.template == "otp_verify") {
      htmlContent = template.replace("{{OTP_CODE}}", data.otp);
    }

    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: process.env.SENDER_EMAIL,
      name: process.env.SENDER_NAME,
    };
    const receivers = [
      {
        email: data.email,
      },
    ];

    if (!(template || templatePath || data?.email || htmlContent)) {
      console.log("Check you sending email body. Something missing");
    }
    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        subject: data?.subject,
        htmlContent,
        attachment: data?.attachment,
      })
      .then((info) => {
        console.log(`Email Sent to ${data.email}`);
      })
      .catch((error) => {
        console.log("Error is : ", error);
      });
  } catch (err) {
    console.log("we are getting error in send Email: ", err);
  }
};

module.exports = { sendEmail };
