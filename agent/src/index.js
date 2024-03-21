import MQTT from 'async-mqtt'
import FileDatasource from './file_datasource.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import accelerometerSchema from './schema/accelerometerSchema.js'
import gpsSchema from './schema/gpsSchema.js'
import aggregated_data from './domain/aggregated_data.js'
import aggregatedDataSchema from './schema/aggregatedDataSchema.js'
import parkingSchema from './schema/parkingSchema.js'

const ajv = new Ajv()
addFormats(ajv)

const stop = (ms) => new Promise((res) => setTimeout(res, ms))

async function connectToMqtt(broker, port) {
  const client = await MQTT.connectAsync(`mqtt://${broker}:${port}`)
  return client
}

let isStop = false
async function publish({
  client,
  mqttTopic,
  mqttTopicParking,
  datasource,
  delay,
}) {
  await datasource.startReading()
  const user_id = process.env.USER_ID

  while (!isStop) {

    const { accelerometer, gps, parking } = await datasource.read()
    
    if (
      !ajv.compile(accelerometerSchema)(accelerometer) ||
      !ajv.compile(gpsSchema)(gps) ||
      !ajv.compile(parkingSchema)(parking)
    ) {
      console.log("Accelerometer or gps or parking data isn't valid")
      continue
    }
   
    const aggregatedData = aggregated_data({ gps, accelerometer, user_id })
    if (!ajv.compile(aggregatedDataSchema)(aggregatedData)) {
      console.log("Aggregated data or gps data isn't valid")
      continue
    }
  
   
    await Promise.all([
      client.publish(mqttTopicParking, JSON.stringify(parking)),
      client.publish(mqttTopic, JSON.stringify(aggregatedData)),
    ])

    console.log('Data was send')
    await stop(delay)
  }
  return
}

async function run() {
  console.log('Run')
  try {
    const client = await connectToMqtt(
      process.env.MQTT_BROKER_HOST,
      process.env.MQTT_BROKER_PORT
    )

    const datasource = new FileDatasource(
      'data/accelerometer.csv',
      'data/gps.csv',
      'data/parking.csv'
    )

   
    publish({
      client,
      mqttTopic: process.env.MQTT_TOPIC,
      mqttTopicParking: process.env.MQTT_TOPIC_PARKING,
      datasource,
      delay: +process.env.DELAY,
    })

    function shutdown() {
      isStop = true
      datasource.stopReading()
      setTimeout(() => process.exit(1), 1000)
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)


  } catch (e) {
    console.log(e)
    process.exit(1)
  }
  
}

await run()

