import { DataTypes } from 'sequelize'

const ProcessedAgentData = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  road_state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  x: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  y: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  z: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}

export default ProcessedAgentData
