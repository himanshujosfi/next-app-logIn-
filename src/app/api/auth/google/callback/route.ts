import prisma from "@/app/db/database";
import { lucia } from "@/auth";
import { google } from "@/lib/lucia/oauth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = req.nextUrl;
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        const storedState = (await cookies()).get("state")?.value;
        const codeVerifier = (await cookies()).get("codeVerifier")?.value;

        if (!storedState || !codeVerifier || state !== storedState) {
            return new NextResponse("Invalid request", { status: 400 });
        }

        const tokens = await google.validateAuthorizationCode(code, codeVerifier);
        const accessToken = tokens.accessToken();
        // console.log("access token", accessToken)

        if (!accessToken) {
            return new NextResponse("No access token returnec from google", {
                status: 400
            })
        }

        const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const googleUser = await googleUserResponse.json();

        if (!googleUser.email) {
            return new NextResponse("No email returned from Google", { status: 400 });
        }

        let user = await prisma.user.findUnique({
            where: { email: googleUser.email },
        });
        console.log("user", user)

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    username: googleUser.name,
                    displayName: googleUser.name,
                    id: crypto.randomUUID(),
                    profile: googleUser.picture,
                    googleId: googleUser.sub
                },
            });
        }

        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);

        (await cookies()).set(
            sessionCookie.name,
            sessionCookie.value,
            sessionCookie.attributes
        );

        // ✅ Redirect user to home page
        return NextResponse.redirect(new URL("/", req.url));

    } catch (err) {
        console.error("Google OAuth Callback Error:", err);
        return new NextResponse("Authentication failed", { status: 500 });
    }
}
