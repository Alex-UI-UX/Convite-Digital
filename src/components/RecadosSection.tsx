"use client";

import { useState, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

interface Recado {
  _id: string;
  autor: string;
  texto: string;
  criadoEm: string;
}

interface RecadosSectionProps {
  textoRecados: string;
}

export default function RecadosSection({ textoRecados }: RecadosSectionProps) {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    fetchRecados();
  }, []);

  const fetchRecados = async () => {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setRecados(data);
      }
    } catch {
      console.error("Erro ao carregar recados");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!autor.trim() || !texto.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autor: autor.trim(), texto: texto.trim() }),
      });

      if (res.ok) {
        setAutor("");
        setTexto("");
        setEnviado(true);
        setTimeout(() => setEnviado(false), 3000);
        fetchRecados();
      }
    } catch {
      console.error("Erro ao enviar recado");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section id="recados" className="px-6 py-10 max-w-lg mx-auto w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[var(--color-marrom-dark)] mb-2">
        Recados
      </h2>
      <p className="text-center text-[var(--color-marrom)] mb-6 italic">
        {textoRecados}
      </p>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Seu nome"
          className="w-full"
          required
        />
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva seu recadinho..."
          rows={3}
          className="w-full resize-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-pirate w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={18} />
          {loading ? "Enviando..." : "Enviar Recado"}
        </button>
        {enviado && (
          <p className="text-green-700 text-sm text-center font-medium">
            Recado enviado com sucesso! 💌
          </p>
        )}
      </form>

      <div className="space-y-4">
        {recados.length === 0 && (
          <p className="text-center text-[var(--color-marrom)] opacity-60 italic">
            Seja o primeiro a deixar um recado!
          </p>
        )}
        {recados.map((recado) => (
          <div
            key={recado._id}
            className="parchment-bg rounded-xl p-4 border border-[var(--color-dourado)]/30"
          >
            <div className="flex items-start gap-3">
              <MessageCircle size={20} className="text-[var(--color-dourado)] mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-[var(--color-marrom-dark)] text-sm">
                    {recado.autor}
                  </span>
                  <span className="text-xs text-[var(--color-marrom)] opacity-60">
                    {formatDate(recado.criadoEm)}
                  </span>
                </div>
                <p className="text-[var(--color-marrom-dark)] text-sm leading-relaxed">
                  {recado.texto}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
