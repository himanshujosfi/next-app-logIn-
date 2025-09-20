"use server";

import { lucia } from "@/auth";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";
import { SignInSchema } from "@/lib/validator";
import prisma from "@/app/db/database";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function SignUp(
    credentials: z.infer<typeof SignInSchema>
): Promise<{ error?: string }> {
    try {
        const { username, email, password } = SignInSchema.parse(credentials);
        const userId = generateIdFromEntropySize(10);

        // check username
        const existingUser = await prisma.user.findFirst({
            where: { username: { equals: username, mode: "insensitive" } },
        });
        if (existingUser) {
            return { error: "Username already taken" };
        }

        // check email
        const existingEmail = await prisma.user.findFirst({
            where: { email: { equals: email, mode: "insensitive" } },
        });
        if (existingEmail) {
            return { error: "Email already taken" };
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // create user
        await prisma.user.create({
            data: {
                id: userId,
                username,
                displayName: username,
                email,
                passwordHash,
            },
        });

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
