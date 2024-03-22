
class AgentMQTTAdapter {
  constructor(client, topic) {
    this.client = client
    
    this.topic = topic
  }

  async #onMessage(callback) {
    if(!this.client) throw new Error("Can't subscribe before connect")
    await this.client.subscribe(this.topic)

    this.client.on('message', callback)
  }

  async start(callback) {
    await this.#onMessage(callback)
  }
}

export default AgentMQTTAdapter