import { Schema, model, models } from "mongoose";

const ClientSchema = new Schema({
    nombre: {
      type: String,
      required: true
    },
    celular: {
      type: Number,
      required: true
    },
    debe: {
      type: Number,
    }
  });

export default models.Client || model('Client', ClientSchema);