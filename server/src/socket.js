import express from "express"
import http from "http"
import cors from "cors"
import { Server } from "socket.io"

const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server , {
    cors:{
        origin: "http://localhost:5173"
    }
})

server.listen(8000,() => {
    console.log("Server is YeeYeeing")
})

export {
    io
}
