
import {useEffect, useState, ReactElement } from 'react';
import {ChatMessage} from '../chat-message/chat-message';
import { getCookie, setCookie } from '../../utils/cookies';




export interface DataMessage{
  userName: string;
  text: string;
  timestamp: Date;
}

export interface ChatInfo{
[key:number] : string
}

export interface ChatMessages{
  [key:number] : DataMessage[]
}

export function Chat() {

  const [chatList, setChatList] = useState<string[]>([]);
  const [chatname, setChatname] = useState('');
  const [username, setUsername] = useState('');
  const [currentChat,setCurrentChat] = useState<ReactElement>();
  const [isAuth, setisAuth] = useState<'flex' | 'none'>('flex');
  const [isList,setisList] = useState<'block' | 'none'>('none');


  const getAllChat = async () => {
    await fetch(
        `http://localhost:3001/api/cache`,
        {
            method: 'GET',
        },
    ).then(async (response)=>{
        const _chats = await response.json();
        return _chats
    })
    .then((list)=> {
      if (list.length) {
        setChatList(list);
      }      
    })
    .catch((error)=> {
      console.log('что-то пошло не так',error)
    })
};

  const addChat = async (name:string) => {
      await fetch(
        `http://localhost:3001/api/cache`,
        {
            method: 'Post',
            body: JSON.stringify({ name: name}),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        },
      )
      .then( responce => {
        if(responce.ok) console.log('чат добавлен')
      })
      .catch((error)=> {
        console.log('что-то пошло не так',error)
      })

  }


  const createChat = () => {
    const isIt = chatList.findIndex((name) => name === chatname);
    if(chatname === ''){
      alert('Введите название чата');
    } else if(isIt !== -1){
        alert('Такой чат уже существует!')
      } else {
         setChatList([...chatList,chatname]);
         addChat(chatname);
    }
    setChatname('');
  }

  const openChat = (key:number)=> {
    setisList('none');
    setCurrentChat(
      <>
        <div onClick={backChatList}>Назад</div>
        <ChatMessage
            chatname = {chatList[key]}
            idChat = {key}
        />
      </>
     )
  }

  const backChatList = () => {
    setCurrentChat(<></>);
    setisList('block');
  }



  const join = ()=> {
    if(username !== ''){
    setisAuth('none');
    setisList('block');
    setCookie('user',username,1);
    } else {
      alert('Не забудьте ввести имя!');
    }
  }

  useEffect(()=> {
    const user = getCookie('user');
    if(user) {
      setUsername(user);
      setisAuth('none');
      setisList('block');
    }
    getAllChat()
  },[])


  return (
    <div>
    <p>Это Вы: <span>{username}</span></p>
      <div style={{display: isAuth}}>
          <div >

              <h1>Подключиться</h1>

              <input id="username" placeholder="Enter username" type="text"  value={username}
              onChange={(e) => setUsername(e.target.value)} />

              <button id="join-chat"  onClick={join}>
                  Подключиться
              </button>
          </div>
      </div>
      <div style={{display:isList}}>
        <div>
          <input id="chatname" placeholder="Enter chat name" type="text"  value={chatname}
              onChange={(e) => setChatname(e.target.value)} />
          <button onClick={createChat}>Добавить чат</button>
        </div>
        { chatList.map((name,index)=> {
          return (
            <div key={index+1}>
              <div>
                  {name.charAt(0).toUpperCase()}
              </div>
              <div onClick={()=>openChat(index)}>
                {name}
              </div>
            </div>
          )
        })
        }
      </div>
      {currentChat}
    </div>
  );
}

export default Chat;
