"use strict"

import MQTT from 'async-mqtt'
import processedSchema from './schema/processedSchema.js'
import aggregatedSchema from './schema/aggregatedSchema.js'
import AJV from 'ajv'
import ajvFormats from 'ajv-formats'
import redis from 'redis'

const ajv = new AJV()
ajvFormats(ajv)

async function connectToMqtt(broker, port) {
  const client = await MQTT.connectAsync(`mqtt://${broker}:${port}`)
  return client
}

async function connectToRedis(host, port) {
  const client = redis.createClient({
    socket: { host, port },
  })
  client.on('error', (err) => {
    console.log('Redis Client Error:', err)
    process.exit(1)
  })
  await client.connect()

  return client
}

async function sendData(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return await response.json()
}

function aggregate(data) {
  return {
    x: Number(data.accelerometer.x),
    y: Number(data.accelerometer.y),
    z: Number(data.accelerometer.z),
    longitude: Number(data.gps.longitude),
    latitude: Number(data.gps.latitude),
    user_id: Number(data.user_id),
    road_state: data.road_state,
    timestamp: data.timestamp,
  }
}

async function run() {
  console.log('Run')
  const storeUrl = `http://${process.env.STORE_API_HOST}:${process.env.STORE_API_PORT}/processed_agent_data`
  try {
   
    const mqttClient = await connectToMqtt(
      process.env.MQTT_BROKER_HOST,
      process.env.MQTT_BROKER_PORT
    )
    const redisClient = await connectToRedis(
      process.env.REDIS_HOST,
      process.env.REDIS_PORT
    )

    await mqttClient.subscribe(process.env.MQTT_TOPIC)
    mqttClient.on('message', async (topic, message) => {
      try {
        const data = JSON.parse(message.toString())
        const dataTopic = topic.toString()

      

        if (!ajv.compile(processedSchema)(data)) {
          console.log("Processed data isn't valid")
          return
        }

        const aggregatedData = aggregate(data)
        if (!ajv.compile(aggregatedSchema)(aggregatedData)) {
          console.log("Aggregated data isn't valid")
          return
        }

        if ((await redisClient.lLen(dataTopic)) >= Number(process.env.BATCH_SIZE)) {
          const pulledData = await redisClient.lRange(dataTopic, 0, -1)
          const agentData = pulledData.map((item) => JSON.parse(item))

          const response = await sendData(storeUrl, agentData)
          if (!response.success) {
            console.log('Sended data error', response)
          } else {
            console.log('Sended data to store', agentData)
          }

          await redisClient.del(dataTopic)
        }

        await redisClient.rPush(dataTopic, JSON.stringify(aggregatedData))
      } catch (e) {
        console.log(e)
      }
    })
  } catch (e) {
    console.log(e)
  }
}

run()
