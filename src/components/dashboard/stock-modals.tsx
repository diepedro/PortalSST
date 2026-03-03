"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
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
import { upsertProduct, addBatch } from "@/lib/actions/stock"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function ProductModal({ 
  isOpen, 
  onClose, 
  product = null 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  product?: any 
}) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: product || { name: "", category: "", unit: "Unidade" }
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      await upsertProduct(data)
      toast.success(product ? "Produto atualizado!" : "Produto cadastrado com sucesso!")
      reset()
      onClose()
    } catch (error: any) {
      toast.error("Erro ao salvar produto: " + (error.message || "Tente novamente"))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto</Label>
            <Input id="name" {...register("name", { required: true })} placeholder="Ex: Luva de Procedimento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input id="category" {...register("category", { required: true })} placeholder="Ex: EPI" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade</Label>
              <Select defaultValue="Unidade" onValueChange={(v) => register("unit").onChange({ target: { value: v, name: "unit" } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unidade">Unidade</SelectItem>
                  <SelectItem value="Caixa">Caixa</SelectItem>
                  <SelectItem value="Par">Par</SelectItem>
                  <SelectItem value="ml">ml</SelectItem>
                  <SelectItem value="Litro">Litro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Produto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function BatchModal({ 
  isOpen, 
  onClose, 
  productId 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  productId: string 
}) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data: any) => {
    console.log("Tentando cadastrar lote no cliente...", { productId, ...data });
    setLoading(true)
    try {
      if (!productId) {
        throw new Error("ID do produto não selecionado");
      }
      if (!data.batchNumber || !data.expirationDate || !data.quantity) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      const response = await addBatch({
        productId,
        batchNumber: data.batchNumber,
        expirationDate: new Date(data.expirationDate),
        quantity: parseFloat(data.quantity)
      })

      if (response.success) {
        toast.success("Lote adicionado com sucesso!")
        reset()
        onClose()
      } else {
        toast.error("Erro no servidor: " + (response.error || "Desconhecido"))
      }
    } catch (error: any) {
      toast.error("Erro na requisição: " + (error.message || "Tente novamente"))
      console.error("Erro completo no cliente:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lote</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="batchNumber">Número do Lote</Label>
            <Input id="batchNumber" {...register("batchNumber", { required: true })} placeholder="Ex: LOT2024-001" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Data de Validade</Label>
              <Input id="expirationDate" type="date" {...register("expirationDate", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade Inicial</Label>
              <Input id="quantity" type="number" step="0.01" {...register("quantity", { required: true })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adicionando..." : "Adicionar Lote"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
