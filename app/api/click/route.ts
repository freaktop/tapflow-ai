import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.redirect(new URL("/", req.url));
  const link = await prisma.actionLink.findUnique({ where: { id } });
  if (!link || !link.enabled) return NextResponse.redirect(new URL("/", req.url));
  try { await prisma.linkClick.create({ data: { businessId: link.businessId, linkId: link.id } }); } catch {}
  return NextResponse.redirect(link.url);
}