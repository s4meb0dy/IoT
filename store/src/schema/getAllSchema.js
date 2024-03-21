const getAllSchema = {
  description: 'Get all processed_agent_data',
  tags: ['processed_agent_data'],
  response: {
    [200]: {
      description: 'Successful response',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
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
  },
}

export default getAllSchema
