const parkingSchema = {
  type: 'object',
  properties: {
    longitude: { type: 'string', format: 'float' },
    latitude: { type: 'string', format: 'float' },
    empty_count: {
      type: 'string',
      format: 'int32',
    },
  },
  required: ['empty_count', 'longitude', 'latitude'],
  additionalProperties: false,
}

export default parkingSchema
