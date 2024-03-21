const gpsSchema = {
  type: 'object',
  properties: {
    longitude: { type: 'string', format: 'float' },
    latitude: { type: 'string', format: 'float' },
  },
  required: ['longitude', 'latitude'],
  additionalProperties: false,
}

export default gpsSchema
