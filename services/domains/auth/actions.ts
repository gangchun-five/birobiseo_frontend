"use server";

import { revalidatePath } from "next/cache";
import { failure, formText, success, type ActionResult } from "@/utils/action-result";
import { createUser, loginUser } from "./repository";
import { createSession, clearSession, getSessionUser } from "@/utils/session";

export async function loginAction(formData: FormData): Promise<ActionResult<{ authenticated: boolean, isAdmin: boolean }>> {
  const email = formText(formData.get("email")).trim();
  const password = formText(formData.get("password"));

  if (!email || !password) {
    return failure("이메일과 비밀번호를 입력해주세요.");
  }

  const found = await loginUser(email, password);

  if (!found) {
    return failure("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  await createSession(found.id);
  revalidatePath("/");

  return success({ authenticated: true, isAdmin: found.memberType == "Admin" });
}

export async function signupAction(formData: FormData): Promise<ActionResult<{ authenticated: boolean, isAdmin: boolean }>> {
  const name = formText(formData.get("name")).trim();
  const email = formText(formData.get("email")).trim();
  const password = formText(formData.get("password"));
  const phone = formText(formData.get("phone")).trim();

  if (!name || !email || !password) {
    return failure("이름, 이메일, 비밀번호를 입력해주세요.");
  }

  if (password.length < 8) {
    return failure("비밀번호는 8자 이상이어야 합니다.");
  }

  try {
    const created = await createUser({ name, email, password, phone });
    await createSession(created.id);
    revalidatePath("/");

    return success({ authenticated: true, isAdmin: false });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return failure("이미 가입된 이메일입니다.");
    }

    return failure("회원가입 처리에 실패했습니다.");
  }
}

export async function getMeAction() {
  const user = await getSessionUser();

  return success({
    user: user ? { name: user.name, memberType: user.memberType } : null,
    authenticated: Boolean(user)
  });
}

export async function logoutAction(): Promise<ActionResult<{ authenticated: boolean }>> {
  await clearSession();
  revalidatePath("/");

  return success({ authenticated: false });
}
