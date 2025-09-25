import nodemailer from "nodemailer";

export async function sendMail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // ✅ Gmail SMTP host
        port: 465,              // ✅ SSL port
        secure: true,           // ✅ true for 465
        auth: {
            user: process.env.EMAIL_USER, // your full Gmail address
            pass: process.env.EMAIL_PASS, // your Gmail App Password
        },
    });

    await transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}
