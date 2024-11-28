import {useState,useEffect} from "react"
import {SocketContext} from "./socket-context.js"
import io from "socket.io-client"

const SocketProvider = ({children}) => {
    const [socket,setSocket] = useState()
    useEffect(() => {
        const newSocket= io.connect("http://localhost:8000")
        setSocket(newSocket)
        return () => newSocket.disconnect()
    },[])
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export {
    SocketProvider,
}
