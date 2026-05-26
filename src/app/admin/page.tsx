"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Users,
  MessageCircle,
  Settings,
  LogOut,
  Trash2,
  UserCheck,
  UserX,
  RefreshCw,
  Save,
} from "lucide-react";

interface Guest {
  _id: string;
  nome: string;
  status: "confirmado" | "recusado";
  acompanhantes: string[];
  criadoEm: string;
}

interface Message {
  _id: string;
  autor: string;
  texto: string;
  criadoEm: string;
}

interface EventData {
  nomeCrianca: string;
  tituloEvento: string;
  data: string;
  horario: string;
  nomeLocal: string;
  endereco: string;
  embedMaps: string;
  mensagemTematica: string;
  subtituloMensagem: string;
  textoRecados: string;
  prazoConfirmacao: string;
}

type Tab = "convidados" | "recados" | "configuracoes";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("convidados");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, mRes, eRes] = await Promise.all([
        fetch("/api/guests"),
        fetch("/api/messages"),
        fetch("/api/event"),
      ]);
      if (gRes.ok) setGuests(await gRes.json());
      if (mRes.ok) setMessages(await mRes.json());
      if (eRes.ok) setEventData(await eRes.json());
    } catch {
      console.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  const deleteGuest = async (id: string) => {
    if (!confirm("Remover este convidado?")) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    setGuests((prev) => prev.filter((g) => g._id !== id));
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Remover este recado?")) return;
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const saveEvent = async () => {
    if (!eventData) return;
    setSaving(true);
    try {
      const res = await fetch("/api/event", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        setSaveMsg("Salvo com sucesso!");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch {
      setSaveMsg("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof EventData, value: string) => {
    if (!eventData) return;
    setEventData({ ...eventData, [field]: value });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center parchment-bg">
        <p className="text-[var(--color-marrom)] text-lg">Carregando...</p>
      </div>
    );
  }

  if (!session) return null;

  const confirmados = guests.filter((g) => g.status === "confirmado");
  const recusados = guests.filter((g) => g.status === "recusado");
  const totalPessoas =
    confirmados.length +
    confirmados.reduce((acc, g) => acc + g.acompanhantes.length, 0);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "convidados", label: "Convidados", icon: <Users size={18} /> },
    { key: "recados", label: "Recados", icon: <MessageCircle size={18} /> },
    { key: "configuracoes", label: "Config", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bege-light)]">
      {/* Header */}
      <header className="bg-[var(--color-marrom-dark)] text-[var(--color-bege)] px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Painel Admin</h1>
        <div className="flex items-center gap-3">
          <button onClick={fetchData} className="p-2 hover:opacity-70 transition">
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 hover:opacity-70 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="parchment-bg rounded-xl p-3 text-center border border-[var(--color-dourado)]/30">
          <p className="text-2xl font-bold text-green-700">{confirmados.length}</p>
          <p className="text-xs text-[var(--color-marrom)]">Confirmados</p>
        </div>
        <div className="parchment-bg rounded-xl p-3 text-center border border-[var(--color-dourado)]/30">
          <p className="text-2xl font-bold text-red-700">{recusados.length}</p>
          <p className="text-xs text-[var(--color-marrom)]">Recusados</p>
        </div>
        <div className="parchment-bg rounded-xl p-3 text-center border border-[var(--color-dourado)]/30">
          <p className="text-2xl font-bold text-[var(--color-dourado-dark)]">
            {totalPessoas}
          </p>
          <p className="text-xs text-[var(--color-marrom)]">Total pessoas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--color-dourado)]/30 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-bold transition border-b-2 ${
              activeTab === tab.key
                ? "border-[var(--color-dourado)] text-[var(--color-marrom-dark)]"
                : "border-transparent text-[var(--color-marrom)] opacity-60"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* TAB: CONVIDADOS */}
        {activeTab === "convidados" && (
          <div className="space-y-3">
            {guests.length === 0 && (
              <p className="text-center text-[var(--color-marrom)] opacity-60 py-8">
                Nenhum convidado ainda
              </p>
            )}
            {guests.map((guest) => (
              <div
                key={guest._id}
                className="parchment-bg rounded-xl p-4 border border-[var(--color-dourado)]/30 flex items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {guest.status === "confirmado" ? (
                      <UserCheck size={16} className="text-green-700 shrink-0" />
                    ) : (
                      <UserX size={16} className="text-red-700 shrink-0" />
                    )}
                    <span className="font-bold text-[var(--color-marrom-dark)] text-sm truncate">
                      {guest.nome}
                    </span>
                  </div>
                  {guest.acompanhantes.length > 0 && (
                    <p className="text-xs text-[var(--color-marrom)] ml-6">
                      +{guest.acompanhantes.length} acomp:{" "}
                      {guest.acompanhantes.join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-[var(--color-marrom)] opacity-50 ml-6 mt-1">
                    {formatDate(guest.criadoEm)}
                  </p>
                </div>
                <button
                  onClick={() => deleteGuest(guest._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB: RECADOS */}
        {activeTab === "recados" && (
          <div className="space-y-3">
            {messages.length === 0 && (
              <p className="text-center text-[var(--color-marrom)] opacity-60 py-8">
                Nenhum recado ainda
              </p>
            )}
            {messages.map((msg) => (
              <div
                key={msg._id}
                className="parchment-bg rounded-xl p-4 border border-[var(--color-dourado)]/30 flex items-start justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-[var(--color-marrom-dark)]">
                    {msg.autor}
                  </p>
                  <p className="text-sm text-[var(--color-marrom)] mt-1">
                    {msg.texto}
                  </p>
                  <p className="text-xs text-[var(--color-marrom)] opacity-50 mt-1">
                    {formatDate(msg.criadoEm)}
                  </p>
                </div>
                <button
                  onClick={() => deleteMessage(msg._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB: CONFIGURAÇÕES */}
        {activeTab === "configuracoes" && eventData && (
          <div className="space-y-4 max-w-lg">
            {(
              [
                ["nomeCrianca", "Nome da Criança"],
                ["tituloEvento", "Título do Evento"],
                ["data", "Data"],
                ["horario", "Horário"],
                ["nomeLocal", "Nome do Local"],
                ["endereco", "Endereço"],
                ["prazoConfirmacao", "Prazo para Confirmação"],
                ["mensagemTematica", "Título da Mensagem"],
              ] as [keyof EventData, string][]
            ).map(([field, label]) => (
              <div key={field}>
                <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={eventData[field]}
                  onChange={(e) => updateField(field, e.target.value)}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                Mensagem Temática (corpo)
              </label>
              <textarea
                value={eventData.subtituloMensagem}
                onChange={(e) =>
                  updateField("subtituloMensagem", e.target.value)
                }
                rows={3}
                className="resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                Texto da Seção de Recados
              </label>
              <input
                type="text"
                value={eventData.textoRecados}
                onChange={(e) => updateField("textoRecados", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--color-marrom)] mb-1">
                Embed Google Maps (URL)
              </label>
              <textarea
                value={eventData.embedMaps}
                onChange={(e) => updateField("embedMaps", e.target.value)}
                rows={2}
                className="resize-none text-xs"
              />
            </div>

            {saveMsg && (
              <p
                className={`text-sm font-medium ${
                  saveMsg.includes("Erro") ? "text-red-600" : "text-green-700"
                }`}
              >
                {saveMsg}
              </p>
            )}

            <button
              onClick={saveEvent}
              disabled={saving}
              className="btn-pirate w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
