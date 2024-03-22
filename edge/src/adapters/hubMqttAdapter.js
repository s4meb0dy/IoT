import MQTT from 'async-mqtt'

class HubMQTTAdapter {
  constructor(client, topic) {
    this.client = client
    this.topic = topic
  }

  async sendData(data) {
    if(!this.client) throw new Error("Can't subscribe before connect")

    await this.client.publish(this.topic, data)
  }
}

export default HubMQTTAdapter