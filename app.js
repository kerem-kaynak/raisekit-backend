const fastify = require('fastify')({
	logger: true,
	prettyPrint: true,
	disableRequestLogging: false
})
const { calculateMRR, calculateARR } = require('./helpers/metrics/metrics')

fastify.get('/', async (req, res) => {

	return { hello: 'test!', req: req, res: res }

})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/mrr',
	handler: async function (req, res) {
		try {
			const result = await calculateMRR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/arr',
	handler: async function (req, res) {
		try {
			const result = await calculateARR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
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