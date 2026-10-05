"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button, ErrorBox, inputCls } from "@/components/ui";

function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      setLoading(false);
      return;
    }
    const next = params.get("next");
    window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-charcoal-900">
          Email
        </label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-charcoal-900">
          Password
        </label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
      </div>
      {error && <ErrorBox message={error} />}
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-charcoal-900 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center text-white">
          <svg viewBox="0 0 64 52" className="mx-auto h-12 w-auto" aria-hidden>
            <path d="M2 38 L14 18 L19 29 L27 13 L31 22 L62 2 L42 30 L36 18 Z" fill="#33CBCC" />
            <path d="M16 50 L27 24 Q29 20 33 20 Q36 20 37 24 L40 34 L46 23 Q48 20 51 20 Q55 20 55 25 L56 50 L49 50 L48.5 33 L42 46 Q41 48 39 48 Q37 48 36 46 L31.5 33 L24 50 Z" fill="white" />
          </svg>
          <h1 className="mt-4 text-xl font-extrabold">Momentum superadmin</h1>
        </div>
        <div className="rounded-2xl bg-white p-7 shadow-2xl">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
