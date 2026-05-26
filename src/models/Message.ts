import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  autor: string;
  texto: string;
  criadoEm: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    autor: { type: String, required: true },
    texto: { type: String, required: true },
    criadoEm: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
