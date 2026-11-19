import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

function isValidUrl(url: string): boolean {
  try { const u = new URL(url); return u.protocol === "http:" || u.protocol === "https:" || u.protocol === "tel:" || u.protocol === "mailto:"; } catch { return false; }
}

async function getBusinessId(userId: string) {
  const admin = await prisma.businessAdmin.findUnique({ where: { id: userId } });
  return admin?.businessId ?? null;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id as string);
  if (!businessId) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const links = await prisma.actionLink.findMany({ where: { businessId }, orderBy: { position: "asc" } });
  return NextResponse.json({ links });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id as string);
  if (!businessId) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });

  const count = await prisma.actionLink.count({ where: { businessId } });
  if (count >= 3) return NextResponse.json({ error: "max_links_reached" }, { status: 400 });

  const body = await req.json();
  const { label, url, position, enabled } = body;
  if (!label || !url) return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  if (!isValidUrl(url)) return NextResponse.json({ error: "invalid_url" }, { status: 400 });

  const link = await prisma.actionLink.create({
    data: { businessId, label, url, position: position ?? count, enabled: enabled ?? true },
  });
  return NextResponse.json({ link }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id as string);
  if (!businessId) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  const existing = await prisma.actionLink.findFirst({ where: { id, businessId } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (data.url && !isValidUrl(data.url)) return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  const link = await prisma.actionLink.update({ where: { id }, data: {
    label: data.label ?? undefined,
    url: data.url ?? undefined,
    position: data.position != null ? Number(data.position) : undefined,
    enabled: data.enabled != null ? Boolean(data.enabled) : undefined,
  } });
  return NextResponse.json({ link });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const businessId = await getBusinessId(session.user.id as string);
  if (!businessId) return NextResponse.json({ error: "admin_not_found" }, { status: 404 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id_required" }, { status: 400 });
  const existing = await prisma.actionLink.findFirst({ where: { id, businessId } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.actionLink.delete({ where: { id } });
  return NextResponse.json({ success: true });
}