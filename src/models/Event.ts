import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
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

const EventSchema = new Schema<IEvent>(
  {
    nomeCrianca: { type: String, required: true, default: "José Rodrigo" },
    tituloEvento: { type: String, required: true, default: "Aniversário do José Rodrigo" },
    data: { type: String, required: true, default: "13/07/2026" },
    horario: { type: String, required: true, default: "a partir das 19:00" },
    nomeLocal: { type: String, required: true, default: "Salão de Festas" },
    endereco: { type: String, required: true, default: "Rua Pereira Barreto, 416 - Centro, Pradópolis - SP" },
    embedMaps: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.123!2d-48.816!3d-21.364!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDIxJzUwLjQiUyA0OMKwNDgnNTcuNiJX!5e0!3m2!1spt-BR!2sbr!4v1",
    },
    mensagemTematica: {
      type: String,
      default: "MEU PRIMEIRO ANINHO!",
    },
    subtituloMensagem: {
      type: String,
      default:
        "Venha comemorar junto comigo nesta aventura para me tornar o rei dos piratas.\nVenha fazer parte da minha tripulação!",
    },
    textoRecados: {
      type: String,
      default: "Deixe aqui um recadinho! Prometo ler com muito carinho!",
    },
    prazoConfirmacao: {
      type: String,
      default: "28/06/2026 - 22:45",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
