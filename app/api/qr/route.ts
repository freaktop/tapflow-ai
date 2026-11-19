import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = await prisma.businessAdmin.findUnique({ where: { id: session.user.id as string } });
  if (!admin) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const business = await prisma.business.findUnique({ where: { id: admin.businessId } });
  if (!business) return NextResponse.json({ error: "business_not_found" }, { status: 404 });

  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/p/${business.slug}`;
  const png = await QRCode.toBuffer(url, { width: 512, margin: 2 });
  return new NextResponse(png, { status: 200, headers: { "Content-Type": "image/png", "Content-Disposition": `attachment; filename="${business.slug}-qr.png"` } });
}