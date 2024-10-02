import { connectDB } from "@/utils/mongoose"
import Product from "@/models/Product"
import Link from "next/link"
import Table from "@/components/Table"

async function loadProduct(){
  connectDB()
  const result = await Product.find()
  return result
}


export default async function HomePage(){
  const products = await loadProduct()
  const transformedProducts = products.map((product, index) => ({
    ...product.toObject(), // Convierte el documento de Mongoose a un objeto plano
    _id: product._id.toString(),
    id: index,
  }));
  return(
      <Table products={transformedProducts}/>
  )
}