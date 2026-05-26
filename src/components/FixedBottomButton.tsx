"use client";

import { useState, useEffect } from "react";
import { PartyPopper, CheckCircle, XCircle } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

interface RsvpData {
  status: "confirmado" | "recusado";
  nome: string;
}

const STORAGE_KEY = "convite_rsvp";

export default function FixedBottomButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRsvp(JSON.parse(saved));
      }
    } catch {
      // localStorage indisponível
    }
    setLoaded(true);
  }, []);

  const handleConfirmed = (status: "confirmado" | "recusado", nome: string) => {
    const data: RsvpData = { status, nome };
    setRsvp(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage indisponível
    }
  };

  if (!loaded) return null;

  if (rsvp) {
    return (
      <div className="fixed-bottom-bar">
        <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-bege)]">
          {rsvp.status === "confirmado" ? (
            <>
              <CheckCircle size={18} className="text-green-400" />
              <span>
                <strong>{rsvp.nome}</strong>, presença confirmada!
              </span>
            </>
          ) : (
            <>
              <XCircle size={18} className="text-red-400" />
              <span>
                <strong>{rsvp.nome}</strong>, resposta registrada.
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed-bottom-bar">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 text-base font-bold py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all shadow-lg"
        >
          <PartyPopper size={20} />
          Confirmar Presença
        </button>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirmed={handleConfirmed}
        initialStatus={null}
      />
    </>
  );
}
