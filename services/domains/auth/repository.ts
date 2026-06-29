import { prisma } from "@/services/prisma";
import { createDefaultFarm } from "../farm/repository";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }

  return user;
}

export async function createUser(data: { name: string; email: string; password: string; phone?: string }) {
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      passwordHash: hashPassword(data.password),
      memberType: "User",
      subscriptionTier: "FREE"
    },
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

  await createDefaultFarm(user.id);

  return user;
}

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEY_LENGTH).toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, storedHash] = passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = scryptSync(password, salt, KEY_LENGTH);
  const stored = Buffer.from(storedHash, "hex");

  return stored.length === hash.length && timingSafeEqual(stored, hash);
}
