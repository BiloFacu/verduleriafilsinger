import {connect, connection} from 'mongoose'

const conn = {
    isConnected: false
}

export async function connectDB(){
    if(conn.isConnected) return;
    const db = await connect('mongodb+srv://bflabsweb:facu2704@sblabs.nnnbpyh.mongodb.net/myorm')
    conn.isConnected = db.connections[0].readyState
}

connection.on('connected', () => {
    console.log('Mongoose is connected')
})

connection.on('error', (err) => {
    console.log('Mongoose connection error', err)
})