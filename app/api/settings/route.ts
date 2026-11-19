import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = await prisma.businessAdmin.findUnique({ where: { id: session.user.id as string } });
  if (!admin) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const business = await prisma.business.findUnique({ where: { id: admin.businessId }, include: { links: { orderBy: { position: "asc" } } } });
  return NextResponse.json({ business });
}
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = await prisma.businessAdmin.findUnique({ where: { id: session.user.id as string } });
  if (!admin) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const body = await req.json();
  const business = await prisma.business.update({
    where: { id: admin.businessId },
    data: {
      name: body.name ?? undefined,
      description: body.description ?? undefined,
      logoUrl: body.logoUrl ?? undefined,
      contactPhone: body.contactPhone ?? undefined,
      contactEmail: body.contactEmail ?? undefined,
      websiteUrl: body.websiteUrl ?? undefined,
    },
  });
  return NextResponse.json({ business });
}