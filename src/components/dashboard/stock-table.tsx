"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  Package, 
  Calendar, 
  AlertTriangle,
  History,
  Plus,
  Trash2,
  Edit2
} from "lucide-react"
import { format, differenceInDays, isPast } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductModal, BatchModal } from "./stock-modals"

interface StockTableProps {
  products: any[]
}

export function StockTable({ products }: StockTableProps) {
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const handleAddBatch = (product: any) => {
    setSelectedProduct(product)
    setIsBatchModalOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleNewProduct = () => {
    setSelectedProduct(null)
    setIsProductModalOpen(true)
  }
  
  const getStatusColor = (batch: any) => {
    const daysToExpiry = differenceInDays(new Date(batch.expirationDate), new Date())
    const isCriticalQty = batch.currentQuantity <= (batch.initialQuantity * 0.1) || batch.currentQuantity <= 5
    
    if (isPast(new Date(batch.expirationDate))) return "bg-red-500 text-white"
    if (daysToExpiry <= 30) return "bg-orange-500 text-white"
    if (isCriticalQty) return "bg-yellow-500 text-black"
    
    return "bg-green-500 text-white"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Inventário de Produtos</h2>
        <Button onClick={handleNewProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Produto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditProduct(product)}>
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{product.category} • {product.unit}</p>
                </div>
                <Package className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Lote</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="text-right pr-4">Qtd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground h-12">
                        Sem lotes cadastrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    product.batches.map((batch: any) => {
                      const daysToExpiry = differenceInDays(new Date(batch.expirationDate), new Date())
                      const isNearExpiry = daysToExpiry <= 30 && !isPast(new Date(batch.expirationDate))
                      const isExpired = isPast(new Date(batch.expirationDate))

                      return (
                        <TableRow key={batch.id}>
                          <TableCell className="font-medium pl-4">
                            {batch.batchNumber}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-xs">
                                {format(new Date(batch.expirationDate), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {isExpired && (
                                <span className="text-[10px] text-red-500 font-bold uppercase font-black">Vencido</span>
                              )}
                              {isNearExpiry && (
                                <span className="text-[10px] text-orange-600 font-bold uppercase">Expira em {daysToExpiry}d</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <Badge variant="outline" className={getStatusColor(batch)}>
                              {batch.currentQuantity}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
              <div className="px-4 mt-4 flex gap-2">
                 <Button variant="outline" size="sm" className="w-full text-xs h-8">
                   <History className="w-3 h-3 mr-1" /> Histórico
                 </Button>
                 <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs h-8"
                    onClick={() => handleAddBatch(product)}
                  >
                   <Plus className="w-3 h-3 mr-1" /> Add Lote
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setIsProductModalOpen(false)} 
        product={selectedProduct}
      />
      
      {selectedProduct && (
        <BatchModal 
          isOpen={isBatchModalOpen} 
          onClose={() => setIsBatchModalOpen(false)} 
          productId={selectedProduct.id}
        />
      )}
    </div>
  )
}
