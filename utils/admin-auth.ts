import { redirect } from "next/navigation";

import { getSessionUser } from "@/utils/session";

export async function getAdminUser() {
  const user = await getSessionUser();
  return user?.memberType === "Admin" ? user : null;
}

export async function requireAdminUser() {
  const user = await getAdminUser();

  if (!user) {
    redirect("/");
  }

  return user;
}
