import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "../services/prisma";

export const SESSION_COOKIE = "birobiseo_session";

type Session = {
  id: string;
  userId: number;
  createdAt: number;
};

const globalForSessions = globalThis as typeof globalThis & {
  __birobiseoSessions?: Map<string, Session>;
};

const sessions = globalForSessions.__birobiseoSessions ?? new Map<string, Session>();
globalForSessions.__birobiseoSessions = sessions;

export async function createSession(userId: number) {
  const id = randomUUID();
  sessions.set(id, {
    id,
    userId,
    createdAt: Date.now()
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return getSessionUser();
}

export async function clearSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      memberType: true,
      subscriptionTier: true,
      createdAt: true
    }
  });

  return user
    ? {
        ...user,
        createdAt: user.createdAt.toISOString()
      }
    : null;
}
