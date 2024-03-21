const accelerometerSchema = {
  type: 'object',
  properties: {
    x: { type: 'string', format: 'int32' },
    y: { type: 'string', format: 'int32' },
    z: { type: 'string', format: 'int32' },
  },
  required: ['x', 'y', 'z'],
  additionalProperties: false,
}

export default accelerometerSchema
