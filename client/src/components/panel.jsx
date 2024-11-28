import { useState, useEffect } from "react"
import {useSocket} from "../hooks/socket-context.js"
import {useSession} from "../hooks/session-context.js"

const Panel = () => {
    
    const socket = useSocket()
    const {session,setSession} = useSession()
    console.log(session)

    const [data,setData] = useState({
        username: "",
        pfp: "",
        room: ""
    })

    const Validate = () => {
        return data.username != "" && data.room != ""
    }

    const HandleCreateRoom = () => {
        if (!Validate()){
            alert("kys")
            return
        }
        setSession({
            username: data.username,
            pfp: data.pfp == "" ? "https://pbs.twimg.com/profile_images/1327836283272638464/tHGnbvWG_400x400.jpg": data.pfp,
            room: data.room,
            status: "disconnected"
        })
        socket.emit("create",{room:data.room})
    }
    const HandleJoinRoom = () => {
        if (!Validate()){
            alert("kys")
            return
        }
        setSession({
            username: data.username,
            pfp: data.pfp == "" ? "https://pbs.twimg.com/profile_images/1327836283272638464/tHGnbvWG_400x400.jpg": data.pfp,
            room: data.room,
            status: "disconnected"
        })
        socket.emit("join",{room:data.room})
    }

    useEffect(() => {
        socket?.off("error") 
        socket?.on("error",(data) => alert(data))
        socket?.off("joined")
        socket?.on("joined",() => {setSession({...session,status:"connected"})})
    },[socket,session,setSession])


    return(
        <div className="border w-full max-w-xl h-64 rounded-xl p-2 flex justify-center items-center gap-2">
            <img src={data.pfp == "" ? "https://pbs.twimg.com/profile_images/1327836283272638464/tHGnbvWG_400x400.jpg": data.pfp} onError={() => setData({...data,pfp:""})}
                className="rounded-full object-cover size-48"/>
            <div className="w-1/2 space-y-2">
                <input className="panel" placeholder="Username.." value={data.username} onChange={(e) => {setData({...data,username: e.target.value})}}/>
                <input className="panel" placeholder="Profile Picture URL.." value={data.pfp} onChange={(e) => {setData({...data,pfp: e.target.value})}}/>
                <input className="panel" placeholder="Room code.." value={data.room} onChange={(e) => {setData({...data,room: e.target.value})}}/>
                <div className="flex gap-2 w-full">
                    <button onClick={HandleCreateRoom} className="outlined">Create Room</button>
                    <button onClick={HandleJoinRoom} className="default">Join Room</button>
                </div>
            </div>
        </div>
    )
}

export default Panel
