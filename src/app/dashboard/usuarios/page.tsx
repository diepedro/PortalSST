"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog, Plus, Trash2, ShieldAlert, Users } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

const emptyForm = { name: "", email: "", password: "", role: "USER" as "ADMIN" | "USER" };

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const me = session?.user as { id?: string; role?: string } | undefined;
  const isAdmin = me?.role === "ADMIN";

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error();
      setUsers(await res.json());
    } catch {
      toast.error("Erro ao carregar usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/login"); return; }
    if (status === "authenticated" && !isAdmin) { router.replace("/dashboard"); return; }
    if (status === "authenticated" && isAdmin) fetchUsers();
  }, [status, isAdmin, router, fetchUsers]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Preencha todos os campos obrigatorios");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao criar usuario");
        return;
      }
      toast.success("Usuario criado com sucesso!");
      setForm(emptyForm);
      setDialogOpen(false);
      fetchUsers();
    } catch {
      toast.error("Erro ao criar usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Excluir o usuario "${name}"? Esta acao nao pode ser desfeita.`)) return;
    try {
      const res = await fetch("/api/usuarios", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Erro ao excluir usuario");
        return;
      }
      toast.success("Usuario excluido");
      fetchUsers();
    } catch {
      toast.error("Erro ao excluir usuario");
    }
  }

  if (status === "loading" || loading) {
    return (
      <>
        <Topbar title="Usuarios" description="Gerenciamento de usuarios do sistema" />
        <div className="p-6 flex items-center justify-center min-h-[300px]">
          <div className="text-muted-foreground text-sm animate-pulse">Carregando...</div>
        </div>
      </>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Topbar title="Usuarios" description="Gerenciamento de usuarios do sistema" />

      <div className="p-6 space-y-6">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-[#1e3a8a]" />
            <span className="text-sm text-muted-foreground">
              {users.length} usuario{users.length !== 1 ? "s" : ""} cadastrado{users.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1e3a8a] hover:bg-[#22c55e] transition-all gap-2">
                <Plus className="h-4 w-4" />
                Novo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Usuario</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimo 6 caracteres"
                    minLength={6}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Perfil</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm({ ...form, role: v as "ADMIN" | "USER" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Usuario</SelectItem>
                      <SelectItem value="ADMIN">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setDialogOpen(false); setForm(emptyForm); }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1e3a8a] hover:bg-[#22c55e] transition-all"
                    disabled={saving}
                  >
                    {saving ? "Criando..." : "Criar Usuario"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin notice */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
          <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
          <span>
            Esta pagina e visivel apenas para administradores. Crie contas de usuario para que colaboradores possam acessar o portal e fazer upload de arquivos.
          </span>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-[#1e3a8a]" />
              Usuarios Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Nenhum usuario cadastrado.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Nome</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Perfil</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Criado em</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground">Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const isSelf = me?.id === user.id;
                      return (
                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium">
                            {user.name}
                            {isSelf && (
                              <span className="ml-2 text-xs text-muted-foreground">(voce)</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-3">
                            <Badge
                              variant="secondary"
                              className={
                                user.role === "ADMIN"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-600"
                              }
                            >
                              {user.role === "ADMIN" ? "Admin" : "Usuario"}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              disabled={isSelf}
                              title={isSelf ? "Nao e possivel excluir o proprio usuario" : "Excluir usuario"}
                              onClick={() => handleDelete(user.id, user.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
