"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Package, Plus, Trash2, AlertCircle } from "lucide-react"

export interface StockItem {
  productId: string
  batchId: string
  quantity: number
  productName: string
  batchNumber: string
}

interface StockSelectorProps {
  selectedItems: StockItem[]
  onChange: (items: StockItem[]) => void
}

export function StockSelector({ selectedItems, onChange }: StockSelectorProps) {
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [selectedBatch, setSelectedBatch] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await fetch("/api/estoque")
      if (res.ok) {
        setProducts(await res.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const product = products.find(p => p.id === selectedProduct)
  const batch = product?.batches.find((b: any) => b.id === selectedBatch)

  const handleAddItem = () => {
    if (!selectedProduct || !selectedBatch || quantity <= 0) return

    if (batch && quantity > batch.currentQuantity) {
      alert(`Quantidade superior ao estoque disponível (${batch.currentQuantity})`)
      return
    }

    const newItem: StockItem = {
      productId: selectedProduct,
      batchId: selectedBatch,
      quantity,
      productName: product.name,
      batchNumber: batch.batchNumber
    }

    onChange([...selectedItems, newItem])
    
    // Reset selection
    setSelectedProduct("")
    setSelectedBatch("")
    setQuantity(1)
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...selectedItems]
    newItems.splice(index, 1)
    onChange(newItems)
  }

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center gap-2 text-sm font-semibold mb-2">
        <Package className="w-4 h-4" />
        Materiais / Consumo de Estoque
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Produto</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Lote</Label>
            <Select 
              value={selectedBatch} 
              onValueChange={setSelectedBatch}
              disabled={!selectedProduct}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o lote" />
              </SelectTrigger>
              <SelectContent>
                {product?.batches.map((b: any) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.batchNumber} (Saldo: {b.currentQuantity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-xs">Quantidade</Label>
            <Input 
              type="number" 
              className="h-9"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={1}
            />
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            size="sm" 
            className="h-9 px-3"
            onClick={handleAddItem}
            disabled={!selectedBatch}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-4 space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Itens Selecionados</Label>
          <div className="bg-white rounded border overflow-hidden">
            {selectedItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 text-xs border-b last:border-0 hover:bg-muted/30">
                <div className="flex flex-col">
                  <span className="font-semibold">{item.productName}</span>
                  <span className="text-muted-foreground">Lote: {item.batchNumber}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold">{item.quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleRemoveItem(idx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedItems.length === 0 && (
        <div className="text-[10px] text-muted-foreground text-center py-2 italic">
          Nenhum material selecionado do estoque.
        </div>
      )}
    </div>
  )
}
