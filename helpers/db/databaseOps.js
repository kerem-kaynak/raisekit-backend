var admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const {
	convertUploadedDataToDatabaseFormat,
	sanitizeData
} = require('../metrics/dataHandlers')
require('dotenv').config()

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
})

const db = getFirestore()

const writeUploadedRawDataToDatabase = async (company, body) => {
	const fieldNames = {
		revenue: 'revenue_data',
		costs: 'costs_data',
		cash: 'cash_data',
	}
	const sanitizedData = await sanitizeData(body.data)
	const formattedData = await convertUploadedDataToDatabaseFormat(sanitizedData)
	const databaseUpdateResponse = await db
		.collection('companies')
		.doc(company)
		.update({
			[fieldNames[body.type]]: formattedData,
		})
	return databaseUpdateResponse
}

const writeMetricToDatabase = async (func, company, metricRes) => {
	const functionNameToMetricNameMap = {
		calculateMRR: 'mrr',
		calculateARR: 'arr',
		calculateNewMRR: 'new_mrr',
		calculateChurnedMRR: 'churned_mrr',
		calculateContractionMRR: 'contraction_mrr',
		calculateExpansionMRR: 'expansion_mrr',
		calculateCustomerLifetime: 'customer_lifetime',
		calculateARPA: 'arpa',
		calculateLifetimeValue: 'customer_lifetime_value',
		calculateCustomers: 'customer_count',
		calculateNewCustomers: 'new_customer_count',
		calculateChurnedCustomers: 'churned_customer_count',
		calculateLogoRetentionRate: 'logo_retention_rate',
		calculateLogoChurnRate: 'logo_churn_rate',
		calculateNetDollarRetention: 'net_dollar_retention',
		calculateNetMrrChurnRate: 'net_mrr_churn_rate',
		calculateGrossMrrChurnRate: 'gross_mrr_churn_rate',
		calculateCAC: 'customer_acquisition_cost',
		calculateRunway: 'runway',
		calculateCACPaybackPeriod: 'cac_payback_period',
		calculateQuickRatio: 'quick_ratio',
		calculateLtvCACRatio: 'ltv_cac_ratio',
		calculateCohortRetention: 'cohort_retention',
		calculateBurnMultiple: 'burn_multiple',
		calculateNetBurn: 'net_burn',
		calculateMagicNumber: 'magic_number',
	}
	const databaseSetResponse = await db
		.collection('companies')
		.doc(company)
		.collection('metrics')
		.doc(functionNameToMetricNameMap[func.name])
		.set({ series: metricRes })
	return databaseSetResponse
}

const fetchDataFromDatabase = async (company) => {
	const fetchedData = (await db.collection('companies').doc(company).get()).data()
	return fetchedData
}

const fetchMetricsFromDatabase = async (company) => {
	const rawDataFromDatabase = (await db.collection('companies').doc(company).collection('metrics').get())
	let fetchedMetricsData = rawDataFromDatabase.docs.map(doc => {
		return {
			name: doc.id,
			data: doc.data()
		}
	})
	return fetchedMetricsData
}

module.exports = {
	writeUploadedRawDataToDatabase,
	writeMetricToDatabase,
	fetchDataFromDatabase,
	fetchMetricsFromDatabase
}
