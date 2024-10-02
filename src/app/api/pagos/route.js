import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Pagos from "@/models/Pagos";

export async function GET(req, { params }){
    try {
        connectDB()
        const AllPagos = await Pagos.find()
        return NextResponse.json(AllPagos)
        } catch (error) {
            return NextResponse.json({
                message: error.message,
            },
            {
                status:500,
            })
        }
}

export async function POST(req){
    try {
        const data = await req.json();
        const newPagos = new Pagos(data)
        const savePagos = newPagos.save()
        return NextResponse.json('El pago se ha creado correctamente')
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