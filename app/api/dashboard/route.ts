import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = await prisma.businessAdmin.findUnique({ where: { id: session.user.id as string } });
  if (!admin) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const businessId = admin.businessId;
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  const [activeLinks, views, clicks] = await Promise.all([
    prisma.actionLink.count({ where: { businessId, enabled: true } }),
    prisma.pageView.count({ where: { businessId } }),
    prisma.linkClick.count({ where: { businessId } }),
  ]);
  return NextResponse.json({ businessId, business, metrics: { activeLinks, views, clicks } });
}