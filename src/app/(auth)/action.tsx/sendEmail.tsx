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
        service: "gmail",
        port: 465,
        secure: true,
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
