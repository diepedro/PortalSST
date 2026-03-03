"use server"

import { prisma } from "@/lib/prisma"
import { MovementType, Product, StockBatch } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getProducts(search?: string) {
  return await prisma.product.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    } : {},
    include: {
      batches: {
        orderBy: { expirationDate: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  })
}

export async function upsertProduct(data: Partial<Product>) {
  const { id, ...rest } = data
  
  const product = id 
    ? await prisma.product.update({ where: { id }, data: rest as any })
    : await prisma.product.create({ data: rest as any })

  revalidatePath('/dashboard/estoque')
  return product
}

export async function addBatch(data: {
  productId: string,
  batchNumber: string,
  expirationDate: Date,
  quantity: number
}) {
  console.log("Recebendo dados para novo lote:", data);
  try {
    if (!data.productId) throw new Error("ID do produto é obrigatório");
    
    const result = await prisma.$transaction(async (tx) => {
      const newBatch = await tx.stockBatch.create({
        data: {
          productId: data.productId,
          batchNumber: data.batchNumber,
          expirationDate: data.expirationDate,
          initialQuantity: data.quantity,
          currentQuantity: data.quantity,
        }
      })

      await tx.stockMovement.create({
        data: {
          batchId: newBatch.id,
          type: MovementType.ENTRADA,
          quantity: data.quantity,
          description: "Entrada inicial de lote"
        }
      })

      return newBatch
    })

    console.log("Lote criado com sucesso:", result.id);
    revalidatePath('/dashboard/estoque')
    return { success: true, data: result }
  } catch (error: any) {
    console.error("ERRO CRÍTICO AO ADICIONAR LOTE:", error)
    return { success: false, error: error.message || "Erro desconhecido no servidor" }
  }
}

export async function consumeStockForActivity(
  atividadeId: string,
  items: { batchId: string; quantity: number }[],
  userId?: string
) {
  try {
    return await prisma.$transaction(async (tx) => {
      for (const item of items) {
        // 1. Busca lote e valida existência
        const batch = await tx.stockBatch.findUnique({
          where: { id: item.batchId },
          include: { product: true }
        })

        if (!batch) throw new Error(`Lote não encontrado.`)

        // 2. Valida se está dentro da validade
        if (new Date(batch.expirationDate) < new Date()) {
          throw new Error(`O lote ${batch.batchNumber} (${batch.product.name}) está vencido!`)
        }

        // 3. Valida se há quantidade disponível
        if (batch.currentQuantity < item.quantity) {
          throw new Error(`Estoque insuficiente no lote ${batch.batchNumber}. Disponível: ${batch.currentQuantity}`)
        }

        // 4. Subtrai a quantidade
        await tx.stockBatch.update({
          where: { id: item.batchId },
          data: {
            currentQuantity: { decrement: item.quantity }
          }
        })

        // 5. Gera registro de movimentação
        await tx.stockMovement.create({
          data: {
            batchId: item.batchId,
            type: MovementType.SAIDA,
            quantity: item.quantity,
            atividadeId: atividadeId,
            userId: userId,
            description: `Saída vinculada à Blitz/Agendamento ID: ${atividadeId}`
          }
        })
      }
      
      revalidatePath('/dashboard/estoque')
      revalidatePath('/dashboard/agenda')
      return { success: true }
    })
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteProduct(id: string) {
  // Verifica se há movimentações antes de excluir
  const hasMovements = await prisma.stockMovement.findFirst({
    where: { batch: { productId: id } }
  })

  if (hasMovements) {
    throw new Error("Não é possível excluir um produto que já possui movimentações de estoque. Considere desativá-lo.")
  }

  await prisma.product.delete({ where: { id } })
  revalidatePath('/dashboard/estoque')
}
