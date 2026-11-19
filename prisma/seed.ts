import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const business = await prisma.business.upsert({ where: { slug: "demo-business" }, update: {}, create: { name: "Demo Business", slug: "demo-business", description: "Tap or scan to connect with us.", contactPhone: "+1 555 0100", contactEmail: "hello@example.com" } });
  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.businessAdmin.upsert({ where: { email: "admin@tapflow.ai" }, update: {}, create: { businessId: business.id, email: "admin@tapflow.ai", passwordHash, name: "Demo Admin" } });
  await prisma.actionLink.createMany({ data: [
    { businessId: business.id, label: "Book an appointment", url: "https://example.com/book", position: 0, enabled: true },
    { businessId: business.id, label: "Call us", url: "tel:+15550100", position: 1, enabled: true },
    { businessId: business.id, label: "Visit website", url: "https://example.com", position: 2, enabled: true },
  ] });
  console.log("Seed complete. Login: admin@tapflow.ai / demo1234. Public page: /p/demo-business");
}
main().catch((e)=>{console.error(e);process.exit(1);}).finally(()=>prisma.$disconnect());