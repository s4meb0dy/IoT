const deleteSchema = {
  description: 'Delete processed_agent_data',
  tags: ['processed_agent_data'],
  params: {
    type: 'object',
    properties: {
      processed_agent_data_id: { type: 'integer' },
    },
    required: ['processed_agent_data_id'],
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

export default deleteSchema
