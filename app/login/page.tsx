"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState<string|null>(null); const router = useRouter();
  async function onSubmit(e: React.FormEvent) { e.preventDefault(); const res = await signIn("credentials", { email, password, redirect: false }); if (res?.error) { setError("Invalid credentials"); return; } router.push("/dashboard"); }
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={onSubmit} className="max-w-sm w-full space-y-4 bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Business Login</h1>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full border p-2 rounded" />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded font-semibold">Sign In</button>
      </form>
    </main>
  );
}