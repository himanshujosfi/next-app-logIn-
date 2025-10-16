"use server";

import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function getCurrentUser() {
    try {
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get(lucia.sessionCookieName);

        if (!sessionCookie) return null;

        const { session, user } = await lucia.validateSession(sessionCookie.value);

        // Session expired or invalid
        if (!session) return null;

        return user;
    } catch (error) {
        console.error("getCurrentUser error:", error);
        return null;
    }
}
