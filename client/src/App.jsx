import Panel from "./components/panel.jsx"
import Hub from "./components/hub.jsx"
import {useSession} from "./hooks/session-context.js"

const App = () => {

    const {session} = useSession()

    return (
        <div className="border p-2 box-border w-screen h-screen flex justify-center items-center">
            {session.status == "disconnected" ? <Panel/>: <Hub/>}
        </div>
    )
}

export default App
