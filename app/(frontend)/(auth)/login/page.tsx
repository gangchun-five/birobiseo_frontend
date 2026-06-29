import { AuthForm } from "../_components/AuthForm";
import "../auth.css";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <section className="auth-card">
          <p className="auth-eyebrow">Welcome back</p>
          <h2>로그인</h2>
          <AuthForm mode="login" />
        </section>
      </section>
    </main>
  );
}
