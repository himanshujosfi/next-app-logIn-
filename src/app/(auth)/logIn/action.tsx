"use server";

import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { LogInSchema } from "@/lib/validator";
import prisma from "@/app/db/database";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function LogInApi(
    credentials: z.infer<typeof LogInSchema>
): Promise<{ error?: string; user?: any }> {
    try {
        const { email, password } = LogInSchema.parse(credentials);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "Invalid email or password" };
        }

        // compare password hash
        if (!user.passwordHash || typeof user.passwordHash !== "string") {
            return { error: "Invalid email or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return { error: "Invalid email or password" };
        }

        const existingSession = await prisma.session.findFirst({
            where: { userId: user.id }
        })
        let session
        if (existingSession) {
            session = existingSession
        }
        else {
            session = await lucia.createSession(user.id, {});
        }
        const sessionCookie = lucia.createSessionCookie(session.id);

        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        return { user };
    } catch (err) {
        console.error("LogIn failed:", err);
        return { error: "Something went wrong. Please try again." };
    }
}
