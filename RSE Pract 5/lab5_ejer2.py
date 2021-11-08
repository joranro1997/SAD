import argparse
import base64
import json
import logging
import signal
import struct
import sys
import time

from telegram.ext import Updater
from telegram.ext import CommandHandler
from telegram.ext import MessageHandler, Filters

import paho.mqtt.client as mqtt
from datetime import datetime, timezone

r_valueTemp = "VOID"
r_valueLum = "VOID"
r_valueHum = "VOID"


def on_connect(client, userdata, flags, rc):
    print("Connected to ", client._host, "port: ", client._port)
    print("Flags: ", flags, "returned code: ", rc)

    client.subscribe("v3/+/devices/#", qos=0)


def on_message(client, userdata, msg):
    global r_valueTemp
    global r_valueLum
    global r_valueHum
    print("msg received with topic: {} and payload: {}".format(
        msg.topic, str(msg.payload)))

    if (msg.topic == "v3/lopys2ttn@ttn/devices/lopy4sense/up"):

        themsg = json.loads(msg.payload.decode("utf-8"))
        dpayload = themsg["uplink_message"]["decoded_payload"]

        print("@%s >> temp=%.3f hum=%.3f lux=%.3f" %
              (time.strftime("%H:%M:%S"), dpayload["temperature"],
               dpayload["humidity"], dpayload["lux"]))

        r_valueTemp = dpayload["temperature"]
        r_valueLum = dpayload["lux"]
        r_valueHum = dpayload["humidity"]


def start(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id,
                             text="I'm a bot, please talk to me!")


def getdataTemp(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id,
                             text=str(r_valueTemp))
                             
def getdataLum(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id,
                             text=str(r_valueLum))
                             
def getdataHum(update, context):
    context.bot.send_message(chat_id=update.effective_chat.id,
                             text=str(r_valueHum))


def unknown(bot, update):
    bot.send_message(chat_id=update.message.chat_id,
                     text="Sorry, I didn't understand that command.")


client = mqtt.Client()

client.on_connect = on_connect
client.on_message = on_message
client.username_pw_set(
    "lopys2ttn@ttn",
    password=
    "NNSXS.A55Z2P4YCHH2RQ7ONQVXFCX2IPMPJQLXAPKQSWQ.A5AB4GALMW623GZMJEWNIVRQSMRMZF4CHDBTTEQYRAOFKBH35G2A"
)
client.connect("eu1.cloud.thethings.network", port=1883, keepalive=60)
client.loop_start()


updater = Updater(token='2113074186:AAGgvkA5P1wDun0ovjdKQFGw0sOeqb7vtO8', use_context=True)
dispatcher = updater.dispatcher

start_handler = CommandHandler('start', start)
dispatcher.add_handler(start_handler)

getdata_handlerTemp = CommandHandler('gettemp', getdataTemp, pass_args=False)
dispatcher.add_handler(getdata_handlerTemp)

getdata_handlerLum = CommandHandler('getlum', getdataLum, pass_args=False)
dispatcher.add_handler(getdata_handlerLum)

getdata_handlerHum = CommandHandler('gethum', getdataHum, pass_args=False)
dispatcher.add_handler(getdata_handlerHum)

unknown_handler = MessageHandler(Filters.text & (~Filters.command), unknown)
dispatcher.add_handler(unknown_handler)

updater.start_polling()

updater.idle()
