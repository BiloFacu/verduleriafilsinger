'use client'
import { useState, useEffect } from 'react';

const ClientsSection = () => {
  const [nombre, setNombre] = useState('');
  const [celular, setCelular] = useState('');
  const [clients, setClients] = useState([]);
  const [data, setData] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); // Cliente seleccionado para pago
  const [isModalOpen, setIsModalOpen] = useState(false); // Controla la visibilidad del modal
  const [pago, setPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({nombre, celular}),
      });
      if (response.ok) {
        const data = await response.json();
        setNombre(''); 
        setCelular('');
        setData(response);
      } else {
        console.error('Error al crear el cliente:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  const getClients = async () => {
    const res = await fetch(`/api/clients`);
    const data = await res.json();
    setClients(data);
  };

  const deleteClient = async (id) => {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    setData(response);
  };

  const openModal = (client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };

  const handlePagoSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/clients/${selectedClient._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({debe:selectedClient.debe-pago}), // Convierte el objeto `product` a un JSON
    });
    setData(response)
    closeModal();
  };

  useEffect(() => {
    getClients();
  }, [data]);

  return (
    <div className="flex space-x-8 p-6">
      <form className="w-1/3 p-4 bg-gray-100 rounded" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Agregar Cliente</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Guardar
        </button>
      </form>

      <div className="w-2/3">
        <h2 className="text-lg font-bold mb-4">Lista de Clientes</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Teléfono</th>
              <th className="py-2 px-4 border-b">Debe</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client._id}>
                <td className="py-2 px-4 border-b text-center">{client.nombre}</td>
                <td className="py-2 px-4 border-b text-center">{client.celular}</td>
                <td className="py-2 px-4 border-b text-center">{client.debe}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    className="bg-green-500 text-white mx-2 px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                    onClick={() => openModal(client)}
                  >
                    Pagar
                  </button>
                  <button
                    className="bg-red-500 text-white mx-2 px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => deleteClient(client._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Realizar Pago</h2>
            {selectedClient && (
              <>
                <p><strong>Nombre:</strong> {selectedClient.nombre}</p>
                <p><strong>Teléfono:</strong> {selectedClient.celular}</p>
                <p><strong>Debe:</strong> {selectedClient.debe}</p>
                <form onSubmit={handlePagoSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Monto a pagar</label>
                    <input
                      type="number"
                      value={pago}
                      onChange={(e) => setPago(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      max={selectedClient.debe}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Método de pago</label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta">Tarjeta</option>
                      <option value="transferencia">Transferencia</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Confirmar Pago
                  </button>
                </form>
              </>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsSection;
