const aggregatedSchema = {
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
}

export default aggregatedSchema
