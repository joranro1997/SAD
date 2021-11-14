from influxdb import InfluxDBClient

client = InfluxDBClient(host='localhost', port=8086)
client.switch_database('telegraf')

results = client.query('select * from TTN WHERE time > now() - 15m')

points=results.get_points()

print('Temperature and humidity measurements taken in the last 15m')
for item in points:  
	if (item['uplink_message_decoded_payload_temperature'] != None):
		print(item['time'], " -> Temperature:  ", item['uplink_message_decoded_payload_temperature'], " | Humidity:  ", item['uplink_message_decoded_payload_humidity'])
