import mongoose, { model, models } from 'mongoose';

// Definición del esquema para productos
const productDetailSchema = new mongoose.Schema({
  productid: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

// Definición del esquema para ventas
const ventaSchema = new mongoose.Schema({
  detalleVenta: [productDetailSchema], // Arreglo de productos
  precioTotal: { type: Number, required: true },
  Idcliente: { type: String, required: true },
  fecha: { 
    type: Date, 
    default: function() {
      const currentDate = new Date();
      // Ajustamos la fecha a la zona horaria de Argentina (UTC-3)
      return new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
    } 
  }, // Fecha de la venta ajustada a la zona horaria de Argentina
});

export default models.Venta || model('Venta', ventaSchema);
