import './App.css';
import { io } from 'socket.io-client';
import React, { useState, useEffect } from 'react';
import {DivChat01, DivChat00} from './components/ui-components';

const socket = io('http://localhost:3030');

const username = prompt("Ingresa tu nombre de usuario:");
socket.emit("set_username", username);

function App() {
    const [isConnected, setIsConnected] = useState(false);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);

    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('chat_message', (data) => {
            setMensajes(mensajes => [...mensajes, data]);
        });

        return () => {
            socket.off('connect');
            socket.off('chat_message');
        }
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (nuevoMensaje) {
            const newMessage = {
                body: nuevoMensaje,
                from: "Me",
            };
            setMensajes(state => [...state, newMessage]);
            setNuevoMensaje("");
            socket.emit("chat_message", nuevoMensaje);
        }
    };

    return (
            <div className='chat'>
                <div className='header'> 
                    <h1>Bienvenido al Chat</h1>
                    <h2>Estatus: {isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
                </div>
                <div className='form'>
                    <input
                        type="text"
                        value={nuevoMensaje}
                        onChange={e => setNuevoMensaje(e.target.value)}
                        
                    />
                    <button onClick={handleSubmit}>Enviar</button>
                </div>
                {mensajes.map((mensaje, i) => (
                    <DivChat00 key={i}>
                    <DivChat01 key={i} isMe={mensaje.from === 'Me'}>
                        <p>{mensaje.from}: {mensaje.body}</p>
                    </DivChat01>
                    </DivChat00> 
                    ))}
            </div>
    );
}

export default App;

