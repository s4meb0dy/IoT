
const websocketSchema = {
  description: 'ws',
  tags: ['ws'],
  params: {
    type: 'object',
    properties: {
      user_id: { type: 'integer' },
    },
    required: ['user_id'],
    additionalProperties: false,
  },
}

export default websocketSchema
