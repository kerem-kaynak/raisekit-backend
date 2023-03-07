const fastify = require('fastify')({
	logger: true,
	prettyPrint: true,
	disableRequestLogging: false
})
const { writeOrUpdateDoc, deleteDoc } = require('./helpers/db/databaseOps')
const { 
	calculateMRR, 
	calculateARR,
	calculateNewMRR,
	calculateChurnedMRR,
	calculateContractionMRR,
	calculateExpansionMRR,
	calculateCustomerLifetime,
	calculateARPA,
	calculateLifetimeValue,
	calculateCustomers,
	calculateNewCustomers,
	calculateChurnedCustomers,
	calculateNetMrrChurnRate,
	calculateGrossMrrChurnRate,
	calculateLogoRetentionRate,
	calculateLogoChurnRate,
	calculateNetDollarRetention,
	calculateCAC
} = require('./helpers/metrics/metrics')

fastify.get('/', async (req, res) => {
	res.status(200).send({ hello: 'test2!', req: req.body })
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

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/new_mrr',
	handler: async function (req, res) {
		try {
			const result = await calculateNewMRR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/churned_mrr',
	handler: async function (req, res) {
		try {
			const result = await calculateChurnedMRR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/contraction_mrr',
	handler: async function (req, res) {
		try {
			const result = await calculateContractionMRR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/expansion_mrr',
	handler: async function (req, res) {
		try {
			const result = await calculateExpansionMRR(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/logo_retention',
	handler: async function (req, res) {
		try {
			const result = await calculateLogoRetentionRate(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/logo_churn',
	handler: async function (req, res) {
		try {
			const result = await calculateLogoChurnRate(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/customer_lifetime',
	handler: async function (req, res) {
		try {
			const result = await calculateCustomerLifetime(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/arpa',
	handler: async function (req, res) {
		try {
			const result = await calculateARPA(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/lifetime_value',
	handler: async function (req, res) {
		try {
			const result = await calculateLifetimeValue(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/customers',
	handler: async function (req, res) {
		try {
			const result = await calculateCustomers(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/new_customers',
	handler: async function (req, res) {
		try {
			const result = await calculateNewCustomers(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/churned_customers',
	handler: async function (req, res) {
		try {
			const result = await calculateChurnedCustomers(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/net_mrr_churn_rate',
	handler: async function (req, res) {
		try {
			const result = await calculateNetMrrChurnRate(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/gross_mrr_churn_rate',
	handler: async function (req, res) {
		try {
			const result = await calculateGrossMrrChurnRate(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/net_dollar_retention',
	handler: async function (req, res) {
		try {
			const result = await calculateNetDollarRetention(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/api/v0/metrics/cac',
	handler: async function (req, res) {
		try {
			const result = await calculateCAC(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/dbtest',
	handler: async function (req, res) {
		try {
			const result = await writeOrUpdateDoc(req.body)
			res.status(200).send(result)
		} catch (err) {
			fastify.log.error(err)
			res.send(500)
		}
	}
})

fastify.route({
	method: 'POST',
	url: '/dbtestdelete',
	handler: async function (req, res) {
		try {
			const result = await deleteDoc()
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