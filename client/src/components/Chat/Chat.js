import React,{useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';


let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    // this useEffect handles joining the chat room
    useEffect(()=>{ //location comes with react router as a prop
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);            
      
        setName(name);
        setRoom(room);

        socket.emit('join',{name, room}, ()=>{
            // this callback function runs right after the callback in the server gets called!            
        });

        
        return () => { //componentWillUnmount
            socket.emit('disconnect', ()=>{
                socket.off();
            })
        }

    },[ENDPOINT, location.search]);

    // this useEffect handles sending messages
    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message]);
        })
    }, [messages]);

    
    // function for sending messages
    const sendMessage = e => {

        e.preventDefault();

        if(message){        
            socket.emit('sendMessage', message, ()=>{
                setMessage('');
            })
        }
    }

    console.log(message, messages);
    

    return (
        <div className="outerContainer">                    
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
        </div>
    );
};

export default Chat;