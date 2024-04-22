import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Square from './Square';

function Grid() {
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const client = mqtt.connect('ws://192.168.48.245:8083');

    client.on('connect', () => {
      console.log('Conectado al servidor MQTT');
      client.subscribe('map');
    });

    client.on('message', (topic, message) => {
      if (!mapData) {
        const mapString = message.toString();
        console.log("Mensaje recibido:", mapString);
        setMapData(mapString);
        client.unsubscribe('map');
        client.end();
      }
    });

    client.on('error', (error) => {
      console.error('Error de conexión:', error);
    });

    return () => {
      client.end();
    };
  }, []);

  const rows = 7;
  const cols = 5;
  const grid = [];
  const clavesMapa = [];

  if (mapData) {
    let index = 0;
    for (let i = 0; i < rows; i++) {
      const row = [];
      const rowMapa = [];
      for (let j = 0; j < cols; j++) {
        const id = mapData.substring(index, index + 2);
        row.push(<Square key={`${i}-${j}`} id={id} />);
        rowMapa.push(id);
        index += 2;
      }
      grid.push(<div key={i} style={{ display: 'flex' }}>{row}</div>);
      clavesMapa.push(rowMapa);
    }

    console.log(clavesMapa);
  }

  return <div>{grid}</div>;
}

export default Grid;
