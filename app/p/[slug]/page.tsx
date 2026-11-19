import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug },
    include: { links: { where: { enabled: true }, orderBy: { position: "asc" } } },
  });
  if (!business) notFound();

  // record view (best effort)
  try { await prisma.pageView.create({ data: { businessId: business.id } }); } catch {}

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-md w-full text-center">
        {business.logoUrl && <img src={business.logoUrl} alt={business.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />}
        <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
        {business.description && <p className="text-gray-600 mb-6">{business.description}</p>}
        <div className="space-y-3">
          {business.links.map((link) => (
            <a key={link.id} href={`/api/click?id=${link.id}`} className="block bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700">
              {link.label}
            </a>
          ))}
        </div>
        <div className="mt-8 text-sm text-gray-500">
          {business.contactPhone && <p>📞 {business.contactPhone}</p>}
          {business.contactEmail && <p>✉️ {business.contactEmail}</p>}
          {business.websiteUrl && <p><a href={business.websiteUrl} className="text-blue-600">{business.websiteUrl}</a></p>}
        </div>
      </div>
    </main>
  );
}