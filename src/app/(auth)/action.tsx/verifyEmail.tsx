"use server";

import { VerifyEmailSchema } from "@/lib/validator";
import prisma from "@/app/db/database";
import { z } from "zod";
import crypto from "crypto";
import { sendMail } from "./sendEmail";


export async function EmailVerify(
    { credentials }: { credentials: z.infer<typeof VerifyEmailSchema>; }): Promise<{
        error?: string; user?: any; success?: boolean
    }> {
    try {
        const { email } = VerifyEmailSchema.parse(credentials);

        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new Error("User not found");
            // or: setError("User not found"); return;
        }

        // generate secure token
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 10) // valid 10mins

        const reset = await prisma.passwordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt,

            },
        });
        console.log("reset ", reset)

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset?token=${token}`;
        const sendmails = await sendMail({
            to: user.email!,
            subject: "Reset your password",
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
        });
        console.log("mail", sendmails)
        console.log("user", user)
        return { success: true };


    } catch (err) {
        console.error("LogIn failed:", err);
        return { error: "Something went wrong. Please try again." };
    }
}
