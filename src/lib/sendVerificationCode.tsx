import prisma from "@/app/db/database";
import { TimeSpan, createDate } from "oslo";
import { generateRandomString, alphabet } from "oslo/crypto";

export async function sendVerificationCode(userId: string, email: string) {
    // Generate a 6-digit numeric code
    const code = generateRandomString(6, alphabet("0-9"));

    // Expire in 15 minutes
    const expiresAt = createDate(new TimeSpan(15, "m"));

    // Remove any old codes
    await prisma.email_verified.deleteMany({ where: { userId } });

    // Save new verification entry
    await prisma.email_verified.create({
        data: {
            userId,
            code,
            expiresAt
        }
    });

    // Send email
    await sendMail({
        to: email,
        subject: "Verify your email",
        html: `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h3>${code}</h3>
            <p>This code expires in 15 minutes.</p>
        `
    });

    return true;
}




import nodemailer from "nodemailer";

export async function sendMail({
    to,
    subject,
    html
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const transporter = nodemailer.createTransport({
        service: "Gmail", // or SMTP config
        auth: {
            user: process.env.EMAIL_USER, // e.g. your gmail
            pass: process.env.EMAIL_PASS  // gmail app password
        }
    });

    await transporter.sendMail({
        from: `"My App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}
