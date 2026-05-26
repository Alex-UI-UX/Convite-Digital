"use client";

import { useState, useEffect } from "react";
import { PartyPopper, CheckCircle, XCircle, X } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

interface RsvpData {
  status: "confirmado" | "recusado";
  nome: string;
  expiresAt: number;
}

interface FixedBottomButtonProps {
  prazoConfirmacao?: string; // formato "DD/MM/YYYY - HH:MM"
}

const STORAGE_KEY = "convite_rsvp";
const EXPIRY_DAYS = 90;

function parsePrazo(prazo: string): Date | null {
  // formato: "DD/MM/YYYY - HH:MM"
  const match = prazo.match(/(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2}):(\d{2})/);
  if (!match) return null;
  const [, dia, mes, ano, hora, minuto] = match;
  return new Date(
    parseInt(ano),
    parseInt(mes) - 1,
    parseInt(dia),
    parseInt(hora),
    parseInt(minuto)
  );
}

export default function FixedBottomButton({ prazoConfirmacao }: FixedBottomButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [expiredModal, setExpiredModal] = useState(false);
  const [rsvp, setRsvp] = useState<RsvpData | null>(null);
  const [loaded, setLoaded] = useState(false);

  const prazoExpirado = (() => {
    if (!prazoConfirmacao) return false;
    const prazoDate = parsePrazo(prazoConfirmacao);
    if (!prazoDate) return false;
    return Date.now() > prazoDate.getTime();
  })();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: RsvpData = JSON.parse(saved);
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          setRsvp(parsed);
        }
      }
    } catch {
      // localStorage indisponível
    }
    setLoaded(true);
  }, []);

  const handleConfirmed = (status: "confirmado" | "recusado", nome: string) => {
    const expiresAt = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    const data: RsvpData = { status, nome, expiresAt };
    setRsvp(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage indisponível
    }
  };

  const handleButtonClick = () => {
    if (prazoExpirado) {
      setExpiredModal(true);
    } else {
      setModalOpen(true);
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
          onClick={handleButtonClick}
          className="w-full flex items-center justify-center gap-2 text-base font-bold py-3 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all shadow-lg"
        >
          <PartyPopper size={20} />
          Confirmar Presença
        </button>
      </div>

      {/* Modal prazo expirado */}
      {expiredModal && (
        <div className="modal-overlay" onClick={() => setExpiredModal(false)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end">
              <button onClick={() => setExpiredModal(false)} className="p-1 hover:opacity-70 transition">
                <X size={24} className="text-[var(--color-marrom)]" />
              </button>
            </div>
            <div className="text-center py-6">
              <div className="text-6xl mb-4">😢</div>
              <h2 className="text-xl font-bold text-[var(--color-marrom-dark)] mb-2">
                Prazo encerrado
              </h2>
              <p className="text-[var(--color-marrom)]">
                O prazo para confirmação de presença expirou.
              </p>
              {prazoConfirmacao && (
                <p className="text-sm text-[var(--color-marrom)] opacity-60 mt-2">
                  O prazo era até {prazoConfirmacao}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirmed={handleConfirmed}
        initialStatus={null}
      />
    </>
  );
}
