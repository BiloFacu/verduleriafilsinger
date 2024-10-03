'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const SalesSection = () => {
  const router = useRouter()
  const [product, setProduct] = useState('');
  const [price, setPrice] = useState('')
  const [id, setId] = useState('')
  const [quantity, setQuantity] = useState('');
  const [sales, setSales] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [selectedClient, setSelectedClient] = useState(''); // Estado para cliente seleccionado
  const [paymentMethod, setPaymentMethod] = useState('');
  const [products, setProducts] = useState([])
  const [clients, setClients] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const calcularPrecioTotal = (precio, porcentaje) => {
    return precio + (precio * (porcentaje / 100));
 };


  const paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia', 'Cuenta Cliente']; // Métodos de pago

  // Manejar el cambio en el input de producto
  const handleProductChange = (e) => {
    const value = e.target.value;
    setProduct(value);
    // Filtrar los productos según lo que el usuario escribe
    if (value) {
      const filtered = products.filter((prod) =>
        prod.nombre.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // Manejar la selección del producto de la lista de sugerencias
  const handleProductSelect = (selectedProduct) => {
    const precioporcentaje = calcularPrecioTotal(selectedProduct.precio , selectedProduct.porcentaje)
    setProduct(selectedProduct.nombre);
    setPrice(precioporcentaje);
    setId(selectedProduct._id);
    setMaxQuantity(selectedProduct.cantidad)
    setFilteredProducts([]);
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    
    e.preventDefault();
    if (product && quantity) {
      const newSale = { productid:id , product, quantity: parseFloat(quantity), price: parseFloat(price), priceTotal: parseFloat(quantity)*parseFloat(price), cantidadTotal: parseFloat(maxQuantity) };
      setSales([...sales, newSale]);
      setProduct('');  // Limpiar el input de producto
      setQuantity(''); // Limpiar el input de cantidad
      setMaxQuantity(0);
    }
  };

  const handleFinishSale = () => {
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCompleteSale = async () => {
    if (!selectedClient) {
      alert('Por favor, selecciona un cliente.');
      return;
    }
    const cliente = clients.find(objeto => objeto._id === selectedClient);
    const nombreCliente = cliente.nombre
    if(!paymentMethod){
      alert('Por favor, selecciona un metodo de pago.');
      return;
    }
    try {
      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({detalleVenta:sales, precioTotal:totalPrice, Idcliente:selectedClient}),
      });
      if(response.ok){
        sales.map(async (product) => {
          try {
            const response = await fetch(`/api/products/${product.productid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ cantidad: product.cantidadTotal-product.quantity }),
            });
            if(paymentMethod === 'Cuenta Cliente'){
              const res = await fetch(`/api/clients/${selectedClient}`,{
                method: 'PUT',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ debe:totalPrice})
              })
            } else if(paymentMethod === 'Efectivo' || 'Tarjeta' || 'Transferencia'){
              const res = await fetch('/api/pagos', {
                method: 'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({nombre:nombreCliente, metododepago:paymentMethod, pago:totalPrice})
              })
            }
            if (response.ok) {
              const data = await response.json();
              setSuccessMessage(true)
              setTimeout(() => {
                setSuccessMessage(false);
                router.push('/ventas')
              }, 1800);
            } else {
              console.error(`Error al actualizar el producto ${product.nombre}:`, response.statusText);
            }
          } catch (error) {
            console.error(`Error en la petición para ${product.nombre}:`, error);
          }
        })
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
    setIsModalOpen(false); // Cerrar el modal
  };

  const totalPrice = sales.reduce((total, sale) => total + sale.priceTotal, 0);
  const totalQuantity = sales.reduce((total, sale) => total + sale.quantity, 0);

  const getProducts = async () => {
    const res = await fetch(`/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  const getClients = async () => {
    const res = await fetch(`/api/clients`);
    const data = await res.json();
    setClients(data);
  };
  
  useEffect(() => {
    getProducts();
    getClients();
  }, []);
  
  return (
    <div className="flex space-x-8 p-6">
      {/* Formulario en el lado izquierdo */}
      <form className="w-1/3 p-4 bg-gray-100 rounded" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Registrar Venta</h2>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-2" htmlFor="product">Producto</label>
          <input
            type="text"
            id="product"
            value={product}
            onChange={handleProductChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Mostrar lista de productos filtrados */}
          {filteredProducts.length > 0 && (
            <ul className="absolute left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto z-10">
              {filteredProducts.map((prod, index) =>{
                const precioTotal = calcularPrecioTotal(prod.precio, prod.porcentaje);
                return(
                <li
                  key={index}
                  className="p-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleProductSelect(prod)}
                >
                  {prod.nombre}  {precioTotal}
                </li>
              )})}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="quantity">Cantidad</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            max={maxQuantity}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {maxQuantity > 0 && (
            <p className="text-sm text-gray-600 mt-1">Máximo disponible: {maxQuantity}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Añadir Producto
        </button>
        <button
          type="submit"
          onClick={handleFinishSale}
          className="w-full bg-red-500 mt-4 text-white p-2 rounded hover:bg-red-600 transition duration-300"
        >
          Terminar Venta
        </button>
      </form>

      {/* Tabla de ventas en el lado derecho */}
      <div className="w-2/3">
        <h2 className="text-lg font-bold mb-4">Lista de Ventas</h2>
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Producto</th>
              <th className="py-2 px-4 border-b">Precio</th>
              <th className="py-2 px-4 border-b">Cantidad</th>
              <th className="py-2 px-4 border-b">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-center">{sale.product}</td>
                <td className="py-2 px-4 border-b text-center">{sale.price}</td>
                <td className="py-2 px-4 border-b text-center">{sale.quantity}</td>
                <td className="py-2 px-4 border-b text-center">{sale.quantity * sale.price}</td>
              </tr>
            ))}
            <tr>
                <th className="py-2 px-4 border-b">Total</th>
                <td></td>
                <td className="py-2 px-4 border-b text-center">{totalQuantity}</td>
                <td className="py-2 px-4 border-b text-center">{totalPrice}</td>
            </tr>
          </tbody>
        </table>
        {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Éxito!</strong>
          <span className="block sm:inline"> La venta ha sido realizada correctamente.</span>
        </div>
      )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <div className='flex justify-between items-center p-4'>
                <h3 className="text-lg font-bold mb-4">Finalizar Venta</h3>
                <button onClick={() => setIsModalOpen(false)}>X</button>
            </div>
            <div className="mb-4">
              <h4>A pagar: {totalPrice}</h4>
              <br></br>
              <label className="block text-sm font-medium mb-2" htmlFor="client">Cliente</label>
              <select
                id="client"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar Cliente</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>{client.nombre}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" htmlFor="paymentMethod">Método de Pago</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar Método de Pago</option>
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleCompleteSale}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300"
            >
              Completar Venta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesSection;
