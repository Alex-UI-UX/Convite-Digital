import Image from "next/image";
import { MapPin, Calendar, Clock } from "lucide-react";
import FixedBottomButton from "@/components/FixedBottomButton";
import RecadosSection from "@/components/RecadosSection";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

const defaults = {
  nomeCrianca: "José Rodrigo",
  tituloEvento: "Aniversário do José Rodrigo",
  data: "13/07/2026",
  horario: "a partir das 19:00",
  nomeLocal: "Salão de Festas",
  endereco: "Rua Pereira Barreto, 416 - Centro, Pradópolis - SP",
  embedMaps:
    "https://maps.google.com/maps?q=Rua+Pereira+Barreto+416+Pradopolis+SP&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mensagemTematica: "MEU PRIMEIRO ANINHO!",
  subtituloMensagem:
    "Venha comemorar junto comigo nesta aventura para me tornar o rei dos piratas.\nVenha fazer parte da minha tripulação!",
  textoRecados: "Deixe aqui um recadinho! Prometo ler com muito carinho!",
  prazoConfirmacao: "28/06/2026 - 22:45",
};

export default async function Home() {
  let event = defaults;

  try {
    await connectDB();
    const dbEvent = await Event.findOne().lean();
    if (dbEvent) {
      event = { ...defaults, ...JSON.parse(JSON.stringify(dbEvent)) };
    }
  } catch (err) {
    console.error("Erro ao buscar evento do banco:", err);
  }

  return (
    <main className="flex flex-col min-h-screen pb-20">
      {/* HERO - Cartaz principal */}
      <section className="relative w-full">
        <Image
          src="/img/cartaz2.png"
          alt="Convite - 1 Ano do José Rodrigo"
          width={800}
          height={1200}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* WANTED banner */}
      <div className="w-full parchment-bg">
        <Image
          src="/img/wanted.png"
          alt="Wanted"
          width={1024}
          height={120}
          className="w-full h-auto"
        />
      </div>

      {/* INFO HERO */}
      <section className="parchment-bg flex flex-col items-center justify-center px-6 pt-4 pb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-[var(--color-marrom-dark)] leading-tight mb-2">
          {event.tituloEvento}
        </h1>

        <p className="text-base md:text-lg text-center text-[var(--color-marrom)] font-medium mb-2">
          Confirme sua presença e ajude o anfitrião a organizar a festa
        </p>

        <p className="text-sm text-center text-[var(--color-marrom)] opacity-70">
          Prazo para confirmações até {event.prazoConfirmacao}
        </p>
      </section>

      {/* DIVISOR */}
      <div className="w-full bg-[var(--color-bege-light)]">
        <Image
          src="/img/divisor.png"
          alt="Divisor decorativo"
          width={1024}
          height={60}
          className="w-full h-auto"
        />
      </div>

      {/* DATA E LOCAL */}
      <section id="local" className="px-6 py-8 max-w-lg mx-auto w-full text-center">
        <div className="parchment-bg rounded-2xl p-6 border-2 border-[var(--color-dourado)]/40 space-y-4">
          <div className="flex items-center justify-center gap-2 text-[var(--color-marrom-dark)]">
            <Calendar size={22} className="text-[var(--color-dourado)]" />
            <span className="text-lg font-bold">{event.data}</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-[var(--color-marrom-dark)]">
            <Clock size={22} className="text-[var(--color-dourado)]" />
            <span className="text-lg">{event.horario}</span>
          </div>

          <div className="w-16 h-px bg-[var(--color-dourado)] mx-auto opacity-50" />

          <div className="flex flex-col items-center gap-1">
            <MapPin size={22} className="text-[var(--color-dourado)]" />
            <span className="text-lg font-bold text-[var(--color-marrom-dark)]">
              {event.nomeLocal}
            </span>
            <span className="text-sm text-[var(--color-marrom)]">
              {event.endereco}
            </span>
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="px-6 pb-8 max-w-lg mx-auto w-full">
        <div className="rounded-2xl overflow-hidden border-2 border-[var(--color-dourado)]/40">
          <iframe
            src={event.embedMaps}
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização do evento"
          />
        </div>
      </section>

      {/* DIVISOR */}
      <div className="w-full">
        <Image
          src="/img/divisor.png"
          alt="Divisor decorativo"
          width={1024}
          height={60}
          className="w-full h-auto"
        />
      </div>

      {/* MENSAGEM TEMÁTICA */}
      <section id="mensagem" className="px-6 py-8 max-w-lg mx-auto w-full text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-marrom-dark)] mb-4">
          {event.mensagemTematica}
        </h2>
        <div className="text-[var(--color-marrom)] text-base md:text-lg leading-relaxed whitespace-pre-line">
          {event.subtituloMensagem}
        </div>
      </section>

      {/* DIVISOR */}
      <div className="w-full">
        <Image
          src="/img/divisor.png"
          alt="Divisor decorativo"
          width={1024}
          height={60}
          className="w-full h-auto"
        />
      </div>

      {/* RECADOS */}
      <RecadosSection textoRecados={event.textoRecados} />

      {/* CRÉDITO */}
      <p className="text-center text-[10px] text-[var(--color-marrom)] opacity-30 py-4">
        Sistema de Convite Desenvolvido por Alex Rodrigo
      </p>

      {/* Espaço para o botão fixo */}
      <div className="h-20" />

      {/* BOTÃO FIXO INFERIOR */}
      <FixedBottomButton />
    </main>
  );
}
