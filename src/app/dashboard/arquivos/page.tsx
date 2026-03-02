"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Upload,
  Download,
  Trash2,
  FileText,
  FileImage,
  File,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Arquivo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  createdAt: string;
}

function getFileIcon(tipo: string) {
  if (tipo.startsWith("image/")) return FileImage;
  if (tipo.includes("pdf") || tipo.includes("document")) return FileText;
  return File;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ArquivosPage() {
  const [arquivos, setArquivos] = useState<Arquivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchArquivos();
  }, []);

  async function fetchArquivos() {
    const res = await fetch("/api/arquivos");
    if (res.ok) setArquivos(await res.json());
  }

  async function handleUpload(files: FileList | File[]) {
    setLoading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));

      const res = await fetch("/api/arquivos", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success(`${files.length} arquivo(s) enviado(s)!`);
        fetchArquivos();
      } else {
        toast.error("Erro no upload");
      }
    } catch {
      toast.error("Erro de conexao");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/arquivos/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Arquivo removido");
      fetchArquivos();
    } else {
      toast.error("Erro ao remover");
    }
  }

  return (
    <>
      <Topbar
        title="Arquivos"
        description="Armazene e gerencie documentos"
      />

      <div className="p-6 space-y-6">
        {/* Upload area */}
        <Card>
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-[#22c55e] bg-green-50"
                  : "border-gray-200 hover:border-[#1e3a8a] hover:bg-blue-50/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleUpload(e.dataTransfer.files);
              }}
              onClick={() =>
                document.getElementById("file-upload")?.click()
              }
            >
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleUpload(e.target.files);
                }}
              />
              {loading ? (
                <Loader2 className="h-10 w-10 mx-auto text-[#1e3a8a] animate-spin" />
              ) : (
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
              )}
              <p className="font-medium text-sm text-gray-600 mt-3">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Palestras, documentos, apresentacoes, etc.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-[#1e3a8a]" />
            Arquivos ({arquivos.length})
          </h3>

          {arquivos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12 text-muted-foreground">
                Nenhum arquivo armazenado
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {arquivos.map((arq) => {
                const Icon = getFileIcon(arq.tipo);
                return (
                  <Card
                    key={arq.id}
                    className="border-l-4 border-l-[#22c55e] hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-green-100 p-2">
                          <Icon className="h-5 w-5 text-[#22c55e]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {arq.nome}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatSize(arq.tamanho)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(arq.createdAt).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={() =>
                            window.open(`/api/arquivos/${arq.id}`, "_blank")
                          }
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Baixar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 text-xs"
                          onClick={() => handleDelete(arq.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
