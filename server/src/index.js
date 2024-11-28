import {io} from "./socket.js"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

io.on("connection",(socket) => {
    console.log(`${socket.id} Has connected`)
    socket.on("disconnect", () => {
        console.log(`${socket.id} Has disconnected`)
    })
    socket.on("leave", (room) => {
        socket.leave(room)
        console.log(`${socket.id} Has left room ${room}`)
    })
    socket.on("create",async (data) => {
        const check = await prisma.room.findMany({where:{room:data.room}})
        console.log(check)
        if(check.length != 0){
            socket.emit("error","room already exists")
            return
        }
        await prisma.room.create({data:{room:data.room}})
        console.log(`${socket.id} Created a room`)
        socket.join(data.room)
        console.log(`${socket.id} Joined a room called ${data.room}`)
        socket.emit("joined")
        console.log(socket.rooms)
    })
    socket.on("join",async (data) => {
        const check = await prisma.room.findMany({where:{room:data.room}})
        console.log(check)
        if(check.length == 0){
            socket.emit("error","room doesn't exists")
            return
        }
        socket.join(data.room)
        console.log(`${socket.id} Joined a room called ${data.room}`)
        socket.emit("joined")
        console.log(socket.rooms)
    })
    socket.on("message",async (data) => {
        await prisma.message.create({data:{
            room: data.session.room,
            content: data.content,
            author: data.session.username,
            authorPfp: data.session.pfp
        }})
        io.to(data.session.room).emit("message",{
            author:data.session.username,
            authorPfp: data.session.pfp,
            content: data.content
        })
    })
    socket.on("fetch",async (data) => {
        const messages = await prisma.message.findMany({where:{room:data.room},take:20,orderBy:{date:"desc"},skip:data.count}) 
        socket.emit("oldMessages",messages)
    })
})
