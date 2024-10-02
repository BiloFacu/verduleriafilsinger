import { Schema, model, models } from "mongoose";

const PagosSchema = new Schema({
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
    },
    fecha: { 
      type: Date, 
      default: function() {
        const currentDate = new Date();
        // Ajustamos la fecha a la zona horaria de Argentina (UTC-3)
        return new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
      } 
    }, // Fecha 
  });

export default models.Pagos || model('Pagos', PagosSchema);