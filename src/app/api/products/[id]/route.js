import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Product from "@/models/Product";

export async function GET(req, { params }){
    try {
        connectDB()
        const productsName = await Product.find({_id: params.id})
        return NextResponse.json(productsName)
        } catch (error) {
            return NextResponse.json({
                message: error.message,
            },
            {
                status:500,
            })
        }
}

export async function DELETE(req, { params }){
    const productDelete = await Product.findByIdAndDelete(params.id)
    return NextResponse.json('Producto Eliminado')
}

export async function PUT(req, {params}){
    const data = await req.json()
    const productUpdate = await Product.findByIdAndUpdate(params.id, data, {new: true})
    return NextResponse.json(productUpdate)
}