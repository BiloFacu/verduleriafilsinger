import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    },
    porcentaje: {
      type: Number,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  });

export default models.Product || model('Product', ProductSchema);