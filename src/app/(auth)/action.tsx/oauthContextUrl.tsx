"use server";

import { google } from "@/lib/lucia/oauth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";


export async function GoogleUrl() {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();

        (await cookies()).set("state", state, {
            httpOnly: true,
        });

        (await cookies()).set("codeVerifier", codeVerifier, {
            httpOnly: true,
        });


        const authorizationURL = google.createAuthorizationURL(
            state,
            codeVerifier,
            ["profile", "email"]
        )
        // console.log("Auth URL:", authorizationURL.toString());

        return { url: authorizationURL.toString() }
    } catch (err) {
        // console.error("Password reset failed:", err)
        return { error: "Something went wrong. Please try again." };
    }
}
