// CommonJs
const fastify = require('fastify')({
  logger: true
})

fastify.get('/', async (request, reply) => {

<<<<<<< HEAD
  return { hello: 'berk!' }
=======
  return { hello: 'tom!' }
>>>>>>> 3c74a1f (test tom)

})

/**
 * Run the server!
 */

const PORT = parseInt(parseInt(process.env.PORT)) || 8080
const HOST = parseInt(parseInt(process.env.HOST)) || '0.0.0.0'

const start = async () => {
    await fastify.listen({ port: PORT, host: HOST })
    fastify.log.info(`Server is now listening on port: ${PORT}`)
}
start()