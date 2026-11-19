"use client";
import useSWR from "swr";
import { useState } from "react";
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function LinksPage() {
  const { data, mutate } = useSWR("/api/links", fetcher);
  const [form, setForm] = useState({ label: "", url: "", position: 0 });

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ label: "", url: "", position: 0 });
    mutate();
  }

  async function remove(id: string) {
    await fetch(`/api/links?id=${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Action Links (max 3)</h1>
      <form onSubmit={addLink} className="bg-white p-6 rounded-xl shadow-sm border mb-6 space-y-4">
        <input placeholder="Label" required value={form.label} onChange={(e)=>setForm({...form,label:e.target.value})} className="w-full border p-2 rounded" />
        <input placeholder="URL" required value={form.url} onChange={(e)=>setForm({...form,url:e.target.value})} className="w-full border p-2 rounded" />
        <button className="bg-blue-600 text-white p-2 rounded font-semibold">Add Link</button>
      </form>
      <div className="bg-white rounded-xl shadow-sm border divide-y">
        {data?.links?.length ? data.links.map((l: any) => (
          <div key={l.id} className="p-4 flex justify-between items-center">
            <div><p className="font-medium">{l.label}</p><p className="text-sm text-gray-500">{l.url}</p></div>
            <button onClick={() => remove(l.id)} className="text-red-600 text-sm">Delete</button>
          </div>
        )) : <div className="p-4 text-gray-500 text-sm">No links yet.</div>}
      </div>
    </main>
  );
}