"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { loginAction, signupAction } from "@/services/domains/auth/actions";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      const result = isSignup ? await signupAction(formData) : await loginAction(formData);

      if (!result.success || !result.data) {
        throw new Error(result.error?.message ?? "요청 처리에 실패했습니다.");
      }

      if (result.data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/mypage");
      }
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "요청 처리에 실패했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isSignup && (
        <label>
          <span>이름</span>
          <input name="name" autoComplete="name" placeholder="김농부" required />
        </label>
      )}
      <label>
        <span>이메일</span>
        <input name="email" type="email" autoComplete="email" placeholder="farmer@example.com" required />
      </label>
      {isSignup && (
        <label>
          <span>휴대폰 번호</span>
          <input name="phone" autoComplete="tel" placeholder="010-1234-5678" />
        </label>
      )}
      <label>
        <span>비밀번호</span>
        <input name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} placeholder="8자 이상 입력" required minLength={8} />
      </label>

      {error && <p className="auth-error">{error}</p>}

      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "처리 중..." : isSignup ? "회원가입" : "로그인"}
      </button>

      <p className="auth-switch">
        {isSignup ? "이미 계정이 있으신가요?" : "아직 계정이 없으신가요?"}
        <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "로그인" : "회원가입"}</Link>
      </p>
    </form>
  );
}
