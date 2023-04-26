const cors = require('@fastify/cors')
const fastify = require('fastify')({
	logger: true,
	prettyPrint: true,
	disableRequestLogging: false
})
const { calculateAllMetricsAndWriteToDatabase } = require('./helpers/metrics/metrics')
const { fetchMetricsFromDatabase } = require('./helpers/db/databaseOps')
const { checkIfAuthenticated } = require('./helpers/auth/auth')

const registerCors = async () => {await fastify.register(cors, { 
	origin: true,
	methods: ['GET'],
	//methods: ['GET', 'POST']
//	allowedHeaders: ['Content-Type', 'Authorization']
})}

registerCors()

fastify.route({
	method: 'POST',
	url: '/api/v0/upload_new_data',
	preHandler: checkIfAuthenticated,
	handler: async function (req, res) {
		try {
			await calculateAllMetricsAndWriteToDatabase(req.body, req.body.company)
			res.status(200).send('Data successfully updated.')
		} catch (err) {
			fastify.log.error(err)
			res.status(500).send()
		}
	}
})

fastify.route({
	method: 'GET',
	url: '/get_metrics',
	preHandler: checkIfAuthenticated,
	handler: async function (req, res) {
		try {
			const result = await fetchMetricsFromDatabase(req.query.company)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.status(500).send()
		}
	}
})

const PORT = parseInt(parseInt(process.env.PORT)) || 8080
const HOST = parseInt(parseInt(process.env.HOST)) || '0.0.0.0'

const start = async () => {
	await fastify.listen({ port: PORT, host: HOST })
	fastify.log.info(`Server is now listening on port: ${PORT}`)
}
start()