"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Upload,
  FileBarChart,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Relatorio {
  id: string;
  dataColeta: string;
  createdAt: string;
  empresa: { nome: string };
  pdfUrl: string | null;
}

export default function RelatoriosPage() {
  const [tipoRelatorio, setTipoRelatorio] = useState<
    "SAUDE" | "COMPARATIVO" | "NPS"
  >("SAUDE");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchRelatorios();
  }, []);

  async function fetchRelatorios() {
    const res = await fetch("/api/relatorios");
    if (res.ok) {
      const data = await res.json();
      setRelatorios(data);
    }
  }

  async function handleGenerate() {
    if (tipoRelatorio === "NPS") {
      toast.info("Essa automacao sera habilitada em breve");
      return;
    }
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tipo", tipoRelatorio);

      const res = await fetch("/api/relatorios", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Relatorio gerado com sucesso!");
        setFile(null);
        fetchRelatorios();

        // Auto-download
        if (data.downloadUrl) {
          window.open(data.downloadUrl, "_blank");
        }
      } else {
        toast.error(data.error || "Erro ao gerar relatorio");
      }
    } catch {
      toast.error("Erro ao processar arquivo");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este relatorio?")) return;
    try {
      const res = await fetch(`/api/relatorios/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Relatorio excluido com sucesso!");
        fetchRelatorios();
      } else {
        toast.error("Erro ao excluir relatorio");
      }
    } catch {
      toast.error("Erro ao excluir relatorio");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (tipoRelatorio === "NPS") {
      toast.info("Selecione Saude ou Comparativo para gerar PDF");
      return;
    }
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      droppedFile.name.endsWith(".xlsx")
    ) {
      setFile(droppedFile);
    } else {
      toast.error("Apenas arquivos .xlsx sao aceitos");
    }
  }

  return (
    <>
      <Topbar
        title="Relatorios"
        description="Gere relatorios de saude e prepare comparativo/NPS"
      />

      <div className="p-6 grid gap-6 lg:grid-cols-[400px_1fr]">
        {/* Upload Panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileBarChart className="h-5 w-5 text-[#1e3a8a]" />
              Gerar Relatorio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={tipoRelatorio === "SAUDE" ? "default" : "outline"}
                className={tipoRelatorio === "SAUDE" ? "bg-[#1e3a8a]" : ""}
                onClick={() => {
                  setTipoRelatorio("SAUDE");
                  setFile(null);
                }}
              >
                Saude
              </Button>
              <Button
                type="button"
                variant={tipoRelatorio === "COMPARATIVO" ? "default" : "outline"}
                className={tipoRelatorio === "COMPARATIVO" ? "bg-[#1e3a8a]" : ""}
                onClick={() => {
                  setTipoRelatorio("COMPARATIVO");
                  setFile(null);
                }}
              >
                Comparativo
              </Button>
              <Button
                type="button"
                variant={tipoRelatorio === "NPS" ? "default" : "outline"}
                className={tipoRelatorio === "NPS" ? "bg-[#1e3a8a]" : ""}
                onClick={() => {
                  setTipoRelatorio("NPS");
                  setFile(null);
                }}
              >
                NPS
              </Button>
            </div>

            {tipoRelatorio === "NPS" && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                Relatorio NPS pronto para uso futuro. A automacao sera adicionada na proxima etapa.
              </div>
            )}

            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-[#22c55e] bg-green-50"
                  : file
                    ? "border-[#22c55e] bg-green-50/50"
                    : "border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() =>
                tipoRelatorio !== "NPS" &&
                document.getElementById("excel-upload")?.click()
              }
            >
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx"
                className="hidden"
                disabled={tipoRelatorio === "NPS"}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
              {file ? (
                <div className="space-y-2">
                  <CheckCircle className="h-10 w-10 mx-auto text-[#22c55e]" />
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-10 w-10 mx-auto text-gray-400" />
                  <p className="font-medium text-sm text-gray-600">
                    {tipoRelatorio !== "NPS"
                      ? "Arraste o arquivo Excel aqui"
                      : "Automacao em desenvolvimento"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tipoRelatorio !== "NPS"
                      ? "ou clique para selecionar (.xlsx)"
                      : "Selecione Saude ou Comparativo para gerar agora"}
                  </p>
                </div>
              )}
            </div>

            <Button
              className="w-full bg-[#1e3a8a] hover:bg-[#22c55e] transition-all"
              onClick={handleGenerate}
              disabled={tipoRelatorio === "NPS" || !file || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <FileBarChart className="h-4 w-4 mr-2" />
                  {tipoRelatorio === "SAUDE" ? "Gerar Relatorio de Saude" : tipoRelatorio === "COMPARATIVO" ? "Gerar Relatorio Comparativo" : "Automacao em breve"}
                </>
              )}
            </Button>

            {file && !loading && (
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => setFile(null)}
              >
                Remover arquivo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Reports History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5 text-[#1e3a8a]" />
              Historico de Relatorios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {relatorios.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-muted-foreground">
                  Nenhum relatorio gerado ainda
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Faca upload de um arquivo Excel para comecar
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Data da Coleta</TableHead>
                    <TableHead>Gerado em</TableHead>
                    <TableHead className="text-right">Acao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorios.map((rel) => (
                    <TableRow key={rel.id}>
                      <TableCell className="font-medium">
                        {rel.empresa.nome}
                      </TableCell>
                      <TableCell>
                        {new Date(rel.dataColeta).toLocaleDateString("pt-BR")}
                      </TableCell>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() =>
                            window.open(
                              `/api/relatorios/${rel.id}/download`,
                              "_blank"
                            )
                          }
                        >
                          <Download className="h-3 w-3" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDelete(rel.id)}
                        >
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
