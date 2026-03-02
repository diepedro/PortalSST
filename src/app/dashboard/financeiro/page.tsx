"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Wallet, Loader2, FileDown } from "lucide-react";
import { toast } from "sonner";

interface FolhaItem {
  atividadeId: string;
  data: string;
  tipo: string;
  empresa: string;
  cidade: string | null;
  valorBase: number;
  ajudaCusto: number;
  deslocamento: number;
  total: number;
}

interface FolhaProfissional {
  profissionalId: string;
  profissionalNome: string;
  total: number;
  itens: FolhaItem[];
}

function firstDayOfMonth() {
  const now = new Date();
  const first = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  return first.toISOString().slice(0, 10);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function money(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function FinanceiroPage() {
  const [dataInicial, setDataInicial] = useState(firstDayOfMonth());
  const [dataFinal, setDataFinal] = useState(today());
  const [loading, setLoading] = useState(false);
  const [loadingPdfId, setLoadingPdfId] = useState<string | null>(null);
  const [folha, setFolha] = useState<FolhaProfissional[]>([]);

  const fetchFolha = useCallback(async function fetchFolha() {
    if (!dataInicial || !dataFinal) {
      toast.error("Informe data inicial e final");
      return;
    }
    if (dataInicial > dataFinal) {
      toast.error("A data inicial nao pode ser maior que a data final");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        dataInicio: dataInicial,
        dataFim: dataFinal,
      });
      const res = await fetch(`/api/financeiro?${params.toString()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFolha(data.folha || []);
    } catch {
      toast.error("Erro ao carregar financeiro");
    } finally {
      setLoading(false);
    }
  }, [dataInicial, dataFinal]);

  async function handleGerarPdf(profissionalId: string) {
    if (!dataInicial || !dataFinal) {
      toast.error("Informe data inicial e final");
      return;
    }
    setLoadingPdfId(profissionalId);
    try {
      const params = new URLSearchParams({
        profissionalId,
        dataInicio: dataInicial,
        dataFim: dataFinal,
      });
      window.open(`/api/financeiro/pdf?${params.toString()}`, "_blank");
    } finally {
      setLoadingPdfId(null);
    }
  }

  useEffect(() => {
    fetchFolha();
  }, [fetchFolha]);

  const totalGeral = useMemo(
    () => folha.reduce((acc, prof) => acc + prof.total, 0),
    [folha]
  );

  return (
    <>
      <Topbar title="Financeiro" description="Folha de pagamento dos profissionais" />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5 text-[#1e3a8a]" />
              Filtro da Folha
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-end gap-3">
            <div>
              <p className="text-sm font-medium mb-1">Data inicial</p>
              <Input
                type="date"
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Data final</p>
              <Input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
            </div>
            <Button className="bg-[#1e3a8a] hover:bg-[#22c55e]" onClick={fetchFolha} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Atualizar
            </Button>
            <Badge variant="outline" className="ml-auto">
              Total do periodo: {money(totalGeral)}
            </Badge>
          </CardContent>
        </Card>

        {folha.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum pagamento encontrado para o periodo selecionado.
            </CardContent>
          </Card>
        ) : (
          folha.map((prof) => (
            <Card key={prof.profissionalId}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <span>{prof.profissionalNome}</span>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">{money(prof.total)}</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGerarPdf(prof.profissionalId)}
                      disabled={loadingPdfId === prof.profissionalId}
                    >
                      {loadingPdfId === prof.profissionalId ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <FileDown className="h-3.5 w-3.5 mr-1" />
                      )}
                      PDF
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Ajuda</TableHead>
                      <TableHead>Deslocamento</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prof.itens.map((item) => (
                      <TableRow key={item.atividadeId}>
                        <TableCell>{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{item.tipo}</TableCell>
                        <TableCell>{item.empresa}</TableCell>
                        <TableCell>{item.cidade || "-"}</TableCell>
                        <TableCell>{money(item.valorBase)}</TableCell>
                        <TableCell>{money(item.ajudaCusto)}</TableCell>
                        <TableCell>{money(item.deslocamento)}</TableCell>
                        <TableCell className="font-semibold">{money(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
