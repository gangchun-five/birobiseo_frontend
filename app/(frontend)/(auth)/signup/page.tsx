import { AuthForm } from "../_components/AuthForm";
import "../auth.css";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <section className="auth-card">
          <p className="auth-eyebrow">Create account</p>
          <h2>회원가입</h2>
          <AuthForm mode="signup" />
        </section>
      </section>
    </main>
  );
}
