import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
    console.log("Trying to send email to:", options.email);
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: options.email,
        subject: options.subject,
        text: options.text,
    });
    console.log("Email sent successfully");
}

export default sendEmail;