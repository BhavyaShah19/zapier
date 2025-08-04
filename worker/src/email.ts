import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_API_KEY,
    },
});
export async function sendEmail(to: string, body: string) {
    await transporter.sendMail({
        from: 'onboarding@resend.dev',
        to,
        subject: 'Hello from zapier',
        text: body,
    });

    console.log("sending email to", to)
    console.log("body", body)
}