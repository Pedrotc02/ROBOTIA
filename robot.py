from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor
from pybricks.robotics import DriveBase
from pybricks.parameters import Port

import tkinter as tk
import paho.mqtt.client as mqtt

mqtt_server = "192.168.48.245"
mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

# Inicialización del robot y motores
ev3 = EV3Brick()
left_motor = Motor(Port.A)
right_motor = Motor(Port.D)
wheel_diameter = 56  # mm
axle_track = 114.5  # mm
robot = DriveBase(left_motor, right_motor, wheel_diameter, axle_track)
bloque_ancho = 28
bloque_alto = 28

def calcular_movimiento(inicio, fin):
    # Calcular la diferencia en coordenadas entre el inicio y el fin
    diferencia_x = fin[0] - inicio[0]
    diferencia_y = fin[1] - inicio[1]
    
    # Calcular el movimiento necesario en x e y en términos de bloques
    movimiento_x = diferencia_x * (bloque_ancho*10)
    movimiento_y = diferencia_y * (bloque_alto*10)
    
    return movimiento_x, movimiento_y

def move_to_destination(start, goal):
    movimiento_x, movimiento_y = calcular_movimiento(start, goal)
    
    # Moviendo el robot hacia el objetivo
    if movimiento_x != 0 and movimiento_y != 0:
        robot.straight(movimiento_x)
        if movimiento_y > 0:
            robot.turn(100)
        else:
            robot.turn(-100)
        robot.straight(abs(movimiento_y))
    elif movimiento_y != 0:
        if movimiento_y > 0:
            robot.turn(100)
        else:
            robot.turn(-100)
        robot.straight(abs(movimiento_y))
    elif movimiento_x !=0 :
        robot.straight(movimiento_x)

    print("Moved to:", goal)

# Mapa
mapa = [
    ["02", "02", "00", "01", "05"],
    ["03", "07", "05", "00", "01"],
    ["00", "04", "11", "09", "06"],
    ["01", "10", "03", "10", "00"],
    ["00", "02", "00", "08", "01"],
    ["01", "10", "01", "10", "00"],
    ["01", "06", "01", "07", "01"]
]

# Coordenadas de punto de recogida y punto de entrega
pickup = (0, 6)
dropoff = (3, 2)

print("Pickup location:", pickup)
print("Dropoff location:", dropoff)

# Moviendo el robot desde el punto de recogida hasta el punto de entrega
move_to_destination(pickup, dropoff)

def on_connect(client, userdata, flags, rc):
    print("Conectado al servidor MQTT con código de resultado " + str(rc))
    mqtt_client.subscribe("EquipoO/pedido") 

def on_message(client, userdata, msg):
    # Convertir el mensaje recibido a una cadena y luego dividirlo en filas
    payload = json.loads(msg.payload)
    pickupPoint = payload.get("pickupPoint")
    deliveryPoint = payload.get("deliveryPoint")
    
    # Procesar el pedido recibido
    print("Pedido recibido - Punto de recogida:", pickupPoint, "- Punto de entrega:", deliveryPoint)
    move_to_destination(pickup, dropoff)
   

mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(mqtt_server, 8003, 60)