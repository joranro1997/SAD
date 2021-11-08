# File: sipub.py
#
# The simplest MQTT producer.

import random
import time
import json

import paho.mqtt.client as mqtt

THE_BROKER = "things.ubidots.com"
THE_TOPIC = "/v1.6/devices/pract4rse_jar"
CLIENT_ID = ""

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "returned code: ", rc)

# The callback for when a message is published.
def on_publish(client, userdata, mid):
    print("sipub: msg published (mid={})".format(mid))


client = mqtt.Client(client_id=CLIENT_ID, 
                     clean_session=True, 
                     userdata=None, 
                     protocol=mqtt.MQTTv311, 
                     transport="tcp")

client.on_connect = on_connect
client.on_publish = on_publish

client.username_pw_set("BBFF-T7n5rLZYuYcWqhZuiG5jW7kMKfBtmD", password=None)
client.connect(THE_BROKER, port=1883, keepalive=60)

client.loop_start()

while True:

    number = random.randint(0,100)
    jsonNumber = '{"rse_pract4_variable":' + str(number) +'}'
    client.publish(THE_TOPIC, 
                   payload=jsonNumber, 
                   qos=0, 
                   retain=False)

    time.sleep(5)

client.loop_stop()
