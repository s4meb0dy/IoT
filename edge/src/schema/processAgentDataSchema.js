const processAgentDataSchema = {
  type: 'object',
  properties: {
    accelerometer: {
      type: 'object',
      properties: {
        x: { type: 'string', format: 'int32' },
        y: { type: 'string', format: 'int32' },
        z: { type: 'string', format: 'int32' },
      },
      required: ['x', 'y', 'z'],
      additionalProperties: false,
    },
    gps: {
      type: 'object',
      properties: {
        longitude: { type: 'string', format: 'float' },
        latitude: { type: 'string', format: 'float' },
      },
      required: ['longitude', 'latitude'],
      additionalProperties: false,
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
    },
    user_id: {
      type: 'string',
      format: 'int32',
    },
    road_state: {
      type: 'string',
    },
  },
  required: ['gps', 'accelerometer', 'timestamp', 'user_id'],
  additionalProperties: false,
}

export default processAgentDataSchema
