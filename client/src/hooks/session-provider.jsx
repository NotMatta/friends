import {useState} from "react"
import {sessionContext} from "./session-context.js"

const SessionProvider = ({children}) => {
    const [session,setSession] = useState({
        username:"",
        pfp: "",
        status: "disconnected",
        room: "",
    })

    return(
        <sessionContext.Provider value={{session,setSession}}>
            {children}
        </sessionContext.Provider>
    )
}

export default SessionProvider
