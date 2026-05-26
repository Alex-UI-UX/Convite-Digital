"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  dataEvento: string; // formato "DD/MM/YYYY"
  horario?: string;
}

interface TimeLeft {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function parseDate(data: string, horario?: string): Date {
  const [dia, mes, ano] = data.split("/").map(Number);
  let hora = 19,
    minuto = 0;
  if (horario) {
    const match = horario.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      hora = parseInt(match[1]);
      minuto = parseInt(match[2]);
    }
  }
  return new Date(ano, mes - 1, dia, hora, minuto, 0);
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) return null;

  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ dataEvento, horario }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [passed, setPassed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = parseDate(dataEvento, horario);

    const update = () => {
      const tl = calcTimeLeft(target);
      if (tl) {
        setTimeLeft(tl);
        setPassed(false);
      } else {
        setTimeLeft(null);
        setPassed(true);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [dataEvento, horario]);

  if (!mounted) return null;

  if (passed) {
    return (
      <section className="px-6 py-8 max-w-lg mx-auto w-full text-center">
        <p className="text-lg font-bold text-[var(--color-marrom-dark)]">
          🎉 A festa aconteceu! Obrigado por fazer parte!
        </p>
      </section>
    );
  }

  if (!timeLeft) return null;

  const blocks = [
    { value: timeLeft.dias, label: "dias" },
    { value: timeLeft.horas, label: "horas" },
    { value: timeLeft.minutos, label: "min" },
    { value: timeLeft.segundos, label: "seg" },
  ];

  return (
    <section className="px-6 py-8 max-w-lg mx-auto w-full text-center">
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-marrom-dark)] mb-4">
        Falta pouco para a festa!
      </h2>
      <div className="flex justify-center gap-3">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="parchment-bg rounded-xl p-3 min-w-[65px] border border-[var(--color-dourado)]/40"
          >
            <p className="text-2xl md:text-3xl font-bold text-[var(--color-dourado-dark)]">
              {String(block.value).padStart(2, "0")}
            </p>
            <p className="text-xs font-bold text-[var(--color-marrom)] uppercase">
              {block.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
