'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const NewProduct = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState(false);
  const [product, setProduct] = useState({
    nombre: '',
    precio: '',
    porcentaje: '',
    cantidad: '',
  });

  // Maneja el cambio de valor en los inputs
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product), // Convierte el objeto `product` a un JSON
      });
  
      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(true); // Muestra la alerta de éxito
  
        // Limpia el formulario
        setProduct({
          nombre: '',
          precio: '',
          porcentaje: '',
          cantidad: '',
        });
  
        // Redirige después de 3 segundos
        setTimeout(() => {
          setSuccessMessage(false);
        }, 3000);
      } else {
        console.error('Error al crear el producto:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

 

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h2>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline"> El producto ha sido creado correctamente.</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Input para el nombre */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={product.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el nombre del producto"
            required
          />
        </div>

        {/* Input para el precio compra */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
            Precio Compra
          </label>
          <input
            type="number"
            name="precio"
            id="precio"
            value={product.precio}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el precio de compra"
            required
          />
        </div>

        {/* Input para el porcentaje */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="porcentaje">
            Porcentaje
          </label>
          <input
            type="number"
            name="porcentaje"
            id="porcentaje"
            value={product.porcentaje}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el porcentaje de beneficio"
            required
          />
        </div>

        {/* Input para la cantidad */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad">
            Cantidad
          </label>
          <input
            type="number"
            name="cantidad"
            id="cantidad"
            value={product.cantidad}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa la cantidad"
            required
          />
        </div>

        {/* Botón para crear el producto */}
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="bg-blue-500 text-white mx-2 px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Crear Producto
          </button>
          <button
            type="button"
            onClick={() => router.push('/')} // Regresa a la página anterior
            className="bg-red-500 text-white mx-2 px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
