import React, { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Field, Input } from "../components/ui.jsx";
import { api } from "../services/api.js";

export function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // Only "login" or "forgot" now
  const [resetStep, setResetStep] = useState("email");
  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
    newPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  // Helper for demo login
  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");
    setMessage("Connecting to backend... this may take 10-30s if the server is asleep.");
    try {
      const payload = { email: "demoResident@gmail.com", password: "543216" };
      const response = await api.login(payload);
      onLogin(response.user);
    } catch (err) {
      setError(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("Connecting to backend...");
    setLoading(true);
    try {
      if (mode === "forgot") {
        if (resetStep === "email") {
          await api.forgotPassword({ email: form.email });
          setResetStep("otp");
          setMessage("OTP sent. Check your email.");
          return;
        }

        if (resetStep === "otp") {
          await api.verifyOtp({ email: form.email, otp: form.otp });
          setResetStep("password");
          setMessage("OTP verified. Set your new password.");
          return;
        }

        await api.resetPassword({ email: form.email, password: form.newPassword });
        setMode("login");
        setResetStep("email");
        setForm((current) => ({ ...current, password: "", otp: "", newPassword: "" }));
        setMessage("Password changed. Sign in with your new password.");
        return;
      }

      // Login Flow
      const payload = { email: form.email, password: form.password };
      const response = await api.login(payload);
      onLogin(response.user);
    } catch (err) {
      setError(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-surface">
      <div className="relative hidden w-[44%] overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.14),transparent_55%)]" />
        <div className="relative flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white ring-1 ring-brand-500/40">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-base font-semibold text-white">Shekhar Heights</span>
              <p className="text-xs text-zinc-500">Tower A · Sector 62</p>
            </div>
          </div>

          <div>
            <h1 className="max-w-sm text-[2.35rem] font-semibold leading-[1.15] tracking-tight text-white">
              Everything your society needs, in one place.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-400">
              Pay bills, register visitors, raise complaints, and stay in the loop with announcements — without the paperwork.
            </p>
            <div className="mt-10 grid gap-3">
              {[
                { title: "Gate pass in seconds", desc: "Pre-register visitors before they arrive" },
                { title: "Track every complaint", desc: "From submission to resolution" },
                { title: "Community decisions", desc: "Polls, events, and notices" }
              ].map((item) => (
                <div key={item.title} className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-zinc-600">© 2026 Shekhar Heights Residents Welfare Association</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <Building2 size={18} />
              </div>
              <span className="text-lg font-semibold text-ink">Shekhar Heights</span>
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            {mode === "login" ? "Sign in" : "Reset password"}
          </h2>
          <p className="mt-1.5 mb-6 text-sm text-slate-500">
            {mode === "login"
              ? "Use your registered email and password to access the portal."
              : "Verify your email with OTP before changing password"}
          </p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Field label="Email">
              <Input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
            </Field>
            {mode !== "forgot" && (
            <Field label="Password">
              <Input required type="password" value={form.password} onChange={update("password")} placeholder="••••••••" />
            </Field>
            )}
            {mode === "forgot" && resetStep === "otp" && (
              <Field label="OTP">
                <Input required inputMode="numeric" value={form.otp} onChange={update("otp")} placeholder="6-digit OTP" />
              </Field>
            )}
            {mode === "forgot" && resetStep === "password" && (
              <Field label="New password">
                <Input required minLength={6} type="password" value={form.newPassword} onChange={update("newPassword")} placeholder="New password" />
              </Field>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-brand-50 px-3 py-2.5 text-sm text-brand-800">{message}</p>
            )}

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {mode === "login"
                ? "Sign in"
                : resetStep === "email"
                  ? "Send OTP"
                  : resetStep === "otp"
                    ? "Verify OTP"
                    : "Change password"}
            </button>

            {/* DEMO LOGIN BUTTON */}
            {mode === "login" && (
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60"
              >
                Login with Demo Resident
              </button>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {mode === "login" && (
                <button
                  type="button"
                  className="font-medium text-brand-700 hover:text-brand-800"
                  onClick={() => {
                    setMode("forgot");
                    setResetStep("email");
                    setError("");
                    setMessage("");
                  }}
                >
                  Forgot password?
                </button>
              )}
              {mode === "forgot" && (
                <button
                  type="button"
                  className="font-medium text-slate-500 hover:text-slate-700"
                  onClick={() => {
                    setMode("login");
                    setResetStep("email");
                    setError("");
                    setMessage("");
                  }}
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}