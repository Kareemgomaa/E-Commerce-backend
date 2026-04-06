import nodemailer from "nodemailer";

const sendEmail = async options => {
    console.log("Configuring transport with:", process.env.MAILTRAP_USER);
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: Number(process.env.MAILTRAP_PORT),
        secure: true,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });
    console.log("Trying to send email to:", options.email);
    const mailOptions = {
        from: process.env.MAILTRAP_USER,
        to: options.email,
        subject: options.subject,
        text: options.text,
    };
    await transporter.sendMail(mailOptions);
}

export default sendEmail;