"use client";
import { useEffect, useState } from "react";
export default function SettingsPage() {
  const [form, setForm] = useState<any>({}); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<string|null>(null);
  useEffect(() => { fetch("/api/settings").then((r)=>r.json()).then((d)=>{ setForm(d.business||{}); setLoading(false); }); }, []);
  async function onSubmit(e: React.FormEvent) { e.preventDefault(); setSaving(true); setMsg(null); const res = await fetch("/api/settings", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name: form.name, description: form.description, logoUrl: form.logoUrl, contactPhone: form.contactPhone, contactEmail: form.contactEmail, websiteUrl: form.websiteUrl }) }); setSaving(false); setMsg(res.ok?"Saved.":"Save failed."); }
  if (loading) return <main className="p-8">Loading...</main>;
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-sm border">
        <label className="block"><span className="text-sm text-gray-600">Business name</span><input className="w-full border p-2 rounded mt-1" value={form.name||""} onChange={(e)=>setForm({...form,name:e.target.value})} /></label>
        <label className="block"><span className="text-sm text-gray-600">Description</span><textarea className="w-full border p-2 rounded mt-1" value={form.description||""} onChange={(e)=>setForm({...form,description:e.target.value})} /></label>
        <label className="block"><span className="text-sm text-gray-600">Logo URL</span><input className="w-full border p-2 rounded mt-1" value={form.logoUrl||""} onChange={(e)=>setForm({...form,logoUrl:e.target.value})} /></label>
        <label className="block"><span className="text-sm text-gray-600">Contact phone</span><input className="w-full border p-2 rounded mt-1" value={form.contactPhone||""} onChange={(e)=>setForm({...form,contactPhone:e.target.value})} /></label>
        <label className="block"><span className="text-sm text-gray-600">Contact email</span><input className="w-full border p-2 rounded mt-1" value={form.contactEmail||""} onChange={(e)=>setForm({...form,contactEmail:e.target.value})} /></label>
        <label className="block"><span className="text-sm text-gray-600">Website URL</span><input className="w-full border p-2 rounded mt-1" value={form.websiteUrl||""} onChange={(e)=>setForm({...form,websiteUrl:e.target.value})} /></label>
        <button disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded font-semibold">{saving?"Saving...":"Save"}</button>
        {msg && <p className="text-sm text-gray-600">{msg}</p>}
      </form>
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="font-semibold mb-2">NFC Setup</h2>
        <p className="text-sm text-gray-600">Program any NFC tag (NTAG213/215/216) to open this URL:</p>
        <code className="block bg-gray-100 p-2 rounded mt-2 text-sm">{process.env.NEXT_PUBLIC_APP_URL}/p/{form.slug}</code>
        <p className="text-xs text-gray-500 mt-2">Use an NFC writer app (e.g., NFC Tools) to write a URL record. Physical tags are separate from the software subscription.</p>
      </div>
    </main>
  );
}