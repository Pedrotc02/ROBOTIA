#!/usr/bin/env pybricks-micropython

from pybricks.hubs import EV3Brick
from pybricks.ev3devices import Motor, GyroSensor
from pybricks.robotics import DriveBase
from pybricks.parameters import Port, Direction, Stop

# Inicialización del robot y motores
ev3 = EV3Brick()
left_motor = Motor(Port.A)
right_motor = Motor(Port.D)
motor_pala = Motor(Port.B)
giroscopio = GyroSensor(Port.S1, Direction.COUNTERCLOCKWISE)
wheel_diameter = 56  # mm
axle_track = 114.5  # mm
robot = DriveBase(left_motor, right_motor, wheel_diameter, axle_track)
bloque_ancho = 28
bloque_alto = 28
angulo = 95
PALA_ARRIBA = 100
PALA_ABAJO = 0

def calcular_movimiento(inicio, fin,cont):
    # Calcular la diferencia en coordenadas entre el inicio y el fin
    diferencia_x = fin[0] - inicio[0]
    diferencia_y = fin[1] - inicio[1]
    if(cont%2==0):
    # Calcular el movimiento necesario en x e y en términos de bloques
        movimiento_x = diferencia_x * (bloque_ancho*10)
        movimiento_y = diferencia_y * (bloque_alto*10)-80
    else:
        movimiento_x = diferencia_x * (bloque_ancho*10) 
        movimiento_y = diferencia_y * (bloque_alto*10)
    return movimiento_x, movimiento_y

def callback (topic, msg):
    print("Mensaje recibido en el tópico {}: {}".format(topic, msg))

def subir_pala():
    motor_pala.run_target(500, PALA_ARRIBA, then = Stop.HOLD, wait = True)

def bajar_pala():
    motor_pala.run_target(500, PALA_ABAJO, then = Stop.HOLD, wait = True)

def move_to_destination(start, goals):
    current_location = start
    pos=0
    for goal in goals:
        movimiento_x, movimiento_y = calcular_movimiento(current_location, goal,pos)
        if(pos%2==0):
            subir_pala()   
        if(pos!=0):
            if(movimiento_x!=0):
                if(mov_y_ant>0):
                    if movimiento_x > 0:
                        robot.turn(angulo)
                    else:
                        robot.turn(-angulo)
                elif(mov_y_ant<0):
                    if movimiento_x > 0:
                        robot.turn(-angulo)
                    else:
                        robot.turn(angulo)
                else:
                    if((movimiento_x<0 and mov_x_ant>0)or(movimiento_x>0 and mov_x_ant<0)):
                        robot.turn(180)
                robot.straight(abs(movimiento_x))
            # Moviendo el robot hacia el objetivo
                if movimiento_y != 0:
                    if(movimiento_x < 0):
                        if movimiento_y > 0:
                            robot.turn(angulo)
                        else:
                            robot.turn(-angulo)
                    elif(movimiento_x > 0):
                        if movimiento_y > 0:
                            robot.turn(-angulo)
                        else:
                            robot.turn(angulo)
                    else:
                        if((movimiento_y<0 and mov_y_ant>0)or(movimiento_y>0 and mov_y_ant<0)):
                            robot.turn(180)
                    robot.straight(abs(movimiento_y))
            elif movimiento_y != 0:
                if movimiento_y > 0:
                    robot.turn(-angulo)
                else:
                    robot.turn(angulo)
                robot.straight(abs(movimiento_y))
        else:
            if movimiento_x != 0 and movimiento_y != 0:
                robot.straight(abs(movimiento_x))
                if movimiento_y > 0:
                    robot.turn(angulo)
                else:
                    robot.turn(-angulo)
                robot.straight(abs(movimiento_y))
            elif movimiento_y != 0:
                if movimiento_y > 0:
                    robot.turn(angulo)
                else:
                    robot.turn(-angulo)
                robot.straight(abs(movimiento_y))
            elif movimiento_x !=0 :
                robot.straight(movimiento_x)
        print("Moved to:", goal)
        current_location = goal
        print(movimiento_x,movimiento_y)
        pos+=1
        mov_y_ant=movimiento_y
        mov_x_ant=movimiento_x
        if(pos%2!=0):
            bajar_pala()
            if(pos==1):
                robot.straight(100)

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

# Coordenadas de punto de recogida y puntos de entrega
pickup = (6, 0)
dropoffs = [(5, 2), (0, 1),(3,0),(6,4)]  # Lista de puntos de entrega

print("Pickup location:", pickup)
print("Dropoff locations:", dropoffs)

# Conexion MQTT


# Moviendo el robot desde el punto de recogida hasta los puntos de entrega

left_motor.reset_angle(0)
right_motor.reset_angle(0)
giroscopio.reset_angle(0)
robot.settings(150, 250, 50, 50)

move_to_destination(pickup, dropoffs)
subir_pala()