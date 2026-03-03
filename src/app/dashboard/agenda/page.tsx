"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Plus,
  Loader2,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { StockSelector, StockItem } from "@/components/dashboard/stock-selector";

interface Atividade {
  id: string;
  data: string;
  tipo: string;
  titulo: string;
  endereco: string | null;
  cidade: string | null;
  gpsLat: number | null;
  gpsLng: number | null;
  colaboradores: number;
  materiais: string | null;
  ajudaCusto: boolean;
  transporte: "MOTORISTA" | "CARRO_PROPRIO" | null;
  blitzHoras: number | null;
  horaEntrada: string | null;
  horaSaida: string | null;
  qtdPalestras: number | null;
  kmRodado: number | null;
  status: string;
  empresaId: string;
  profissionalId: string | null;
  profissional2Id: string | null;
  empresa: { nome: string };
  profissional: { nome: string } | null;
  profissional2: { nome: string } | null;
}

interface Profissional {
  id: string;
  nome: string;
  ativo: boolean;
}


const tipoLabels: Record<string, string> = {
  BLITZ: "Blitz",
  PALESTRA: "Palestra",
  SIPAT: "SIPAT",
};

const statusConfig: Record<string, { label: string; className: string }> = {
  SOLICITADA: { label: "Solicitada", className: "bg-amber-100 text-amber-700 border-amber-200" },
  AGENDADA: { label: "Agendada", className: "bg-blue-100 text-blue-700 border-blue-200" },
  REALIZADA: { label: "Realizada", className: "bg-green-100 text-green-700 border-green-200" },
  CANCELADA: { label: "Cancelada", className: "bg-red-100 text-red-700 border-red-200" },
};

const emptyForm = {
  data: "",
  tipo: "BLITZ",
  empresa: "",
  endereco: "",
  cidade: "",
  gpsLat: null as number | null,
  gpsLng: null as number | null,
  titulo: "",
  colaboradores: 0,
  materiais: "",
  profissionalId: "",
  profissional2Id: "",
  ajudaCusto: false,
  transporte: "" as "" | "MOTORISTA" | "CARRO_PROPRIO",
  blitzHoras: 1,
  horaEntrada: "",
  horaSaida: "",
  qtdPalestras: 1,
  kmRodado: 0,
  status: "AGENDADA",
  stockItems: [] as StockItem[],
};

function normalizeCity(value?: string | null) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function isCidadeValorFixo(cidade?: string | null) {
  const c = normalizeCity(cidade);
  return c === "londrina" || c === "ibipora" || c === "cambe";
}

function calcularHorasBlitz(horaEntrada?: string, horaSaida?: string) {
  if (!horaEntrada || !horaSaida) return null;
  const [hIni, mIni] = horaEntrada.split(":").map(Number);
  const [hFim, mFim] = horaSaida.split(":").map(Number);
  if (
    Number.isNaN(hIni) ||
    Number.isNaN(mIni) ||
    Number.isNaN(hFim) ||
    Number.isNaN(mFim)
  ) {
    return null;
  }
  const inicio = hIni * 60 + mIni;
  const fim = hFim * 60 + mFim;
  if (fim <= inicio) return null;
  const horas = (fim - inicio) / 60;
  return Math.max(1, Math.ceil(horas));
}


function toDateInput(iso: string) {
  return iso ? iso.split("T")[0] : "";
}

function FormFields({
  form,
  setForm,
  profissionais,
  isCliente,
  canManage,
}: {
  form: typeof emptyForm;
  setForm: (f: typeof emptyForm) => void;
  profissionais: Profissional[];
  isCliente: boolean;
  canManage: boolean;
}) {
  const cidadeFixa = isCidadeValorFixo(form.cidade);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Data</Label>
          <Input
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select
            value={form.tipo}
            onValueChange={(v) =>
              setForm({
                ...form,
                tipo: v,
                qtdPalestras: v === "PALESTRA" ? form.qtdPalestras || 1 : 1,
                blitzHoras: v === "BLITZ" ? form.blitzHoras || 1 : 1,
              })
            }
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="BLITZ">Blitz</SelectItem>
              <SelectItem value="PALESTRA">Palestra</SelectItem>
              <SelectItem value="SIPAT">SIPAT</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Empresa</Label>
        <Input
          value={form.empresa}
          onChange={(e) => setForm({ ...form, empresa: e.target.value })}
          placeholder="Nome da empresa atendida"
        />
      </div>

      <div>
        <Label>Endereco</Label>
        <Input
          value={form.endereco}
          onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          placeholder="Endereco do local"
        />
      </div>

      <div>
        <Label>Cidade</Label>
        <Input
          value={form.cidade}
          onChange={(e) => {
            const cidade = e.target.value;
            const fixa = isCidadeValorFixo(cidade);
            setForm({
              ...form,
              cidade,
              transporte: fixa ? "CARRO_PROPRIO" : form.transporte,
              kmRodado: fixa ? 0 : form.kmRodado,
            });
          }}
          placeholder="Cidade"
        />
      </div>

      <div>
        <Label>Titulo / Tema</Label>
        <Input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Titulo da atividade"
        />
      </div>

      <div className={isCliente ? "grid grid-cols-1" : "grid grid-cols-2 gap-3"}>
        <div>
          <Label>Colaboradores</Label>
          <Input
            type="number"
            min={0}
            value={form.colaboradores}
            onChange={(e) => setForm({ ...form, colaboradores: parseInt(e.target.value, 10) || 0 })}
          />
        </div>
        {!isCliente && (
          <div>
            <Label>Profissional</Label>
            <Select
              value={form.profissionalId || "none"}
              onValueChange={(v) => setForm({ ...form, profissionalId: v === "none" ? "" : v })}
            >
              <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {profissionais.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {!isCliente && (
        <>
          <div>
            <Label>Segundo Profissional</Label>
            <Select
              value={form.profissional2Id || "none"}
              onValueChange={(v) => setForm({ ...form, profissional2Id: v === "none" ? "" : v })}
            >
              <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {profissionais
                  .filter((p) => p.id !== form.profissionalId)
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {(form.tipo === "BLITZ" || form.tipo === "PALESTRA") && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Horario de entrada</Label>
            <Input
              type="time"
              value={form.horaEntrada}
              onChange={(e) => {
                const horaEntrada = e.target.value;
                const horas = calcularHorasBlitz(horaEntrada, form.horaSaida);
                setForm({
                  ...form,
                  horaEntrada,
                  blitzHoras:
                    form.tipo === "BLITZ" && horas ? horas : form.blitzHoras,
                });
              }}
            />
          </div>
          <div>
            <Label>Horario de saida</Label>
            <Input
              type="time"
              value={form.horaSaida}
              onChange={(e) => {
                const horaSaida = e.target.value;
                const horas = calcularHorasBlitz(form.horaEntrada, horaSaida);
                setForm({
                  ...form,
                  horaSaida,
                  blitzHoras:
                    form.tipo === "BLITZ" && horas ? horas : form.blitzHoras,
                });
              }}
            />
          </div>
        </div>
      )}

      {!isCliente && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Ajuda de Custo</Label>
            <Select
              value={form.ajudaCusto ? "SIM" : "NAO"}
              onValueChange={(v) => setForm({ ...form, ajudaCusto: v === "SIM" })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NAO">Nao</SelectItem>
                <SelectItem value="SIM">Sim (+ R$ 35,00)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Transporte</Label>
            <Select
              value={form.transporte || "none"}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  transporte: v === "none" ? "" : (v as "MOTORISTA" | "CARRO_PROPRIO"),
                })
              }
              disabled={cidadeFixa && !canManage}
            >
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nao informado</SelectItem>
                <SelectItem value="MOTORISTA">Motorista</SelectItem>
                <SelectItem value="CARRO_PROPRIO">Carro proprio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {!isCliente && form.transporte === "CARRO_PROPRIO" && (
        <div className="animate-in fade-in slide-in-from-top-1">
          <Label>KM Rodado</Label>
          <Input
            type="number"
            min={0}
            step="0.1"
            value={form.kmRodado || ""}
            onChange={(e) => setForm({ ...form, kmRodado: parseFloat(e.target.value) || 0 })}
            placeholder="Quantidade de quilômetros"
          />
        </div>
      )}

      <div>
        <Label>Materiais / Observacoes</Label>
        <Textarea
          value={form.materiais}
          onChange={(e) => setForm({ ...form, materiais: e.target.value })}
          placeholder="Lista de materiais ou detalhes da solicitacao"
          rows={2}
        />
      </div>

      {!isCliente && (
        <StockSelector 
          selectedItems={form.stockItems} 
          onChange={(items) => setForm({ ...form, stockItems: items })} 
        />
      )}
    </div>
  );
}

export default function AgendaPage() {
  const { data: session } = useSession();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("TODOS");

  const [form, setForm] = useState({ ...emptyForm });
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });

  const role = (session?.user as any)?.role;
  const isCliente = role === "CLIENTE";
  const canManage = role === "ADMIN" || role === "TECNICO";

  useEffect(() => {
    fetchAtividades();
    fetchProfissionais();
  }, []);

  async function fetchAtividades() {
    const res = await fetch("/api/agenda");
    if (res.ok) setAtividades(await res.json());
  }

  async function fetchProfissionais() {
    const res = await fetch("/api/profissionais");
    if (res.ok) {
      const all = await res.json();
      setProfissionais(all.filter((p: Profissional) => p.ativo));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.data || !form.empresa) {
      toast.error("Preencha data e empresa");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/agenda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          status: isCliente ? "SOLICITADA" : "AGENDADA"
        }),
      });
      if (res.ok) {
        toast.success(isCliente ? "Solicitacao enviada!" : "Atividade agendada!");
        setForm({ ...emptyForm });
        fetchAtividades();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Erro ao agendar");
      }
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setLoading(false);
    }
  }

  function openEdit(ativ: Atividade) {
    const cidadeFixa = isCidadeValorFixo(ativ.cidade);
    setEditId(ativ.id);
    setEditForm({
      data: toDateInput(ativ.data),
      tipo: ativ.tipo,
      empresa: ativ.empresa.nome,
      endereco: ativ.endereco || "",
      cidade: ativ.cidade || "",
      gpsLat: ativ.gpsLat,
      gpsLng: ativ.gpsLng,
      titulo: ativ.titulo,
      colaboradores: ativ.colaboradores,
      materiais: ativ.materiais || "",
      profissionalId: ativ.profissionalId || "",
      profissional2Id: ativ.profissional2Id || "",
      ajudaCusto: ativ.ajudaCusto,
      transporte: cidadeFixa ? "CARRO_PROPRIO" : (ativ.transporte || ""),
      blitzHoras: ativ.blitzHoras || 1,
      horaEntrada: ativ.horaEntrada || "",
      horaSaida: ativ.horaSaida || "",
      qtdPalestras: ativ.qtdPalestras || 1,
      kmRodado: cidadeFixa ? 0 : (ativ.kmRodado || 0),
      status: ativ.status,
      stockItems: [],
    });
    setEditOpen(true);
  }

  async function handleEdit() {
    if (!editId) return;
    if (!editForm.data || !editForm.empresa) {
      toast.error("Preencha data e empresa");
      return;
    }
    setEditLoading(true);
    try {
      const res = await fetch("/api/agenda", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...editForm }),
      });
      if (res.ok) {
        toast.success("Atividade atualizada!");
        setEditOpen(false);
        fetchAtividades();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Erro ao salvar alteracoes");
      }
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setEditLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/agenda", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success(`Status: ${statusConfig[status]?.label}`);
      fetchAtividades();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta atividade? Esta acao nao pode ser desfeita.")) return;
    const res = await fetch("/api/agenda", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      toast.success("Atividade excluida");
      fetchAtividades();
    } else {
      toast.error("Erro ao excluir");
    }
  }

  const filtered =
    filterStatus === "TODOS"
      ? atividades
      : atividades.filter((a) => a.status === filterStatus);

  const counts = {
    SOLICITADA: atividades.filter((a) => a.status === "SOLICITADA").length,
    AGENDADA: atividades.filter((a) => a.status === "AGENDADA").length,
    REALIZADA: atividades.filter((a) => a.status === "REALIZADA").length,
    CANCELADA: atividades.filter((a) => a.status === "CANCELADA").length,
  };

  return (
    <>
      <Topbar title="Agenda" description={isCliente ? "Solicite seus atendimentos" : "Gerencie atividades e compromissos"} />

      <div className="p-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit sticky top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-[#1e3a8a]" />
              {isCliente ? "Solicitar Atendimento" : "Nova Atividade"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <FormFields
                form={form}
                setForm={setForm}
                profissionais={profissionais}
                isCliente={isCliente}
                canManage={canManage}
              />
              <Button
                type="submit"
                className="w-full bg-[#1e3a8a] hover:bg-[#22c55e] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CalendarDays className="h-4 w-4 mr-2" />
                )}
                {isCliente ? "Enviar Solicitacao" : "Agendar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="h-5 w-5 text-[#1e3a8a]" />
                {isCliente ? "Minhas Solicitacoes" : "Compromissos"} ({filtered.length})
              </CardTitle>

              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {(["TODOS", "SOLICITADA", "AGENDADA", "REALIZADA", "CANCELADA"] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      filterStatus === s
                        ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                        : "text-muted-foreground border-gray-200 hover:border-[#1e3a8a]"
                    }`}
                  >
                    {s === "TODOS"
                      ? `Todos (${atividades.length})`
                      : `${statusConfig[s]?.label} (${counts[s]})`}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">Nenhuma atividade encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Colab.</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Profissionais</TableHead>
                      <TableHead>Status</TableHead>
                      {!isCliente && <TableHead className="text-right">Acoes</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((ativ) => (
                      <TableRow key={ativ.id}>
                        <TableCell className="whitespace-nowrap font-medium">
                          {new Date(ativ.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {tipoLabels[ativ.tipo] || ativ.tipo}
                            {ativ.tipo === "BLITZ" && ativ.blitzHoras ? ` (${ativ.blitzHoras}h)` : ""}
                            {ativ.tipo === "PALESTRA" && ativ.qtdPalestras ? ` (${ativ.qtdPalestras}x)` : ""}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{ativ.empresa.nome}</TableCell>
                        <TableCell className="text-sm">{ativ.colaboradores || 0}</TableCell>
                        <TableCell className="text-sm">{ativ.cidade || "-"}</TableCell>
                        <TableCell className="text-sm">
                          {ativ.profissional?.nome || "-"}
                          {ativ.profissional2?.nome ? ` / ${ativ.profissional2.nome}` : ""}
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs border ${statusConfig[ativ.status]?.className}`} variant="secondary">
                            {statusConfig[ativ.status]?.label}
                          </Badge>
                        </TableCell>
                        {!isCliente && (
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              {canManage && ativ.status === "SOLICITADA" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                                    title="Aprovar Agendamento"
                                    onClick={() => updateStatus(ativ.id, "AGENDADA")}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                                    title="Recusar"
                                    onClick={() => updateStatus(ativ.id, "CANCELADA")}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              {canManage && ativ.status === "AGENDADA" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-green-600 hover:bg-green-50"
                                    title="Marcar como Realizada"
                                    onClick={() => updateStatus(ativ.id, "REALIZADA")}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-orange-500 hover:bg-orange-50"
                                    title="Cancelar"
                                    onClick={() => updateStatus(ativ.id, "CANCELADA")}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              
                              {canManage && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-[#1e3a8a] hover:bg-blue-50"
                                    title="Editar"
                                    onClick={() => openEdit(ativ)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 text-red-500 hover:bg-red-50"
                                    title="Excluir"
                                    onClick={() => handleDelete(ativ.id)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-[#1e3a8a]" />
              Editar Atividade
            </DialogTitle>
          </DialogHeader>

          <FormFields
            form={editForm}
            setForm={setEditForm}
            profissionais={profissionais}
            isCliente={isCliente}
            canManage={canManage}
          />

          <div>
            <Label>Status</Label>
            <Select
              value={editForm.status}
              onValueChange={(v) => setEditForm({ ...editForm, status: v })}
              disabled={isCliente}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOLICITADA">Solicitada</SelectItem>
                <SelectItem value="AGENDADA">Agendada</SelectItem>
                <SelectItem value="REALIZADA">Realizada</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-[#1e3a8a] hover:bg-[#22c55e]"
              onClick={handleEdit}
              disabled={editLoading}
            >
              {editLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Pencil className="h-4 w-4 mr-2" />
              )}
              Salvar Alteracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
