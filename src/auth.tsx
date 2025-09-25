import { Lucia, User } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production"
        }
    },
    getUserAttributes: (attributes) => {
        return {
            username: attributes.username,
            email: attributes.email,
            email_verified

        };
    }
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}
interface DatabaseUserAttributes {
    username: string;
    email: string;
    password: string | null;
    id: string;
    created_at: Date;
    updated_at: Date;
    displayName: string;
    avatarUrl: string | null;
    googleId: string | null;
    email_verified: boolean;
}




import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "./app/db/database";

export default async function validateRequest(req: NextApiRequest, res: NextApiResponse): Promise<User | null> {
    const sessionId = req.cookies?.[lucia.sessionCookieName] ?? null;
    if (!sessionId) {
        return null;
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (!session) {
        res.setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
    }
    if (session && session.fresh) {
        res.setHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    }
    return user;
}