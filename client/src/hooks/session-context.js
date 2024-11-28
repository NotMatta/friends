import {useContext,createContext} from "react"

const sessionContext = createContext()

const useSession = () => {
    return useContext(sessionContext)
}

export{
    sessionContext,
    useSession
}
