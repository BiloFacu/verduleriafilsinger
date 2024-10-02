'use client';

import React, { useState, useEffect } from 'react';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);

  // Obtener los pagos desde la API
  const getPagos = async () => {
    try {
      const res = await fetch('/api/pagos');
      const data = await res.json();
      setPagos(data);
    } catch (error) {
      console.error('Error fetching pagos:', error);
    }
  };

  useEffect(() => {
    getPagos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Listado de Pagos</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Método de Pago
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">
              Pago
            </th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{pago.nombre}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">{pago.metododepago}</td>
              <td className="px-6 py-4 border-b border-gray-200 text-sm">${pago.pago}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
