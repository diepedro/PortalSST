"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Phone,
  Clock,
  Briefcase,
  Loader2,
  UserCheck,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

interface Profissional {
  id: string;
  nome: string;
  profissao: string;
  especialidade: string | null;
  disponibilidade: string | null;
  contato: string | null;
  portfolioUrl: string | null;
  ativo: boolean;
}

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(false);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    nome: "",
    profissao: "",
    especialidade: "",
    disponibilidade: "",
    contato: "",
  });

  useEffect(() => {
    fetchProfissionais();
  }, []);

  async function fetchProfissionais() {
    const res = await fetch("/api/profissionais");
    if (res.ok) setProfissionais(await res.json());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.profissao) {
      toast.error("Nome e profissao sao obrigatorios");
      return;
    }
    setLoading(true);
    try {
      const body = new FormData();
      body.append("nome", form.nome);
      body.append("profissao", form.profissao);
      body.append("especialidade", form.especialidade);
      body.append("disponibilidade", form.disponibilidade);
      body.append("contato", form.contato);
      if (portfolioFile) {
        body.append("portfolio", portfolioFile);
      }

      const res = await fetch("/api/profissionais", {
        method: "POST",
        body,
      });

      if (res.ok) {
        toast.success("Profissional cadastrado!");
        setForm({ nome: "", profissao: "", especialidade: "", disponibilidade: "", contato: "" });
        setPortfolioFile(null);
        fetchProfissionais();
      } else {
        toast.error("Erro ao cadastrar");
      }
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAtivo(prof: Profissional) {
    const res = await fetch("/api/profissionais", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: prof.id, ativo: !prof.ativo }),
    });
    if (res.ok) {
      toast.success(prof.ativo ? "Profissional desativado" : "Profissional reativado");
      fetchProfissionais();
    }
  }

  return (
    <>
      <Topbar title="Profissionais" description="Gerencie a equipe de saude" />

      <div className="p-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-[#1e3a8a]" />
              Novo Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="profissao">Profissao</Label>
                <Input
                  id="profissao"
                  value={form.profissao}
                  onChange={(e) => setForm({ ...form, profissao: e.target.value })}
                  placeholder="Ex: Enfermeira, Medico"
                />
              </div>
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={form.especialidade}
                  onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
                  placeholder="Ex: Saude do Trabalhador"
                />
              </div>
              <div>
                <Label htmlFor="disponibilidade">Disponibilidade</Label>
                <Input
                  id="disponibilidade"
                  value={form.disponibilidade}
                  onChange={(e) => setForm({ ...form, disponibilidade: e.target.value })}
                  placeholder="Ex: Seg a Sex"
                />
              </div>
              <div>
                <Label htmlFor="contato">Contato</Label>
                <Input
                  id="contato"
                  value={form.contato}
                  onChange={(e) => setForm({ ...form, contato: e.target.value })}
                  placeholder="(XX) XXXXX-XXXX"
                />
              </div>
              <div>
                <Label htmlFor="portfolio">Portfolio</Label>
                <Input
                  id="portfolio"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
                />
                {portfolioFile && (
                  <p className="text-xs text-muted-foreground mt-1">{portfolioFile.name}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1e3a8a] hover:bg-[#22c55e] transition-all"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 mr-2" />
                )}
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#1e3a8a]" />
            Equipe ({profissionais.length})
          </h3>
          {profissionais.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                Nenhum profissional cadastrado
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {profissionais.map((prof) => (
                <Card
                  key={prof.id}
                  className={`border-l-4 transition-all hover:shadow-md ${
                    prof.ativo ? "border-l-[#1e3a8a]" : "border-l-gray-300 opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold">{prof.nome}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Briefcase className="h-3 w-3" />
                          {prof.profissao}
                          {prof.especialidade && ` - ${prof.especialidade}`}
                        </p>
                      </div>
                      <Badge
                        variant={prof.ativo ? "default" : "secondary"}
                        className={prof.ativo ? "bg-green-100 text-green-700" : ""}
                      >
                        {prof.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="mt-3 space-y-1">
                      {prof.disponibilidade && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {prof.disponibilidade}
                        </p>
                      )}
                      {prof.contato && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {prof.contato}
                        </p>
                      )}
                      {prof.portfolioUrl && (
                        <a
                          href={prof.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#1e3a8a] hover:underline inline-flex items-center gap-1"
                        >
                          <FileText className="h-3 w-3" />
                          Ver portfolio
                        </a>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-2 text-xs"
                      onClick={() => toggleAtivo(prof)}
                    >
                      {prof.ativo ? "Desativar" : "Reativar"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
