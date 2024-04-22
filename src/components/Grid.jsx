import Square from "./Square";
import mqtt from "mqtt";

// Componente principal que genera la matriz de cuadrados
const Grid = () => {

    const [messageReceived, setMessageReceived] = useState(false); // Estado para indicar si se ha recibido un mensaje

    useEffect(() => {
        const client = mqtt.connect({
          host: 'ws://192.168.0.100:8083', // Dirección IP del punto de acceso y puerto WebSocket
        });
    
        client.on('connect', () => {
          console.log('Conectado al servidor MQTT');
          client.subscribe('map'); // Suscribirse al tema 'map'
        });
    
        client.on('message', (topic, message) => {
          if (!messageReceived) {
            // Suponiendo que el mensaje contiene una cadena representando el color
            const color = message.toString();
            // Modificar el estado de los colores de los cuadrados
            setSquaresColor(squaresColor.map(() => color));
            // Establecer el estado de mensaje recibido a true
            setMessageReceived(true);
            // Desuscribirse del tema para no recibir más mensajes
            client.unsubscribe('map');
          }
        });
    
        return () => {
          client.end(); // Desconectar el cliente cuando el componente se desmonte
        };
    }, [messageReceived]); // Asegura que el efecto se ejecute solo cuando cambie messageReceived


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
};

export default Grid;