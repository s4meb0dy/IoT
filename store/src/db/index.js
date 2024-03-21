import { Sequelize } from 'sequelize'
import ProcessedAgentData from './model.js'

const db = ({ password, host, user, name, port }) => {
  const sequelize = new Sequelize(
    `postgres://${user}:${password}@${host}:${port}/${name}`
  )

  return {
    start: async () => {
      await sequelize.authenticate()
      sequelize.define('processed_agent_data', ProcessedAgentData)
      await sequelize.sync({ force: true })
      return sequelize.models.processed_agent_data
    },
    close: async () => {
      await sequelize.close()
    },
  }
}

export default db
