import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {SocketProvider} from "./hooks/socket-provider.jsx"
import SessionProvider from "./hooks/session-provider.jsx"
import './index.css'

createRoot(document.getElementById('root')).render(
    <SocketProvider>
        <SessionProvider>
            <App/>
        </SessionProvider>
    </SocketProvider>
)
