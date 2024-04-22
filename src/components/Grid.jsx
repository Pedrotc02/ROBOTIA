import React, { useState, useEffect } from 'react'; // Importa useState y useEffect desde 'react'
import mqtt from 'mqtt'; // Asegúrate de importar el paquete mqtt

function MyComponent() {
  const [messageReceived, setMessageReceived] = useState(false);
  const [squaresColor, setSquaresColor] = useState([]); // Define squaresColor y setSquaresColor utilizando useState

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.48.245:8083'); // Conecta usando WebSocket

    client.on('connect', () => {
      console.log('Conectado al servidor MQTT');
      client.subscribe('map'); // Suscríbete al tema 'map'
    });

    client.on('message', (topic, message) => {
      if (!messageReceived) {
        const color = message.toString();
        setSquaresColor(Array(squaresColor.length).fill(color)); // Rellenar array con color recibido
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

  return (
    <div>
      {squaresColor.map((color, index) => (
        <div key={index} style={{ width: '50px', height: '50px', backgroundColor: color }} />
      ))}
    </div>
  );
}

export default MyComponent;
