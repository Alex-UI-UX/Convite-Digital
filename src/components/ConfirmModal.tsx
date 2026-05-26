"use client";

import { useState } from "react";
import { X, Plus, Minus, UserCheck, UserX } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed?: (status: "confirmado" | "recusado", nome: string) => void;
  initialStatus: "confirmado" | "recusado" | null;
}

export default function ConfirmModal({ isOpen, onClose, onConfirmed, initialStatus }: ConfirmModalProps) {
  const [status, setStatus] = useState<"confirmado" | "recusado" | null>(initialStatus);
  const [nome, setNome] = useState("");
  const [numAcompanhantes, setNumAcompanhantes] = useState(0);
  const [acompanhantes, setAcompanhantes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleNumChange = (delta: number) => {
    const newNum = Math.max(0, Math.min(10, numAcompanhantes + delta));
    setNumAcompanhantes(newNum);
    const newAcomp = [...acompanhantes];
    while (newAcomp.length < newNum) newAcomp.push("");
    while (newAcomp.length > newNum) newAcomp.pop();
    setAcompanhantes(newAcomp);
  };

  const updateAcompanhante = (index: number, value: string) => {
    const newAcomp = [...acompanhantes];
    newAcomp[index] = value;
    setAcompanhantes(newAcomp);
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      setError("Informe seu nome");
      return;
    }
    if (!status) {
      setError("Selecione se você vai ou não");
      return;
    }

    const acompanhantesValidos = acompanhantes.filter((a) => a.trim() !== "");
    if (status === "confirmado" && numAcompanhantes > 0 && acompanhantesValidos.length !== numAcompanhantes) {
      setError("Preencha o nome de todos os acompanhantes");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          status,
          acompanhantes: status === "confirmado" ? acompanhantesValidos : [],
        }),
      });

      if (!res.ok) throw new Error("Erro ao enviar");

      setSuccess(true);
      if (onConfirmed && status) {
        onConfirmed(status, nome.trim());
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setNome("");
        setStatus(null);
        setNumAcompanhantes(0);
        setAcompanhantes([]);
      }, 2500);
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[var(--color-marrom-dark)]">
            Confirmar Presença
          </h2>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition">
            <X size={24} className="text-[var(--color-marrom)]" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">
              {status === "confirmado" ? "🎉" : "😢"}
            </div>
            <p className="text-lg font-bold text-[var(--color-marrom-dark)]">
              {status === "confirmado"
                ? "Presença confirmada! Te esperamos lá!"
                : "Que pena! Sentiremos sua falta!"}
            </p>
          </div>
        ) : (
          <>
            {!status && (
              <div className="flex flex-col gap-3 mb-6">
                <p className="text-center text-[var(--color-marrom)] font-medium">
                  Você vai comparecer?
                </p>
                <button
                  onClick={() => setStatus("confirmado")}
                  className="btn-pirate flex items-center justify-center gap-2 w-full"
                >
                  <UserCheck size={20} />
                  Eu vou ;-)
                </button>
                <button
                  onClick={() => setStatus("recusado")}
                  className="btn-pirate-outline flex items-center justify-center gap-2 w-full"
                >
                  <UserX size={20} />
                  Não vou...
                </button>
              </div>
            )}

            {status && (
              <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setStatus("confirmado")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
                      status === "confirmado"
                        ? "bg-green-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    ✓ Eu vou
                  </button>
                  <button
                    onClick={() => {
                      setStatus("recusado");
                      setNumAcompanhantes(0);
                      setAcompanhantes([]);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition ${
                      status === "recusado"
                        ? "bg-red-700 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    ✗ Não vou
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full"
                  />
                </div>

                {status === "confirmado" && (
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                      Acompanhantes
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        onClick={() => handleNumChange(-1)}
                        className="w-9 h-9 rounded-full bg-[var(--color-marrom)] text-white flex items-center justify-center"
                        disabled={numAcompanhantes === 0}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-bold w-8 text-center">
                        {numAcompanhantes}
                      </span>
                      <button
                        onClick={() => handleNumChange(1)}
                        className="w-9 h-9 rounded-full bg-[var(--color-marrom)] text-white flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {acompanhantes.map((acomp, i) => (
                      <input
                        key={i}
                        type="text"
                        value={acomp}
                        onChange={(e) => updateAcompanhante(i, e.target.value)}
                        placeholder={`Nome do acompanhante ${i + 1}`}
                        className="w-full mb-2"
                      />
                    ))}
                  </div>
                )}

                {error && (
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-pirate w-full text-center disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar Resposta"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
