import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import Square from './Square';
import Spinner from './Spinner';

function Grid() {
  const [mapData, setMapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [pickupPoint, setPickupPoint] = useState('{0,0}');
  const [deliveryPoint, setDeliveryPoint] = useState('{0,0}');
  const pickupOptions = ['{0,0}', '{0,1}', '{0,3}', '{3,0}', '{4,4}', '{5,0}', '{5,2}', '{6,0}', '{6,2}', '{6,4}'];
  const deliveryOptions = ['{0,0}', '{0,1}', '{0,3}', '{3,0}', '{4,4}', '{5,0}', '{5,2}', '{6,0}', '{6,2}', '{6,4}'];

  useEffect(() => {
    const mqttClient = mqtt.connect('ws://192.168.48.245:8083');

    mqttClient.on('connect', () => {
      console.log('Conectado al servidor MQTT');
      setClient(mqttClient);
      mqttClient.subscribe('map');
    });

    mqttClient.on('message', (topic, message) => {
      if (topic === 'map' && !mapData) {
        const mapString = message.toString();
        console.log("Mensaje recibido:", mapString);
        setMapData(mapString);
        setLoading(false);
        mqttClient.unsubscribe('map');
      }
    });

    mqttClient.on('error', (error) => {
      console.error('Error de conexión:', error);
    });

    return () => {
      mqttClient.end();
    };
  }, []);

  const handlePickupChange = (event) => {
    setPickupPoint(event.target.value);
  };

  const handleDeliveryChange = (event) => {
    setDeliveryPoint(event.target.value);
  };

  const handleSubmit = (event) => {
    console.log('Enviando Pedido: ', pickupPoint,  deliveryPoint);
    event.preventDefault();
    if (client) {
      const payload = {
        pickupPoint: pickupPoint,
        deliveryPoint: deliveryPoint
      };
      client.publish('EquipoO/pedido', JSON.stringify(payload));
    }
  };

  const rows = 7;
  const cols = 5;
  const grid = [];
  const clavesMapa = [];

  if (loading) {
    // Si está cargando, mostrar el mensaje de carga
    return <Spinner/>;
  }

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
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Punto de recogida: 
          <select value={pickupPoint} onChange={handlePickupChange}>
            {pickupOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          Punto de entrega: 
          <select value={deliveryPoint} onChange={handleDeliveryChange}>
            {deliveryOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </label>
        <button type="submit">Enviar</button>
      </form>
      {grid}
    </div>
  );
}

export default Grid;
