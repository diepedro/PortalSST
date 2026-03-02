export const dynamic = "force-dynamic";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { prisma } from "@/lib/prisma";
import {
  FileBarChart,
  CalendarDays,
  Users,
  FolderOpen,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

async function getStats() {
  const now = new Date();

  const [
    relatorios,
    atividadesPendentes,
    profissionais,
    arquivos,
    proximas,
    recentesRelatorios,
  ] = await Promise.all([
    prisma.relatorio.count(),
    prisma.atividade.count({ where: { status: "AGENDADA" } }),
    prisma.profissional.count({ where: { ativo: true } }),
    prisma.arquivo.count(),
    // Next 5 upcoming scheduled activities
    prisma.atividade.findMany({
      where: { status: "AGENDADA", data: { gte: now } },
      take: 5,
      orderBy: { data: "asc" },
      include: { empresa: true, profissional: true },
    }),
    // 5 most recent reports
    prisma.relatorio.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { empresa: true },
    }),
  ]);

  return { relatorios, atividadesPendentes, profissionais, arquivos, proximas, recentesRelatorios };
}

const tipoColors: Record<string, string> = {
  BLITZ:    "bg-orange-100 text-orange-700",
  PALESTRA: "bg-purple-100 text-purple-700",
  SIPAT:    "bg-blue-100   text-blue-700",
};

function daysUntil(date: string | Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function DaysChip({ iso }: { iso: string | Date }) {
  const days = daysUntil(iso);
  if (days === 0) return <span className="text-xs font-bold text-green-600">Hoje</span>;
  if (days === 1) return <span className="text-xs font-bold text-blue-600">Amanha</span>;
  if (days < 0)  return <span className="text-xs text-muted-foreground">Passou</span>;
  return <span className="text-xs text-muted-foreground">Em {days}d</span>;
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <>
      <Topbar title="Painel" description="Visao geral do Portal Equilibrio SST" />

      <div className="p-6 space-y-6">

        {/* ── Quick Actions ────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/relatorios">
            <Button className="bg-[#1e3a8a] hover:bg-[#22c55e] transition-all gap-2">
              <Plus className="h-4 w-4" />
              Gerar Relatorio
            </Button>
          </Link>
          <Link href="/dashboard/agenda">
            <Button variant="outline" className="gap-2 border-[#1e3a8a] text-[#1e3a8a] hover:bg-blue-50">
              <CalendarDays className="h-4 w-4" />
              Agendar Atividade
            </Button>
          </Link>
          <Link href="/dashboard/arquivos">
            <Button variant="outline" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Upload de Arquivos
            </Button>
          </Link>
          <Link href="/dashboard/profissionais">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Profissionais
            </Button>
          </Link>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/relatorios" className="block">
            <StatCard
              title="Relatorios"
              value={stats.relatorios}
              description="PDFs gerados"
              icon={<FileBarChart className="h-5 w-5" />}
              color="blue"
            />
          </Link>
          <Link href="/dashboard/agenda" className="block">
            <StatCard
              title="Agendados"
              value={stats.atividadesPendentes}
              description="Atividades pendentes"
              icon={<CalendarDays className="h-5 w-5" />}
              color="green"
            />
          </Link>
          <Link href="/dashboard/profissionais" className="block">
            <StatCard
              title="Profissionais"
              value={stats.profissionais}
              description="Profissionais ativos"
              icon={<Users className="h-5 w-5" />}
              color="orange"
            />
          </Link>
          <Link href="/dashboard/arquivos" className="block">
            <StatCard
              title="Arquivos"
              value={stats.arquivos}
              description="Documentos salvos"
              icon={<FolderOpen className="h-5 w-5" />}
              color="red"
            />
          </Link>
        </div>

        {/* ── Two-column: Upcoming + Recent Reports ────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Proximas atividades */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-[#1e3a8a]" />
                  Proximas Atividades
                </CardTitle>
                <Link href="/dashboard/agenda">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-[#1e3a8a]">
                    Ver todas <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {stats.proximas.length === 0 ? (
                <div className="text-center py-10">
                  <CalendarDays className="h-10 w-10 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-muted-foreground">Nenhuma atividade futura</p>
                  <Link href="/dashboard/agenda">
                    <Button size="sm" variant="outline" className="mt-3 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Agendar agora
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.proximas.map((ativ) => {
                    const days = daysUntil(ativ.data);
                    const isUrgent = days <= 2;
                    return (
                      <div
                        key={ativ.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isUrgent ? "border-orange-200 bg-orange-50/50" : "border-transparent bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isUrgent ? "bg-orange-100" : "bg-[#1e3a8a]/10"
                        }`}>
                          {isUrgent
                            ? <AlertTriangle className="h-4 w-4 text-orange-600" />
                            : <CalendarDays className="h-4 w-4 text-[#1e3a8a]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{ativ.titulo}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{ativ.empresa.nome}</span>
                            {ativ.endereco && (
                              <>
                                <span>·</span>
                                <MapPin className="h-3 w-3 inline" />
                                <span className="truncate">{ativ.endereco}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <DaysChip iso={ativ.data} />
                          <div className="mt-1">
                            <Badge className={`text-xs ${tipoColors[ativ.tipo] || ""}`} variant="secondary">
                              {ativ.tipo}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ultimos relatorios */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileBarChart className="h-4 w-4 text-[#1e3a8a]" />
                  Ultimos Relatorios
                </CardTitle>
                <Link href="/dashboard/relatorios">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 text-[#1e3a8a]">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {stats.recentesRelatorios.length === 0 ? (
                <div className="text-center py-10">
                  <FileBarChart className="h-10 w-10 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-muted-foreground">Nenhum relatorio gerado</p>
                  <Link href="/dashboard/relatorios">
                    <Button size="sm" variant="outline" className="mt-3 text-xs">
                      <Plus className="h-3 w-3 mr-1" /> Gerar relatorio
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentesRelatorios.map((rel) => (
                    <div
                      key={rel.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 border border-transparent transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-[#1e3a8a]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{rel.empresa.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          Coleta: {new Date(rel.dataColeta).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(rel.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                        {rel.pdfUrl && (
                          <a
                            href={`/api/relatorios/${rel.id}/download`}
                            target="_blank"
                            className="text-xs text-[#1e3a8a] hover:underline"
                          >
                            Baixar PDF
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
