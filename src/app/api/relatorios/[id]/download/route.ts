import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const target = new URL(`/api/relatorios/${id}/pdf`, req.url);
  return NextResponse.redirect(target);
}
