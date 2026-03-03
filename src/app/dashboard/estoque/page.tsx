import { Suspense } from "react"
import { getProducts } from "@/lib/actions/stock"
import { StockTable } from "@/components/dashboard/stock-table"

export const dynamic = "force-dynamic"

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const products = await getProducts(q)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Controle de Estoque</h2>
      </div>
      
      <Suspense fallback={<StockSkeleton />}>
        <StockTable products={products} />
      </Suspense>
    </div>
  )
}

function StockSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[300px] border rounded-lg bg-muted/20 animate-pulse" />
      ))}
    </div>
  )
}
