const nodemailer = require("nodemailer");

module.exports = async function(mail){
  try{

    let testAccount = nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 587,
      secure: false, //
      auth: {
        user: "67896635c5473f", // 
        pass: "e1da1112fc0fd1", // 
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'jeandedieuuwizeye6@gmail.com', // sender address
      to: mail.address, // list of receivers
      subject: mail.subject, // Subject line
      text: mail.text, // plain text body
      html: mail.html, // html body
    });
    return info;

  }catch(err){
      return false
  }
}