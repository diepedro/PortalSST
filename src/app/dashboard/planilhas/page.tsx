"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileSpreadsheet,
  Upload,
  Loader2,
  Download,
  Pencil,
  Plus,
  Trash2,
  Play,
  Database,
  ClipboardPlus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";

type Planilha = {
  id: string;
  nome: string;
  tipo: "SAUDE" | "COMPARATIVO" | "NPS" | string;
  tamanho: number;
  empresaNome: string | null;
  dataColetaTexto: string | null;
  createdAt: string;
};

type Linha = {
  nome: string;
  idade: number;
  altura: number;
  peso: number;
  pa: string;
  fc: number;
  glicemia: number;
  comorbidades: string;
  sexo: number;
  telefone?: string;
};

type ColetaDraft = {
  empresaNome: string;
  empresaEndereco: string;
  profissionalNome: string;
  dataColeta: string;
  horarioColeta: string;
  qtdColaboradores: number;
  novoParticipante: Linha;
  participantesDraft: Linha[];
};

const emptyLinha: Linha = {
  nome: "",
  idade: 0,
  altura: 0,
  peso: 0,
  pa: "",
  fc: 0,
  glicemia: 0,
  comorbidades: "",
  sexo: 1,
  telefone: "",
};

function formatTimeMask(value: string) {
  const digits = value.replace(/\D/g, "");
  let formatted = digits;
  if (digits.length >= 2) {
    formatted = digits.slice(0, 2);
    if (digits.length > 2) {
      formatted += ":" + digits.slice(2, 4);
    }
    if (digits.length > 4) {
      formatted += " - " + digits.slice(4, 6);
    }
    if (digits.length > 6) {
      formatted += ":" + digits.slice(6, 8);
    }
  }
  return formatted.slice(0, 13);
}

function formatPhoneMask(value: string) {
  const digits = value.replace(/\D/g, "");
  let formatted = "";
  if (digits.length > 0) {
    formatted = "(" + digits.slice(0, 2);
    if (digits.length > 2) {
      formatted += ") " + digits.slice(2, 7);
    }
    if (digits.length > 7) {
      formatted += "-" + digits.slice(7, 11);
    }
  }
  return formatted.slice(0, 15);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}

function getDraftKey(userId?: string) {
  return `coleta-draft:${userId || "anon"}`;
}

function parsePA(pa: string) {
  const m = pa.replace(".", "/").match(/(\d+)\s*\/\s*(\d+)/);
  if (!m) return null;
  return { sistolica: Number(m[1]), diastolica: Number(m[2]) };
}

function clinicaStatus(p: Linha) {
  const alerts: string[] = [];
  const pa = parsePA(p.pa);
  if (pa) {
    if (pa.sistolica >= 140 || pa.diastolica >= 90) alerts.push("PA alta");
    else if (pa.sistolica < 90 || pa.diastolica < 60) alerts.push("PA baixa");
  }

  if (p.glicemia > 0) {
    if (p.glicemia >= 126) alerts.push("Glicemia alta");
    else if (p.glicemia < 70) alerts.push("Glicemia baixa");
  }

  if (p.fc > 0) {
    if (p.fc > 100) alerts.push("FC alta");
    else if (p.fc < 60) alerts.push("FC baixa");
  }

  if (p.altura > 0 && p.peso > 0) {
    const imc = p.peso / (p.altura * p.altura);
    if (imc >= 30) alerts.push("IMC obesidade");
    else if (imc < 18.5) alerts.push("IMC baixo");
  }

  return {
    alerts,
    hasAlert: alerts.length > 0,
  };
}

const COMORBIDADES_OPTIONS = [
  "Nega comorbidades",
  "Hipertensão Arterial Sistêmica (HAS)",
  "Outras doenças cardiovasculares",
  "Diabetes Mellitus",
  "Dislipidemia",
  "Distúrbios da Tireoide",
  "Doenças imunossupressoras",
  "Doenças respiratórias",
  "Depressão e/ou Transtornos de Ansiedade",
  "Tabagismo",
  "Etilismo",
];

export default function PlanilhasPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  const [planilhas, setPlanilhas] = useState<Planilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [gerandoId, setGerandoId] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState<"SAUDE" | "COMPARATIVO" | "NPS">("SAUDE");

  const [empresaNome, setEmpresaNome] = useState("");
  const [empresaEndereco, setEmpresaEndereco] = useState("");
  const [profissionalNome, setProfissionalNome] = useState("");
  const [dataColeta, setDataColeta] = useState(hojeISO());
  const [horarioColeta, setHorarioColeta] = useState("");
  const [qtdColaboradores, setQtdColaboradores] = useState<number>(0);
  const [novoParticipante, setNovoParticipante] = useState<Linha>({ ...emptyLinha });
  const [participantesDraft, setParticipantesDraft] = useState<Linha[]>([]);
  const [criandoColeta, setCriandoColeta] = useState(false);
  const [draftInfo, setDraftInfo] = useState<string>("");
  const nomeParticipanteRef = useRef<HTMLInputElement | null>(null);
  const inicioColetaRef = useRef<HTMLDivElement | null>(null);

  const toggleComorbidade = (opt: string) => {
    setNovoParticipante((prev) => {
      const current = prev.comorbidades ? prev.comorbidades.split(", ").filter(Boolean) : [];
      let next: string[];

      if (opt === "Nega comorbidades") {
        next = current.includes(opt) ? [] : [opt];
      } else {
        const semNega = current.filter((i) => i !== "Nega comorbidades");
        if (semNega.includes(opt)) {
          next = semNega.filter((i) => i !== opt);
        } else {
          next = [...semNega, opt];
        }
      }
      return { ...prev, comorbidades: next.join(", ") };
    });
  };

  const canGenerate = role !== "COLETA";
  const isColeta = role === "COLETA";
  const coletaAlertsCount = useMemo(
    () => participantesDraft.reduce((acc, p) => acc + (clinicaStatus(p).hasAlert ? 1 : 0), 0),
    [participantesDraft]
  );
  const novoParticipanteClinica = useMemo(() => clinicaStatus(novoParticipante), [novoParticipante]);

  const fetchPlanilhas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/planilhas");
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erro ao carregar planilhas");
        return;
      }
      setPlanilhas(await res.json());
    } catch {
      toast.error("Erro de conexao ao carregar planilhas");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "authenticated" && role === "CLIENTE") {
      router.replace("/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetchPlanilhas();
    }
  }, [status, role, router, fetchPlanilhas]);

  useEffect(() => {
    if (!isColeta || status !== "authenticated") return;
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const raw = localStorage.getItem(getDraftKey(userId));
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ColetaDraft;
      setEmpresaNome(parsed.empresaNome || "");
      setEmpresaEndereco(parsed.empresaEndereco || "");
      setProfissionalNome(parsed.profissionalNome || "");
      setDataColeta(parsed.dataColeta || hojeISO());
      setHorarioColeta(parsed.horarioColeta || "");
      setQtdColaboradores(Number(parsed.qtdColaboradores || 0));
      setNovoParticipante(parsed.novoParticipante || { ...emptyLinha });
      setParticipantesDraft(Array.isArray(parsed.participantesDraft) ? parsed.participantesDraft : []);
      setDraftInfo("Rascunho restaurado automaticamente.");
    } catch {
      setDraftInfo("Nao foi possivel restaurar o rascunho.");
    }
  }, [isColeta, session, status]);

  useEffect(() => {
    if (!isColeta || status !== "authenticated") return;
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const payload: ColetaDraft = {
      empresaNome,
      empresaEndereco,
      profissionalNome,
      dataColeta,
      horarioColeta,
      qtdColaboradores,
      novoParticipante,
      participantesDraft,
    };
    localStorage.setItem(getDraftKey(userId), JSON.stringify(payload));
    setDraftInfo("Rascunho salvo automaticamente.");
  }, [
    isColeta,
    status,
    session,
    empresaNome,
    empresaEndereco,
    profissionalNome,
    dataColeta,
    horarioColeta,
    qtdColaboradores,
    novoParticipante,
    participantesDraft,
  ]);

  const totalRegistros = useMemo(
    () => planilhas.reduce((acc, p) => acc + (p.tamanho > 0 ? 1 : 0), 0),
    [planilhas]
  );

  async function handleUpload() {
    if (!file) {
      toast.error("Selecione uma planilha .xlsx");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", tipo);

      const res = await fetch("/api/planilhas", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao enviar planilha");
        return;
      }

      toast.success("Planilha adicionada ao acervo");
      setFile(null);
      await fetchPlanilhas();
    } catch {
      toast.error("Erro ao enviar planilha");
    } finally {
      setUploading(false);
    }
  }

  async function abrirEditor(planilhaId: string) {
    setEditandoId(planilhaId);
    try {
      const res = await fetch(`/api/planilhas/${planilhaId}?mode=dados`);
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao abrir editor");
        setEditandoId(null);
        return;
      }
      setLinhas((data.linhas as Linha[]) ?? []);
    } catch {
      toast.error("Erro ao carregar dados da planilha");
      setEditandoId(null);
    }
  }

  async function salvarEdicao() {
    if (!editandoId) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/planilhas/${editandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linhas }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar planilha");
        return;
      }

      toast.success("Planilha atualizada");
      setEditandoId(null);
      setLinhas([]);
      await fetchPlanilhas();
    } catch {
      toast.error("Erro ao salvar alteracoes");
    } finally {
      setSaving(false);
    }
  }

  async function excluirPlanilha(id: string) {
    if (!confirm("Excluir esta planilha do acervo interno?")) return;

    try {
      const res = await fetch(`/api/planilhas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir planilha");
        return;
      }
      toast.success("Planilha removida");
      await fetchPlanilhas();
    } catch {
      toast.error("Erro ao excluir planilha");
    }
  }

  async function gerarDaPlanilha(id: string) {
    setGerandoId(id);
    try {
      const res = await fetch(`/api/planilhas/${id}/gerar`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao gerar relatorio");
        return;
      }
      toast.success("Relatorio gerado com sucesso");
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      }
    } catch {
      toast.error("Erro ao gerar relatorio");
    } finally {
      setGerandoId(null);
    }
  }

  function adicionarParticipante() {
    if (!novoParticipante.nome.trim()) {
      toast.error("Informe o nome do participante");
      return;
    }

    setParticipantesDraft((prev) => [
      ...prev,
      {
        ...novoParticipante,
        sexo: novoParticipante.sexo === 2 ? 2 : 1,
      },
    ]);
    setNovoParticipante({ ...emptyLinha });
  }

  function proximoParticipante() {
    if (!novoParticipante.nome.trim()) {
      toast.error("Informe o nome do participante");
      return;
    }
    adicionarParticipante();
    window.setTimeout(() => nomeParticipanteRef.current?.focus(), 40);
  }

  function limparRascunho() {
    const userId = (session?.user as { id?: string } | undefined)?.id;
    localStorage.removeItem(getDraftKey(userId));
    setEmpresaNome("");
    setEmpresaEndereco("");
    setHorarioColeta("");
    setQtdColaboradores(0);
    setParticipantesDraft([]);
    setNovoParticipante({ ...emptyLinha });
    setDataColeta(hojeISO());
    setDraftInfo("Rascunho limpo.");
  }

  function salvarRascunhoAgora() {
    const userId = (session?.user as { id?: string } | undefined)?.id;
    const payload: ColetaDraft = {
      empresaNome,
      empresaEndereco,
      profissionalNome,
      dataColeta,
      horarioColeta,
      qtdColaboradores,
      novoParticipante,
      participantesDraft,
    };
    localStorage.setItem(getDraftKey(userId), JSON.stringify(payload));
    setDraftInfo("Rascunho salvo manualmente.");
  }

  async function iniciarNovaColeta() {
    if (!empresaNome.trim()) {
      toast.error("Informe o nome da empresa");
      return;
    }
    if (!dataColeta) {
      toast.error("Informe a data da coleta");
      return;
    }
    if (participantesDraft.length === 0) {
      toast.error("Adicione pelo menos um participante");
      return;
    }

    setCriandoColeta(true);
    try {
      const res = await fetch("/api/planilhas/coleta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresa: {
            nome: empresaNome,
            endereco: empresaEndereco,
            profissional: profissionalNome,
            dataColeta,
            horario: horarioColeta,
            qtdColaboradores,
          },
          participantes: participantesDraft,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao iniciar coleta");
        return;
      }

      toast.success("Coleta iniciada e planilha criada");
      setEmpresaNome("");
      setEmpresaEndereco("");
      setProfissionalNome("");
      setHorarioColeta("");
      setQtdColaboradores(0);
      setParticipantesDraft([]);
      setNovoParticipante({ ...emptyLinha });
      setDataColeta(hojeISO());
      localStorage.removeItem(getDraftKey((session?.user as { id?: string } | undefined)?.id));
      setDraftInfo("Coleta finalizada e rascunho limpo.");
      await fetchPlanilhas();
    } catch {
      toast.error("Erro ao salvar coleta");
    } finally {
      setCriandoColeta(false);
    }
  }

  async function exportarTriagemPdf() {
    try {
      const itens = participantesDraft
        .map((p) => ({ nome: p.nome, alertas: clinicaStatus(p).alerts }))
        .filter((p) => p.alertas.length > 0);

      const res = await fetch("/api/planilhas/coleta/triagem-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaNome,
          dataColeta,
          totalParticipantes: participantesDraft.length,
          itens,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erro ao exportar triagem");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Triagem_${empresaNome || "Coleta"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("PDF de triagem exportado");
    } catch {
      toast.error("Erro ao exportar triagem");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isColeta) {
    return (
      <>
        <Topbar
          title="Coleta"
          description="Fluxo simplificado para coleta mobile e criacao direta da planilha"
        />

        <div className="p-4 sm:p-6 space-y-4 max-w-3xl">
          <Card>
            <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Rascunho de Coleta</p>
                <p className="text-xs text-muted-foreground">{draftInfo || "Salvamento automatico ativo neste dispositivo."}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Participantes com alerta clinico: <span className="font-semibold">{coletaAlertsCount}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={salvarRascunhoAgora}>
                  <Save className="h-3 w-3 mr-1" />
                  Salvar
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={limparRascunho}>
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card ref={inicioColetaRef}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardPlus className="h-4 w-4 text-[#1e3a8a]" />
                Iniciar Nova Coleta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3">
                <div className="space-y-1">
                  <Label>Empresa *</Label>
                  <Input value={empresaNome} onChange={(e) => setEmpresaNome(e.target.value)} placeholder="Nome da empresa" />
                </div>
                <div className="space-y-1">
                  <Label>Endereco</Label>
                  <Input value={empresaEndereco} onChange={(e) => setEmpresaEndereco(e.target.value)} placeholder="Endereco da coleta" />
                </div>
                <div className="space-y-1">
                  <Label>Profissional Responsável</Label>
                  <Input value={profissionalNome} onChange={(e) => setProfissionalNome(e.target.value)} placeholder="Nome do profissional" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Data *</Label>
                    <Input type="date" value={dataColeta} onChange={(e) => setDataColeta(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Horario</Label>
                    <Input 
                      value={horarioColeta} 
                      onChange={(e) => setHorarioColeta(formatTimeMask(e.target.value))} 
                      placeholder="08:00 - 12:00" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Total de colaboradores</Label>
                  <Input type="number" value={qtdColaboradores || ""} onChange={(e) => setQtdColaboradores(Number(e.target.value || 0))} placeholder="Opcional" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Adicionar participante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input ref={nomeParticipanteRef} value={novoParticipante.nome} onChange={(e) => setNovoParticipante((p) => ({ ...p, nome: e.target.value }))} placeholder="Nome completo" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Idade</Label>
                  <Input type="number" value={novoParticipante.idade || ""} onChange={(e) => setNovoParticipante((p) => ({ ...p, idade: Number(e.target.value || 0) }))} placeholder="Ex: 30" />
                </div>
                <div className="space-y-1">
                  <Label>Altura (m)</Label>
                  <Input type="number" step="0.01" value={novoParticipante.altura || ""} onChange={(e) => setNovoParticipante((p) => ({ ...p, altura: Number(e.target.value || 0) }))} placeholder="Ex: 1.75" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Peso (kg)</Label>
                  <Input type="number" step="0.1" value={novoParticipante.peso || ""} onChange={(e) => setNovoParticipante((p) => ({ ...p, peso: Number(e.target.value || 0) }))} placeholder="Ex: 75.5" />
                </div>
                <div className="space-y-1">
                  <Label>PA</Label>
                  <Input value={novoParticipante.pa} onChange={(e) => setNovoParticipante((p) => ({ ...p, pa: e.target.value }))} placeholder="Ex: 120/80" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label>Frequência cardíaca</Label>
                  <Input type="number" value={novoParticipante.fc || ""} onChange={(e) => setNovoParticipante((p) => ({ ...p, fc: Number(e.target.value || 0) }))} placeholder="Ex: 72" />
                </div>
                <div className="space-y-1">
                  <Label>Glicemia</Label>
                  <Input type="number" value={novoParticipante.glicemia || ""} onChange={(e) => setNovoParticipante((p) => ({ ...p, glicemia: Number(e.target.value || 0) }))} placeholder="Ex: 95" />
                </div>
                <div className="space-y-1">
                  <Label>Telefone (Opcional)</Label>
                  <Input 
                    value={novoParticipante.telefone || ""} 
                    onChange={(e) => setNovoParticipante((p) => ({ ...p, telefone: formatPhoneMask(e.target.value) }))} 
                    placeholder="(00) 00000-0000" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comorbidades</Label>
                <div className="grid grid-cols-1 gap-1 border rounded-lg p-3 bg-gray-50/50 max-h-48 overflow-y-auto">
                  {COMORBIDADES_OPTIONS.map((opt) => {
                    const isSelected = novoParticipante.comorbidades?.split(", ").includes(opt);
                    return (
                      <div
                        key={opt}
                        onClick={() => toggleComorbidade(opt)}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-100 border-blue-200" : "hover:bg-gray-100"
                        }`}
                      >
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          isSelected ? "bg-[#1e3a8a] border-[#1e3a8a]" : "bg-white border-gray-300"
                        }`}>
                          {isSelected && <CheckCircle2 className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-xs">{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Sexo</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant={novoParticipante.sexo === 1 ? "default" : "outline"} className={novoParticipante.sexo === 1 ? "bg-[#1e3a8a]" : ""} onClick={() => setNovoParticipante((p) => ({ ...p, sexo: 1 }))}>
                    Feminino
                  </Button>
                  <Button type="button" variant={novoParticipante.sexo === 2 ? "default" : "outline"} className={novoParticipante.sexo === 2 ? "bg-[#1e3a8a]" : ""} onClick={() => setNovoParticipante((p) => ({ ...p, sexo: 2 }))}>
                    Masculino
                  </Button>
                </div>
              </div>

              {novoParticipanteClinica.hasAlert && (
                <div className="rounded-lg border border-orange-300 bg-orange-50 p-3">
                  <p className="text-xs font-medium text-orange-800 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Alertas clinicos em tempo real
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {novoParticipanteClinica.alerts.map((a) => (
                      <Badge key={a} variant="outline" className="border-orange-300 text-orange-700 bg-orange-100">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button type="button" className="w-full bg-[#1e3a8a] hover:bg-[#22c55e] h-12 text-base font-medium" onClick={proximoParticipante}>
                <Plus className="h-5 w-5 mr-2" />
                Adicionar e Próximo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Participantes ({participantesDraft.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {participantesDraft.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum participante adicionado ainda.</p>
              ) : (
                participantesDraft.map((p, idx) => {
                  const pClinica = clinicaStatus(p);
                  return (
                    <div key={`${p.nome}-${idx}`} className="border rounded-lg p-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">{p.nome}</p>
                        <p className="text-xs text-muted-foreground">Idade {p.idade} - PA {p.pa || "-"} - Glicemia {p.glicemia || 0}</p>
                        {pClinica.hasAlert && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pClinica.alerts.map((a) => (
                              <Badge key={`${p.nome}-${a}`} variant="outline" className="border-orange-300 text-orange-700 bg-orange-100">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setParticipantesDraft((prev) => prev.filter((_, i) => i !== idx))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Button variant="outline" className="h-11" onClick={exportarTriagemPdf} disabled={participantesDraft.length === 0}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Exportar triagem (PDF)
            </Button>
            <Button className="bg-[#1e3a8a] hover:bg-[#22c55e] h-11" disabled={criandoColeta} onClick={iniciarNovaColeta}>
              {criandoColeta ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Salvando coleta...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Finalizar e criar planilha
                </>
              )}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ultimas planilhas criadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {planilhas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma planilha criada.</p>
              ) : (
                planilhas.slice(0, 8).map((p) => (
                  <div key={p.id} className="border rounded-lg p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.empresaNome || "-"} - {p.dataColetaTexto || "-"}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => abrirEditor(p.id)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`/api/planilhas/${p.id}`, "_blank")}>
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!editandoId} onOpenChange={(open) => !open && setEditandoId(null)}>
          <DialogContent className="max-w-6xl">
            <DialogHeader>
              <DialogTitle>Editor de Dados da Planilha</DialogTitle>
            </DialogHeader>

            <div className="max-h-[60vh] overflow-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white border-b">
                  <tr>
                    <th className="text-left p-2">Nome</th>
                    <th className="text-left p-2">Idade</th>
                    <th className="text-left p-2">Altura</th>
                    <th className="text-left p-2">Peso</th>
                    <th className="text-left p-2">PA</th>
                    <th className="text-left p-2">FC</th>
                    <th className="text-left p-2">Glicemia</th>
                    <th className="text-left p-2">Comorbidades</th>
                    <th className="text-left p-2">Sexo</th>
                    <th className="text-right p-2">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  {linhas.map((linha, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 min-w-[200px]"><Input value={linha.nome} onChange={(e) => { const next = [...linhas]; next[idx].nome = e.target.value; setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[100px]"><Input type="number" value={linha.idade} onChange={(e) => { const next = [...linhas]; next[idx].idade = Number(e.target.value || 0); setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[100px]"><Input type="number" step="0.01" value={linha.altura} onChange={(e) => { const next = [...linhas]; next[idx].altura = Number(e.target.value || 0); setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[100px]"><Input type="number" step="0.1" value={linha.peso} onChange={(e) => { const next = [...linhas]; next[idx].peso = Number(e.target.value || 0); setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[110px]"><Input value={linha.pa} onChange={(e) => { const next = [...linhas]; next[idx].pa = e.target.value; setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[100px]"><Input type="number" value={linha.fc} onChange={(e) => { const next = [...linhas]; next[idx].fc = Number(e.target.value || 0); setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[110px]"><Input type="number" value={linha.glicemia} onChange={(e) => { const next = [...linhas]; next[idx].glicemia = Number(e.target.value || 0); setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[220px]"><Input value={linha.comorbidades} onChange={(e) => { const next = [...linhas]; next[idx].comorbidades = e.target.value; setLinhas(next); }} /></td>
                      <td className="p-2 min-w-[90px]"><Input type="number" min={1} max={2} value={linha.sexo} onChange={(e) => { const next = [...linhas]; next[idx].sexo = Number(e.target.value || 1); setLinhas(next); }} /></td>
                      <td className="p-2 text-right"><Button size="sm" variant="ghost" className="text-red-600" onClick={() => setLinhas((prev) => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setLinhas((prev) => [...prev, { ...emptyLinha }])}>
                <Plus className="h-4 w-4 mr-2" />
                Nova linha
              </Button>

              <Button className="bg-[#1e3a8a] hover:bg-[#22c55e]" disabled={saving} onClick={salvarEdicao}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Topbar
        title="Planilhas"
        description="Acervo interno para edicao de dados e geracao de relatorios"
      />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Planilhas no acervo</p><p className="text-2xl font-semibold mt-1">{planilhas.length}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Registros gerenciados</p><p className="text-2xl font-semibold mt-1">{totalRegistros}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Fluxo principal</p><p className="text-sm mt-2 font-medium">Coleta, edicao e entrega</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Formato aceito</p><p className="text-sm mt-2 font-medium">Template XLSX atual</p></CardContent></Card>
        </div>

        <Tabs defaultValue="acervo" className="space-y-4">
          <TabsList>
            <TabsTrigger value="acervo" className="gap-2"><Database className="h-4 w-4" />Acervo</TabsTrigger>
            <TabsTrigger value="upload" className="gap-2"><Upload className="h-4 w-4" />Nova Planilha</TabsTrigger>
          </TabsList>

          <TabsContent value="acervo">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><FileSpreadsheet className="h-5 w-5 text-[#1e3a8a]" />Planilhas Internas</CardTitle></CardHeader>
              <CardContent>
                {planilhas.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">Nenhuma planilha cadastrada</div>
                ) : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Empresa</TableHead><TableHead>Tipo</TableHead><TableHead>Data da Coleta</TableHead><TableHead>Tamanho</TableHead><TableHead className="text-right">Acoes</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {planilhas.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell>{p.empresaNome || "-"}</TableCell>
                          <TableCell><Badge variant="outline">{p.tipo}</Badge></TableCell>
                          <TableCell>{p.dataColetaTexto || "-"}</TableCell>
                          <TableCell>{formatSize(p.tamanho)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="outline" onClick={() => window.open(`/api/planilhas/${p.id}`, "_blank")}><Download className="h-3 w-3 mr-1" />Baixar</Button>
                            <Button size="sm" variant="outline" onClick={() => abrirEditor(p.id)}><Pencil className="h-3 w-3 mr-1" />Editar</Button>
                            {canGenerate && (
                              <Button size="sm" className="bg-[#1e3a8a] hover:bg-[#22c55e]" disabled={gerandoId === p.id} onClick={() => gerarDaPlanilha(p.id)}>
                                {gerandoId === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Play className="h-3 w-3 mr-1" />Gerar</>}
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => excluirPlanilha(p.id)}><Trash2 className="h-3 w-3" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Upload className="h-5 w-5 text-[#1e3a8a]" />Nova Planilha de Dados</CardTitle></CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="grid grid-cols-3 gap-2">
                  <Button type="button" variant={tipo === "SAUDE" ? "default" : "outline"} className={tipo === "SAUDE" ? "bg-[#1e3a8a]" : ""} onClick={() => setTipo("SAUDE")}>Saude</Button>
                  <Button type="button" variant={tipo === "COMPARATIVO" ? "default" : "outline"} className={tipo === "COMPARATIVO" ? "bg-[#1e3a8a]" : ""} onClick={() => setTipo("COMPARATIVO")}>Comparativo</Button>
                  <Button type="button" variant={tipo === "NPS" ? "default" : "outline"} className={tipo === "NPS" ? "bg-[#1e3a8a]" : ""} onClick={() => setTipo("NPS")}>NPS</Button>
                </div>

                <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-3">
                  <input id="planilha-upload" type="file" accept=".xlsx" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{file ? file.name : "Selecione um arquivo .xlsx no formato atual"}</p>
                  <Button variant="outline" onClick={() => document.getElementById("planilha-upload")?.click()}>Escolher arquivo</Button>
                </div>

                <Button className="bg-[#1e3a8a] hover:bg-[#22c55e]" disabled={!file || uploading} onClick={handleUpload}>
                  {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Enviando...</> : <><Plus className="h-4 w-4 mr-2" />Adicionar ao Acervo</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editandoId} onOpenChange={(open) => !open && setEditandoId(null)}>
        <DialogContent className="max-w-6xl">
          <DialogHeader><DialogTitle>Editor de Dados da Planilha</DialogTitle></DialogHeader>
          <div className="max-h-[60vh] overflow-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white border-b"><tr><th className="text-left p-2">Nome</th><th className="text-left p-2">Idade</th><th className="text-left p-2">Altura</th><th className="text-left p-2">Peso</th><th className="text-left p-2">PA</th><th className="text-left p-2">FC</th><th className="text-left p-2">Glicemia</th><th className="text-left p-2">Comorbidades</th><th className="text-left p-2">Sexo</th><th className="text-right p-2">Remover</th></tr></thead>
              <tbody>
                {linhas.map((linha, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2 min-w-[200px]"><Input value={linha.nome} onChange={(e) => { const next = [...linhas]; next[idx].nome = e.target.value; setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[100px]"><Input type="number" value={linha.idade} onChange={(e) => { const next = [...linhas]; next[idx].idade = Number(e.target.value || 0); setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[100px]"><Input type="number" step="0.01" value={linha.altura} onChange={(e) => { const next = [...linhas]; next[idx].altura = Number(e.target.value || 0); setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[100px]"><Input type="number" step="0.1" value={linha.peso} onChange={(e) => { const next = [...linhas]; next[idx].peso = Number(e.target.value || 0); setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[110px]"><Input value={linha.pa} onChange={(e) => { const next = [...linhas]; next[idx].pa = e.target.value; setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[100px]"><Input type="number" value={linha.fc} onChange={(e) => { const next = [...linhas]; next[idx].fc = Number(e.target.value || 0); setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[110px]"><Input type="number" value={linha.glicemia} onChange={(e) => { const next = [...linhas]; next[idx].glicemia = Number(e.target.value || 0); setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[220px]"><Input value={linha.comorbidades} onChange={(e) => { const next = [...linhas]; next[idx].comorbidades = e.target.value; setLinhas(next); }} /></td>
                    <td className="p-2 min-w-[90px]"><Input type="number" min={1} max={2} value={linha.sexo} onChange={(e) => { const next = [...linhas]; next[idx].sexo = Number(e.target.value || 1); setLinhas(next); }} /></td>
                    <td className="p-2 text-right"><Button size="sm" variant="ghost" className="text-red-600" onClick={() => setLinhas((prev) => prev.filter((_, i) => i !== idx))}><Trash2 className="h-3 w-3" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setLinhas((prev) => [...prev, { ...emptyLinha }])}><Plus className="h-4 w-4 mr-2" />Nova linha</Button>
            <Button className="bg-[#1e3a8a] hover:bg-[#22c55e]" disabled={saving} onClick={salvarEdicao}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


