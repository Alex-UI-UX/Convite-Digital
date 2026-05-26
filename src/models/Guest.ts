import mongoose, { Schema, Document } from "mongoose";

export interface IGuest extends Document {
  nome: string;
  status: "confirmado" | "recusado";
  acompanhantes: string[];
  criadoEm: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    nome: { type: String, required: true },
    status: { type: String, enum: ["confirmado", "recusado"], required: true },
    acompanhantes: { type: [String], default: [] },
    criadoEm: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);
