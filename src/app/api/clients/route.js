import { connectDB } from '@/utils/mongoose'
import { NextResponse } from 'next/server.js'
import Clients from '@/models/Clients'

export async function GET(){
    try {
        connectDB()
        const Client = await Clients.find()
        return NextResponse.json(Client)
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
        const newClient = new Clients(data)
        const saveClient = newClient.save()
        return NextResponse.json('El cliente se ha creado correctamente')
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