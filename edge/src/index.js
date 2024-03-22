import MQTT from 'async-mqtt'
import AJV from 'ajv'
import ajvFormats from 'ajv-formats'
import AgentMQTTAdapter from './adapters/agentMqttAdapter.js'
import HubMQTTAdapter from './adapters/hubMqttAdapter.js'
import agentDataSchema from './schema/agentDataSchema.js'
import dataProcessing from './usecase/dataProcessing.js'
import processAgentDataSchema from './schema/processAgentDataSchema.js'

const ajv = new AJV()
ajvFormats(ajv)

const app = async () => {
  const mqttClient = await MQTT.connectAsync(
    `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`
  )

  const agentAdapter = new AgentMQTTAdapter(mqttClient, process.env.AGENT_MQTT_TOPIC)
  const hubMQTTAdapter = new HubMQTTAdapter(mqttClient, process.env.HUB_MQTT_TOPIC)

  const onAgentData = async (topic, data) => {
    const agentData = JSON.parse(data.toString())
    if (!ajv.compile(agentDataSchema)(agentData)) {
      console.log("Agent data isn't valid")
      return
    }

    const road_state = dataProcessing(agentData)
    const dataProcessed = {...agentData, road_state}
    
    if (!ajv.compile(processAgentDataSchema)(dataProcessed)) {
      console.log("Data processed data isn't valid")
      return
    }
    await hubMQTTAdapter.sendData(JSON.stringify(dataProcessed))
  }

  await agentAdapter.start(onAgentData)

  function shutdown() {
    mqttClient.end()
    setTimeout(() => process.exit(1), 1000)
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

app()
