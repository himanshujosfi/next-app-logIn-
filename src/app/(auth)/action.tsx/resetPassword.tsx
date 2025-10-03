"use server";

import prisma from "@/app/db/database";
import bcrypt from "bcryptjs";

export async function ResetPassword(
    token: string,
    newPassword: string,
): Promise<{ error?: string; success?: boolean }> {
    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return { error: "Expired reset token." };
        }

        // check expiry
        if (resetToken.expiresAt < new Date()) {
            await prisma.passwordResetToken.delete({ where: { token } });
            return { error: "Reset link has expired." };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // update user password
        await prisma.user.update({
            where: { id: resetToken.userId },
            data: { passwordHash: hashedPassword },
        });

        // delete the token after use
        await prisma.passwordResetToken.delete({
            where: { token },
        });

        return { success: true };
    } catch (err) {
        console.error("Password reset failed:", err);
        return { error: "Something went wrong. Please try again." };
    }
}
