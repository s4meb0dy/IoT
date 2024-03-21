import fastify from 'fastify'
import db from './db/index.js'
import ajvFormats from 'ajv-formats'
import swagger from '@fastify/swagger'
import cors from '@fastify/cors'

import swaggerUi from '@fastify/swagger-ui'
import websocket from '@fastify/websocket'
import createSchema from './schema/createSchema.js'
import deleteSchema from './schema/deleteSchema.js'
import updateSchema from './schema/updateSchema.js'
import getAllSchema from './schema/getAllSchema.js'
import getOneSchema from './schema/getOneSchema.js'
import websocketSchema from './schema/websocketSchema.js'

const postgresPassword = process.env.POSTGRES_PASSWORD || 'pass'
const postgresHost = process.env.POSTGRES_HOST || 'postgres_db'
const postgresUser = process.env.POSTGRES_USER || 'user'
const postgresName = process.env.POSTGRES_DB || 'test_db'
const postgresPort = process.env.POSTGRES_PORT || '5432'

const httpPort = process.env.HTTP_PORT || 8000
const httpHost = process.env.HTTP_HOST || '0.0.0.0'

const start = async () => {
  try {
    const postgres = db({
      password: postgresPassword,
      host: postgresHost,
      user: postgresUser,
      name: postgresName,
      port: postgresPort,
    })

    const dbModel = await postgres.start()

    const server = fastify({
      logger: false,
      ajv: {
        plugins: [ajvFormats],
      },
    })

    await server.register(cors, {
      origin: true,
    })

    // Swagger
    await server.register(swagger, {})
    await server.register(swaggerUi, {
      routePrefix: '/documentation',
      uiConfig: {
        docExpansion: 'full',
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next()
        },
        preHandler: function (request, reply, next) {
          next()
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject
      },
      transformSpecificationClone: true,
    })

    // websocket
    await server.register(websocket)
    const subscriptions = {}
    server.get(
      '/ws/:user_id',
      { websocket: true, schema: websocketSchema },
      (connection, request) => {
        const user_id = request.params.user_id

        if (!subscriptions[user_id]) {
          subscriptions[user_id] = new Set()
        }
        subscriptions[user_id].add(connection.socket)

        connection.socket.on('close', () => {
          subscriptions[user_id].delete(connection.socket)
        })
      }
    )

    const sendDataToSubscribers = async (user_id, data) => {
      for (const user_id in subscriptions) {
        for (const socket of subscriptions[user_id]) {
          await socket.send(JSON.stringify(data))
        }
      }
    }

    // Fastify CRUDL endpoints
    server.post(
      `/processed_agent_data`,
      { schema: createSchema },
      async function (request, reply) {
        const body = request.body
        await dbModel.bulkCreate(body)
        reply.code(200).send({ success: true })
      }
    )
    server.get(
      `/processed_agent_data/:processed_agent_data_id`,
      { schema: getOneSchema },
      async function (request, reply) {
        const id = request.params.processed_agent_data_id
        const data = await dbModel.findOne({
          where: {
            id,
          },
        })
        reply.code(200).send({ success: true, data })
      }
    )
    server.get(
      `/processed_agent_data`,
      { schema: getAllSchema },
      async function (request, reply) {
        const data = await dbModel.findAll({ raw: true })
        reply.code(200).send({ success: true, data })
      }
    )
    server.put(
      `/processed_agent_data/:processed_agent_data_id`,
      { schema: updateSchema },
      async function (request, reply) {
        const id = request.params.processed_agent_data_id
        const body = request.body
        const res = await dbModel.update(body, {
          where: {
            id,
          },
        })
        if (res[0] === 1) {
          reply.code(200).send({ success: true })
          return
        }
        reply.code(400)
      }
    )
    server.delete(
      `/processed_agent_data/:processed_agent_data_id`,
      { schema: deleteSchema },
      async function (request, reply) {
        const id = request.params.processed_agent_data_id
        const res = await dbModel.destroy({
          where: {
            id,
          },
        })
        if (res[0] === 1) {
          reply.code(200).send({ success: true })
          return
        }
        reply.code(400)
      }
    )

    await server.listen({ port: httpPort, host: httpHost })
    console.log(`Server running on port ${httpPort}`)

    function shutdown() {
      server.close()
      postgres.close()
      setTimeout(() => process.exit(1), 10000)
    }
    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
  } catch (e) {
    console.log(e)
  }
}
start()
