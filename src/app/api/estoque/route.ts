import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: {
      batches: {
        where: {
          currentQuantity: { gt: 0 },
          expirationDate: { gt: new Date() }
        },
        orderBy: { expirationDate: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });
  
  return NextResponse.json(products);
}
