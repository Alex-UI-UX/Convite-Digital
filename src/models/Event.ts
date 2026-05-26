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
        "https://maps.google.com/maps?q=Rua+Pereira+Barreto+416+Pradopolis+SP&t=&z=16&ie=UTF8&iwloc=&output=embed",
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
