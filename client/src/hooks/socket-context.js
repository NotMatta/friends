import {createContext,useContext} from "react"
const SocketContext = createContext()

const useSocket = () => {
    return useContext(SocketContext).socket
}

export {
    SocketContext,
    useSocket
}
