"use client";
import useSWR from "swr";
import Link from "next/link";
const fetcher = (url: string) => fetch(url).then((r) => r.json());
export default function DashboardPage() {
  const { data, error } = useSWR("/api/dashboard", fetcher);
  if (error) return <main className="p-8">Failed to load.</main>;
  if (!data) return <main className="p-8">Loading...</main>;
  const m = data.metrics;
  const cards = [
    { label: "Active Links", value: m.activeLinks },
    { label: "Page Views", value: m.views },
    { label: "Link Clicks", value: m.clicks },
  ];
  return (
    <main className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/settings" className="text-blue-600">Settings</Link>
          <Link href="/links" className="text-blue-600">Links</Link>
          <a href="/api/qr" className="text-blue-600">Download QR</a>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white p-6 rounded-xl shadow-sm border">
            <p className="text-gray-500 text-sm">{c.label}</p>
            <p className="text-3xl font-bold mt-2">{c.value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500">Public page: <a className="text-blue-600" href={`/p/${data.business?.slug}`}>/p/{data.business?.slug}</a></p>
    </main>
  );
}