"use server";

import { lucia } from "@/auth";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { LogInSchema } from "@/lib/validator";
import prisma from "@/app/db/database";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function LogIn(
    credentials: z.infer<typeof LogInSchema>
): Promise<{ error?: string }> {
    try {
        const { email, password } = LogInSchema.parse(credentials);
        const userId = generateIdFromEntropySize(10);

        // check email
        const existingEmail = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });
        if (existingEmail) {
            return { error: "Email already taken" };
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);



        // create session
        const session = await lucia.createSession(userId, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        // return redirect("/");
    } catch (err) {
        console.error("SignUp failed:", err);
        return { error: "Something went wrong. Please try again." };
    }
    return {}; // Ensure a return value for all code paths
}
