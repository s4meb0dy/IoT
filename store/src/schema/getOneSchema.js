const getOneSchema = {
  description: 'Get one processed_agent_data',
  tags: ['processed_agent_data'],
  params: {
    type: 'object',
    properties: {
      processed_agent_data_id: { type: 'integer' },
    },
    additionalProperties: false,
    required: ['processed_agent_data_id'],
  },
  response: {
    [200]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
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
        },
       
      },
      
    },
  },
}

export default getOneSchema
