'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Ventas() {
  const [selectedDate, setSelectedDate] = useState('');
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalProducts, setModalProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getVentas = async () => {
    const res = await fetch('/api/ventas');
    const data = await res.json();
    setProducts(data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)));
  };

  const getClients = async () => {
    const res = await fetch('/api/clients');
    const data = await res.json();
    setClients(data);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    const filtered = products.filter((product) =>
      new Date(product.fecha).toISOString().split('T')[0] === event.target.value
    );
    setFilteredProducts(filtered);
  };

  const openModal = (productDetails) => {
    setModalProducts(productDetails);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    getVentas();
    getClients();
  }, []);

  return (
    <div>
      <div className="flex items-center my-4 mx-auto">
        <Link href="/ventas/new">
          <button className="bg-green-500 text-white mx-4 px-4 py-2 rounded hover:bg-green-700">
            Nueva Venta
          </button>
        </Link>
        <div className="flex flex-col space-y-2">
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {(selectedDate ? filteredProducts : products)?.map((product) => (
            <tr key={product._id} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b border-gray-200 text-sm">
                {clients.find((client) => client._id === product.Idcliente)?.nombre || 'Desconocido'}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">
                {new Date(product.fecha).toISOString().split('T')[0]}
              </td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.detalleVenta.length}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">${product.precioTotal}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  onClick={() => openModal(product.detalleVenta)}
                >
                  Ver productos
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductModal isOpen={isModalOpen} onClose={closeModal} products={modalProducts} />
    </div>
  );
}

function ProductModal({ isOpen, onClose, products }) {
  const handlePrint = () => {
    const printContents = document.getElementById('receipt-content').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  // Obtener fecha y hora actuales para mostrar en el recibo
  const currentDateTime = new Date();
  const formattedDate = currentDateTime.toLocaleDateString('es-AR');
  const formattedTime = currentDateTime.toLocaleTimeString('es-AR');

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
        <div className="bg-white p-4 rounded-lg max-w-3xl w-full shadow-lg">
          {/* Botón de imprimir y cerrar en la parte superior */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2 print:hidden"
            >
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 print:hidden"
            >
              Cerrar
            </button>
          </div>

          {/* Contenido del modal con desplazamiento si es demasiado alto */}
          <div id="receipt-content" className="p-4 max-h-[70vh] overflow-auto">
            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">Verduleria EL BARRIO</h2>
              <p>Piñeiro Sorondo 180 - Allen - R.N</p>
              <p>Tel: 2984-590368</p>
            </div>

            {/* Fecha y hora de impresión */}
            <div className="text-sm text-right mb-4">
              <p><strong>{formattedDate} {formattedTime}</strong></p>
              <p></p>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="text-xs">
                  <th className="border px-2 py-1">Producto</th>
                  <th className="border px-2 py-1">Cantidad</th>
                  <th className="border px-2 py-1">Precio Unidad</th>
                  <th className="border px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="text-xs">
                    <td className="border px-2 py-1">{product.product}</td>
                    <td className="border px-2 py-1">{product.quantity}</td>
                    <td className="border px-2 py-1">${product.price}</td>
                    <td className="border px-2 py-1">${product.quantity * product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <strong>Total: </strong>
              ${products.reduce((total, product) => total + product.quantity * product.price, 0)}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
