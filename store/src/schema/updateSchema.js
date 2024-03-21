const updateSchema = {
  description: 'Update processed_agent_data',
  tags: ['processed_agent_data'],
  params: {
    type: 'object',
    properties: {
      processed_agent_data_id: { type: 'integer' },
    },
    required: ['processed_agent_data_id'],
  },
  body: {
    type: 'object',
    properties: {
      road_state: { type: 'string' },
      user_id: { type: 'number' },
      x: { type: 'integer' },
      y: { type: 'integer' },
      z: { type: 'integer' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: [
      'road_state',
      'x',
      'y',
      'z',
      'latitude',
      'longitude',
      'user_id',
      'timestamp',
    ],
    additionalProperties: false,
  },
  response: {
    [200]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
      
    },
  },
}

export default updateSchema
