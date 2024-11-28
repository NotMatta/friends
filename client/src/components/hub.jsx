import {useState,useEffect} from "react"
import {useSession} from "../hooks/session-context.js"
import {useSocket} from "../hooks/socket-context.js"
import {LogOut,Send,RotateCw} from "lucide-react"

const ToggleNav = () => {

    const [toggle,setToggle] = useState(false)
    const {session,setSession} = useSession()
    const socket = useSocket()

    const HandleLogout = () => {
        console.log(socket)
        socket.emit("leave",session.room)
        setSession({
            username: "",
            room: "",
            pfp: "",
            status: "disconnected"
        })
    }

    return(
        <div className="relative w-32 flex justify-end">
            <img src={session.pfp} className="size-10 rounded-full object-cover hover:scale-105 duration-300" onClick={() => setToggle(!toggle)}/>
            <div className={`absolute flex flex-col gap-1 w-32 top-14 rounded-xl p-2 bg-background border overflow-hidden duration-300 ${toggle? "" : "h-0 py-0 border-0"}`}>
                <p className="font-bold">{session.username}</p>
                <hr/>
                <div className="flex px-1 gap-1 text-sm items-center cursor-pointer" onClick={HandleLogout}><LogOut className="size-5"/> Logout</div>
            </div>
        </div>
    )
}

const Message = ({message}) => {
    const {session} = useSession()

    return (
        <div className={`flex gap-2 w-1/2 px-2 flex-shrink-0 ${message.author == session.username  ? "self-end flex-row-reverse" : ""}`}>
            <img className="rounded-full size-12 object-cover shrink-0" src={message.authorPfp}/> 
            <div className={`rounded-xl flex items-center p-3 w-full flex-wrap text-wrap ${message.author == session.username ? "bg-background border" : "bg-border "}`}>
                <p className="opacity-50 text-sm w-full">{message.author}</p>
                {message.content}
            </div>
        </div>
    ) 
}

const Hub = () => {

    const {session} = useSession()
    const socket = useSocket()
    const [render,setRender] = useState(true)
    const [scroll,setScroll] = useState(true)
    const [messages,setMessages] = useState([])
    const [content,setContent] = useState("")
    const [load,setLoad] = useState(false)
    const [hide,setHide] = useState(false)

    useEffect(() => {
        if(render){setRender(false)}
    },[render])

    useEffect(() => {
        if(!load){
            socket.emit("fetch",{
                count: messages.length,
                room: session.room
            })
            setLoad(true)
        }
    },[socket,messages,session,load])

    useEffect(() => {
        socket.off("message")
        socket.on("message",(data) => {
            const newMessages = messages
            newMessages.unshift(data)
            setMessages(newMessages)
            setRender(true)
        })
        socket.off("oldMessages")
        socket.on("oldMessages", (data) => {
            if(data.length < 20){
                setHide(true)
            }
            const newMessages = messages
            data.map((msg) => newMessages.push({
                author: msg.author,
                authorPfp: msg.authorPfp,
                content: msg.content
            }))
            setMessages(newMessages)
            setRender(true)
        })
    },[socket,setMessages,messages])

    const HandleSend = (e) => {
        e.preventDefault()
        socket.emit("message",{
            content,
            session
        })
        setContent("")
        setRender(true)
    }

    const HandleFetch = () => {
        socket.emit("fetch",{
            count: messages.length,
            room: session.room
        })
    }

    return(
        <div className="border-r border-l h-full w-full max-w-5xl flex flex-col items-center px-1 gap-2">
            <div className="border-b w-full h-14 flex items-center justify-between p-2">
                <p className="text-xl">Chat: {session.room}</p>
                <ToggleNav/>
            </div>
            <div className={`h-0 flex-grow w-full flex flex-col-reverse max-h-full gap-2 p-2  ${scroll ? "justify-self-end" : "justify-start"} overflow-y-scroll`}>
                {messages.map((msg,key) => <Message key={key} message={msg}/>)}
                {!hide && <div onClick={HandleFetch} className="bg-border self-center p-2 rounded-xl flex gap-1 items-center cursor-pointer"><RotateCw/> Load more messages</div>}
            </div>
            <form className="border rounded-xl h-16 w-full flex items-center overflow-hidden" onSubmit={HandleSend} >
                <input className="flex-grow p-2 h-full bg-background outline-none text-2xl" onBlur={() => setScroll(true)} required onFocus={() => setScroll(false)} placeholder="Type a message.." value={content} onChange={(e) => setContent(e.target.value)}/>
                <button type="submit" className="w-14 h-14 flex items-center justify-center bg-primary rounded-2xl text-background"><Send/></button>
            </form>
        </div>
    )
}

export default Hub
