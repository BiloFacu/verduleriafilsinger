import { connectDB } from '@/utils/mongoose'
import { NextResponse } from 'next/server.js'
import Ventas from '@/models/Ventas.js'

export async function GET(){
    try {
        connectDB()
        const sells = await Ventas.find()
        return NextResponse.json(sells)
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
        const newSell = new Ventas(data)
        const saveSell = newSell.save()
        return NextResponse.json('La venta se ha realizado correctamente')
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