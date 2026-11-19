import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">TapFlow AI</h1>
        <p className="text-xl text-gray-600 mb-8">One mobile destination for your customers via NFC tap or QR scan.</p>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">Business Login</Link>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Pricing</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border inline-block">
          <p className="text-3xl font-bold">$149 <span className="text-base font-normal text-gray-500">setup</span></p>
          <p className="text-3xl font-bold mt-2">$19 <span className="text-base font-normal text-gray-500">/ month</span></p>
          <p className="text-sm text-gray-500 mt-2">Physical NFC tags quoted separately.</p>
        </div>
      </section>
    </main>
  );
}