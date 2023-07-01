import { useEffect, useRef, useState } from 'react';
import { DataMessage} from '../chat/chat';
import io,{Socket} from 'socket.io-client';
import { getCookie } from '../../utils/cookies';

/* eslint-disable-next-line */
export interface ChatMessageProps {
  chatname:string,
  idChat:number
}

export interface ChatMessages{
  [key:number] : DataMessage[]
}

export function ChatMessage(props: ChatMessageProps) {

  const {chatname,idChat} = props;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DataMessage[]>([]);
  const [socket,setSocket] = useState<Socket>();

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const username = getCookie('user') || '';

  const scrollToBottom = () => {
    if (messagesEndRef.current) { messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }) }
  }

  useEffect(()=>{
    const newSocket = io('http://localhost:8001',{
      query: {
        chatId: idChat,
      },
      transportOptions: {
        polling: {
        },
      },
    });
    setSocket(newSocket);
  },[setSocket]);

  const send = (text:string)=> {
    const value:DataMessage = {
      userName: username,
      text: text,
      timestamp: new Date()
    };
    socket?.emit('message',chatname,value,idChat.toString());
  }

  socket?.on('historical_messages', (messages:DataMessage[])=> {
      setMessages(messages);
      scrollToBottom();
  })

  const messageListener = (chatname:string ,message:DataMessage,idChat: string)=> {
    setMessages([...messages,message]);
  }

  useEffect(()=>{
   socket?.on('message',messageListener);
    scrollToBottom();
    return () => {socket?.off('message',messageListener)}
  },[messageListener]);


  return (
    <div>
      <h1>{chatname}!</h1>
      <hr />
      <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={()=> {send(input); setInput('')}}>Отправить</button>
      </div>
      <hr />
        <div id='messages'>
        {messages !== null ?
           ( messages.map((mes:DataMessage, index:number) => {
           let formattedTimestamp;
           if (new Date().toLocaleDateString() === new Date(mes.timestamp).toLocaleDateString()) {
               formattedTimestamp = new Date(mes.timestamp).toLocaleTimeString();
           } else {
               formattedTimestamp = new Date(mes.timestamp).toLocaleString();
           }
          return (
            <div key={index}>
            <div >
              <div>
                  {mes.userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div>
                <div>
                  {mes.userName.charAt(0).toUpperCase() + mes.userName.slice(1)}
                </div>
                <div>
                  {formattedTimestamp}
                </div>
              </div>
              <div>
                  {mes.text}
              </div>
            </div>
            <div ref={messagesEndRef}></div>
         </div>
        )})
           )
      : <></>}

      </div>
    </div>
  );
}

export default ChatMessage;
