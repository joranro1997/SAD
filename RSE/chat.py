# File: chat.py
#
# The simplest MQTT based chat.

import paho.mqtt.client as mqtt
from threading import Thread
import queue

THE_BROKER = "test.mosquitto.org"
THE_TOPIC = "Chat_Room_Test_UPV_RSE_PRACT_3"
name = input("Enter username: ")
CLIENT_ID = name

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "returned code: ", rc)
    print("Your user name is", name)
    client.publish(THE_TOPIC, 
                   payload="User " + name + " has joined the chat", 
                   qos=0, 
                   retain=False)

    client.subscribe(THE_TOPIC, qos=0)

# The callback for when a message is received from the server.
def on_message(client, userdata, msg):
    print("Received message: {}".format(str(msg.payload)))

inputQueue = queue.Queue()

def getNextInputLine():
    global inputQueue
    while True:
        inputLine = input()
        inputQueue.put(inputLine)

inputThread = Thread(target=getNextInputLine)

inputThread.start()

client = mqtt.Client(client_id=CLIENT_ID, 
                     clean_session=True, 
                     userdata=None, 
                     protocol=mqtt.MQTTv311, 
                     transport="tcp")

client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set(None, password=None)
client.connect(THE_BROKER, port=1883, keepalive=60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.

client.loop_start()

while True:

   try:
      inputLine = inputQueue.get_nowait()
      response = name + ": " + inputLine
      client.publish(THE_TOPIC, 
                     payload=response, 
                     qos=0, 
                     retain=False)

   except queue.Empty:
      pass # No new user input
                             
client.loop_stop()
