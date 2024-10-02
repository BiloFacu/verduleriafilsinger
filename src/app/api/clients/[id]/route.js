import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";

export async function GET(req, { params }){
    try {
        connectDB()
        const ClientName = await Clients.find({_id: params.id})
        return NextResponse.json(ClientName)
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
    const ClientDelete = await Clients.findByIdAndDelete(params.id)
    return NextResponse.json('Client Eliminado')
}

export async function PUT(req, { params }) {
    try {
      const data = await req.json();
      const client = await Clients.findById(params.id);
      if (!client) {
        return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });
      }
      if(data.opcionDebe){
        const ClientUpdate = await Clients.findByIdAndUpdate(
          params.id,
          { debe: data.debe },
          { new: true }
        );
        return NextResponse.json(ClientUpdate);
      }
      const nuevoDebe = client.debe + data.debe;
      const ClientUpdate = await Clients.findByIdAndUpdate(
        params.id,
        { debe: nuevoDebe },
        { new: true }
      );
      return NextResponse.json(ClientUpdate);
    } catch (error) {
      return NextResponse.json({ error: 'Error al actualizar el cliente' }, { status: 500 });
    }
  }
  