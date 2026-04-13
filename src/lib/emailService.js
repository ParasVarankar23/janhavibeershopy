import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: process.env.SMTP_ALLOW_SELF_SIGNED !== "true",
        },
    });

    return transporter.sendMail({
        from: `"Janhavi Beer Shop" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html,
    });
}