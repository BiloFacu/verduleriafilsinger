'use client'
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Table(products){
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter()
  const calcularPrecioTotal = (precio, porcentaje) => {
     return precio + (precio * (porcentaje / 100));
  };
  const deleteProduct = async (id) =>{
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
      router.refresh()
    }

  const filteredProducts = products.products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
    return(
      <div>
      <div className="flex items-center my-4 mx-auto">
      <Link href='/new-products'>
        <button className="bg-green-500 text-white mx-4 px-4 py-2 rounded hover:bg-green-700">
          Nuevo Producto
        </button>
      </Link>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Precio Compra</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Porcentaje</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Precio Total</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Cantidad</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-200 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody>
        {filteredProducts.length > 0 ? (
            filteredProducts.map((product) =>{
              const precioTotal = calcularPrecioTotal(product.precio, product.porcentaje);
              return (<tr key={product._id} className="hover:bg-gray-100">
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.id}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.nombre}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">${product.precio}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.porcentaje}%</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">${precioTotal}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.cantidad}</td>
                <td className="px-6 py-4 border-b border-gray-200 text-sm">
                  <Link href={`/new-products/${product._id}`}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Editar</button>
                  </Link>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => {deleteProduct(product._id)}}>Eliminar</button>
                </td>
              </tr>)}
            )) : products.products.map((product) => {
              const precioTotal = calcularPrecioTotal(product.precio, product.porcentaje);
              return (
                <tr key={product._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.nombre}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">${product.precio.toFixed(2)}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.porcentaje}%</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">${precioTotal.toFixed(2)}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">{product.cantidad}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm">
                    <Link href={`/new-products/${product._id}`}>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">Editar</button>
                    </Link>
                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700" onClick={() => {deleteProduct(product._id)}}>Eliminar</button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
    )
}