import sys
import time
import base64

import json
import struct

import paho.mqtt.client as mqtt

THE_BROKER_UBI = "things.ubidots.com"
THE_BROKER_TTS = "eu1.cloud.thethings.network"
THE_TOPIC_UBI = "/v1.6/devices/pract4rse_jar"
THE_TOPIC_TTS = "v3/+/devices/#"
THE_VARIABLE = "ejer3_rse_jar"

def on_connectTTN(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "returned code: ", rc)

    client.subscribe(THE_TOPIC_TTS, qos=0)

def on_connectUBI(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "returned code: ", rc)

# The callback for when a message is received from the server.
def on_messageTTN(client, userdata, msg):
#    print("sisub: msg received with topic: {} and payload: {}".format(msg.topic, str(msg.payload)))
    print("sisub: msg received with topic: {} ".format(msg.topic))

    if (msg.topic == "v3/lopys2ttn@ttn/devices/lopy4sense/up"):

        themsg = json.loads(msg.payload.decode("utf-8"))
        dpayload = themsg["uplink_message"]["decoded_payload"]
#        print(dpayload)

        print("@%s >> temp=%.3f hum=%.3f lux=%.3f" % (time.strftime("%H:%M:%S"), dpayload["temperature"], dpayload["lux"], dpayload["humidity"]))



        clientUBI.publish(THE_TOPIC_UBI, 
                   payload='{"' + THE_VARIABLE + '":' + str(dpayload["temperature"]) +'}', 
                   qos=0, 
                   retain=False)



clientTTN = mqtt.Client()
clientUBI = mqtt.Client()

clientTTN.on_connect = on_connectTTN
clientTTN.on_message = on_messageTTN
clientUBI.on_connect = on_connectUBI

clientTTN.username_pw_set("lopys2ttn@ttn","NNSXS.A55Z2P4YCHH2RQ7ONQVXFCX2IPMPJQLXAPKQSWQ.A5AB4GALMW623GZMJEWNIVRQSMRMZF4CHDBTTEQYRAOFKBH35G2A")
clientTTN.connect(THE_BROKER_TTS, port=1883, keepalive=60)

clientUBI.username_pw_set("BBFF-T7n5rLZYuYcWqhZuiG5jW7kMKfBtmD", password=None)
clientUBI.connect(THE_BROKER_UBI, port=1883, keepalive=60)

clientTTN.loop_forever()

