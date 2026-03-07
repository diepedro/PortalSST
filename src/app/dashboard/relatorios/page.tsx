"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Download,
  FileBarChart,
  FileSpreadsheet,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

interface Relatorio {
  id: string;
  dataColeta: string;
  createdAt: string;
  empresa: { nome: string };
  pdfUrl: string | null;
}

interface Planilha {
  id: string;
  nome: string;
  tipo: "SAUDE" | "COMPARATIVO" | "NPS" | string;
  empresaNome: string | null;
  dataColetaTexto: string | null;
}

type SourceMode = "upload" | "acervo";

export default function RelatoriosPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const role = (session?.user as any)?.role as string | undefined;

  const [loading, setLoading] = useState(false);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [planilhas, setPlanilhas] = useState<Planilha[]>([]);

  const [saudeMode, setSaudeMode] = useState<SourceMode>("upload");
  const [saudeFile, setSaudeFile] = useState<File | null>(null);
  const [saudeAcervoId, setSaudeAcervoId] = useState("");

  const [npsMode, setNpsMode] = useState<SourceMode>("upload");
  const [npsFile, setNpsFile] = useState<File | null>(null);
  const [npsAcervoId, setNpsAcervoId] = useState("");

  const [antesMode, setAntesMode] = useState<SourceMode>("upload");
  const [depoisMode, setDepoisMode] = useState<SourceMode>("upload");
  const [antesFile, setAntesFile] = useState<File | null>(null);
  const [depoisFile, setDepoisFile] = useState<File | null>(null);
  const [antesAcervoId, setAntesAcervoId] = useState("");
  const [depoisAcervoId, setDepoisAcervoId] = useState("");

  const saudePlanilhas = useMemo(() => planilhas.filter((p) => p.tipo === "SAUDE"), [planilhas]);
  const npsPlanilhas = useMemo(() => planilhas.filter((p) => p.tipo === "NPS"), [planilhas]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (role === "COLETA") {
      router.replace("/dashboard/planilhas");
      return;
    }
    fetchRelatorios();
    fetchPlanilhas();
  }, [status, role, router]);

  async function fetchRelatorios() {
    const res = await fetch("/api/relatorios");
    if (res.ok) setRelatorios(await res.json());
  }

  async function fetchPlanilhas() {
    const res = await fetch("/api/planilhas");
    if (!res.ok) return;
    const data = (await res.json()) as Planilha[];
    setPlanilhas(data);
    if (!saudeAcervoId) setSaudeAcervoId(data.find((p) => p.tipo === "SAUDE")?.id ?? "");
    if (!npsAcervoId) setNpsAcervoId(data.find((p) => p.tipo === "NPS")?.id ?? "");
    if (!antesAcervoId) setAntesAcervoId(data.find((p) => p.tipo === "SAUDE")?.id ?? "");
    if (!depoisAcervoId) setDepoisAcervoId(data.find((p) => p.tipo === "SAUDE")?.id ?? "");
  }

  async function getAcervoFile(planilhaId: string): Promise<File> {
    const res = await fetch(`/api/planilhas/${planilhaId}`);
    if (!res.ok) throw new Error("Falha ao obter arquivo do acervo.");
    const blob = await res.blob();
    const found = planilhas.find((p) => p.id === planilhaId);
    const name = found?.nome || `${planilhaId}.xlsx`;
    return new File([blob], name, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }

  async function submitAndOpen(formData: FormData) {
    const res = await fetch("/api/relatorios", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Erro ao gerar relatório");
      return;
    }
    toast.success("Relatório gerado com sucesso");
    fetchRelatorios();
    if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
  }

  async function generateSingle(tipo: "SAUDE" | "NPS", mode: SourceMode, file: File | null, planilhaId: string) {
    setLoading(true);
    try {
      if (mode === "acervo") {
        if (!planilhaId) {
          toast.error("Selecione uma planilha do acervo");
          return;
        }
        const res = await fetch(`/api/planilhas/${planilhaId}/gerar`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Erro ao gerar relatório");
          return;
        }
        toast.success("Relatório gerado a partir do acervo");
        fetchRelatorios();
        if (data.downloadUrl) window.open(data.downloadUrl, "_blank");
        return;
      }

      if (!file) {
        toast.error("Selecione um arquivo .xlsx");
        return;
      }
      const formData = new FormData();
      formData.append("tipo", tipo);
      formData.append("file", file);
      await submitAndOpen(formData);
    } finally {
      setLoading(false);
    }
  }

  async function generateComparativo() {
    setLoading(true);
    try {
      const before = antesMode === "upload" ? antesFile : antesAcervoId ? await getAcervoFile(antesAcervoId) : null;
      const after = depoisMode === "upload" ? depoisFile : depoisAcervoId ? await getAcervoFile(depoisAcervoId) : null;

      if (!before || !after) {
        toast.error("Preencha os dois arquivos do comparativo (Antes e Depois).");
        return;
      }

      const formData = new FormData();
      formData.append("tipo", "COMPARATIVO");
      formData.append("fileAntes", before);
      formData.append("fileDepois", after);
      await submitAndOpen(formData);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este relatório?")) return;
    const res = await fetch(`/api/relatorios/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Relatório excluído");
      fetchRelatorios();
    } else {
      toast.error("Erro ao excluir relatório");
    }
  }

  return (
    <>
      <Topbar title="Relatórios" description="Geração por saúde, comparativo e NPS" />

      <div className="p-6 grid gap-6 lg:grid-cols-[520px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Relatório de saúde</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button size="sm" variant={saudeMode === "upload" ? "default" : "outline"} onClick={() => setSaudeMode("upload")}>Upload</Button>
                <Button size="sm" variant={saudeMode === "acervo" ? "default" : "outline"} onClick={() => setSaudeMode("acervo")}><Database className="h-4 w-4 mr-1" />Acervo</Button>
              </div>
              {saudeMode === "upload" ? (
                <Input type="file" accept=".xlsx" onChange={(e) => setSaudeFile(e.target.files?.[0] ?? null)} />
              ) : (
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={saudeAcervoId} onChange={(e) => setSaudeAcervoId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {saudePlanilhas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              )}
              <Button className="w-full bg-[#1e3a8a]" disabled={loading} onClick={() => generateSingle("SAUDE", saudeMode, saudeFile, saudeAcervoId)}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Gerar relatório de saúde
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Comparativo</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Antes</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant={antesMode === "upload" ? "default" : "outline"} onClick={() => setAntesMode("upload")}>Upload</Button>
                    <Button size="sm" variant={antesMode === "acervo" ? "default" : "outline"} onClick={() => setAntesMode("acervo")}>Acervo</Button>
                  </div>
                  {antesMode === "upload" ? (
                    <Input type="file" accept=".xlsx" onChange={(e) => setAntesFile(e.target.files?.[0] ?? null)} />
                  ) : (
                    <select className="w-full border rounded-md px-3 py-2 text-sm" value={antesAcervoId} onChange={(e) => setAntesAcervoId(e.target.value)}>
                      <option value="">Selecione...</option>
                      {saudePlanilhas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Depois</Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant={depoisMode === "upload" ? "default" : "outline"} onClick={() => setDepoisMode("upload")}>Upload</Button>
                    <Button size="sm" variant={depoisMode === "acervo" ? "default" : "outline"} onClick={() => setDepoisMode("acervo")}>Acervo</Button>
                  </div>
                  {depoisMode === "upload" ? (
                    <Input type="file" accept=".xlsx" onChange={(e) => setDepoisFile(e.target.files?.[0] ?? null)} />
                  ) : (
                    <select className="w-full border rounded-md px-3 py-2 text-sm" value={depoisAcervoId} onChange={(e) => setDepoisAcervoId(e.target.value)}>
                      <option value="">Selecione...</option>
                      {saudePlanilhas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  )}
                </div>
              </div>
              <Button className="w-full bg-[#1e3a8a]" disabled={loading} onClick={generateComparativo}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileBarChart className="h-4 w-4 mr-2" />}
                Gerar comparativo
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">NPS</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button size="sm" variant={npsMode === "upload" ? "default" : "outline"} onClick={() => setNpsMode("upload")}>Upload</Button>
                <Button size="sm" variant={npsMode === "acervo" ? "default" : "outline"} onClick={() => setNpsMode("acervo")}><Database className="h-4 w-4 mr-1" />Acervo</Button>
              </div>
              {npsMode === "upload" ? (
                <Input type="file" accept=".xlsx" onChange={(e) => setNpsFile(e.target.files?.[0] ?? null)} />
              ) : (
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={npsAcervoId} onChange={(e) => setNpsAcervoId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {npsPlanilhas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              )}
              <Button className="w-full bg-[#1e3a8a]" disabled={loading} onClick={() => generateSingle("NPS", npsMode, npsFile, npsAcervoId)}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Gerar relatório NPS
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5 text-[#1e3a8a]" />
              Histórico de Relatórios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relatorios.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-muted-foreground">Nenhum relatório gerado ainda</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Data da Coleta</TableHead>
                    <TableHead>Gerado em</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorios.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell className="font-medium">{rel.empresa.nome}</TableCell>
                      <TableCell>{new Date(rel.dataColeta).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {new Date(rel.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => window.open(`/api/relatorios/${rel.id}/pdf`, "_blank")}>
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(rel.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
