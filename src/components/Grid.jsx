import React, { useState, useEffect } from 'react'; // Importa useState y useEffect desde 'react'
import mqtt from 'mqtt'; // Asegúrate de importar el paquete mqtt
import Square from './Square';

function Grid() {
  const [messageReceived, setMessageReceived] = useState(false);

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.48.245:8083'); // Conecta usando WebSocket

    client.on('connect', () => {
      console.log('Conectado al servidor MQTT');
      client.subscribe('map'); // Suscríbete al tema 'map'
    });

    client.on('message', (topic, message) => {
      if (!messageReceived) {
        const color = message.toString();
        console.log("Mensaje recibido: ", message.toString());
        setMessageReceived(true);
        client.unsubscribe('map'); // Desuscribirse del tema para no recibir más mensajes
        client.end(); // Terminar conexión
      }
    });

    // Manejar errores de conexión
    client.on('error', (error) => {
      console.error('Error de conexión:', error);
    });

    // Devolver una función de limpieza para desconectar el cliente MQTT cuando se desmonte el componente
    return () => {
      client.end();
    };
  }, []); // Se ejecuta solo una vez al montar el componente

  // Crear una matriz de 7x5
  const rows = 7;
  const cols = 5;
  const grid = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(<Square key={`${i}-${j}`} />);
    }
    grid.push(<div key={i} style={{ display: 'flex' }}>{row}</div>);
  }

  return <div>{grid}</div>;
}

export default Grid;
