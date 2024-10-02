import { Schema, model, models } from "mongoose";

const PagoSchema = new Schema({
    nombre: {
      type: String,
      required: true
    },
    metododepago: {
      type: String,
      required: true
    },
    pago: {
      type: Number,
      required:true
    }
  });

export default models.Pago || model('Pago', PagoSchema);