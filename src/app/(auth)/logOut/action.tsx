"use server";

import { lucia } from "@/auth";
import { cookies } from "next/headers";

export async function LogOut(): Promise<{ error?: string }> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get(lucia.sessionCookieName);

        if (!sessionCookie) {
            return { error: "No active session found" };
        }

        await lucia.invalidateSession(sessionCookie.value);

        cookieStore.set(lucia.sessionCookieName, "", {
            path: "/",
            httpOnly: true,
            maxAge: 0,
        });

        return {};
    } catch (err) {
        console.error("LogOut failed:", err);
        return { error: "Something went wrong. Please try again." };
    }
}
