import { connectDB } from '@/utils/mongoose'
import { NextResponse } from 'next/server.js'
import Product from '@/models/Product'

export async function GET(){
    try {
        connectDB()
        const products = await Product.find()
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status:500,
            }
        )
    }
    
}

export async function POST(req){
    try {
        const data = await req.json();
        const newProduct = new Product(data)
        const saveProduct = newProduct.save()
        return NextResponse.json('El producto se ha creado correctamente')
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message: error.message,
        },
        {
            status:500,
        })
    }
}