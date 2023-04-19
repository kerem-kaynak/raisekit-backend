const metrics = require('../helpers/metrics/metrics')
const databaseOps = require('../helpers/db/databaseOps')

const mockUploadData = {
	'type': 'revenue',
	'company': 'raisekit',
	'data': [
		{
			'Name': 'a',
			'Jan22': '50',
			'Feb22': '100',
			'Mar22': '200'
		},
		{
			'Name': 'b',
			'Jan22': '0',
			'Feb22': '0',
			'Mar22': '120'
		},
		{
			'Name': 'c',
			'Jan22': '0',
			'Feb22': '80',
			'Mar22': '0'
		},
		{
			'Name': 'd',
			'Jan22': '20',
			'Feb22': '0',
			'Mar22': '20'
		},
		{
			'Name': 'e',
			'Jan22': '0',
			'Feb22': '0',
			'Mar22': '120'
		}
	]
}
const mockDatabaseData = {'cash_data':{'Cash Outflow':[{'Jan22':1000},{'Feb22':2500},{'Mar22':5000}],'Cash Inflow excluding Financing':[{'Jan22':200},{'Feb22':500},{'Mar22':1000}],'Cash Balance':[{'Jan22':100000},{'Feb22':120000},{'Mar22':122000}],'Financing Inflow':[{'Jan22':0},{'Feb22':10000},{'Mar22':0}]},'costs_data':{'S&M Payroll':[{'Jan22':100},{'Feb22':100},{'Mar22':100},{'Apr22':100}],'Services':[{'Jan22':1000},{'Feb22':0},{'Mar22':0},{'Apr22':750}],'Other Payroll':[{'Jan22':500},{'Feb22':500},{'Mar22':800},{'Apr22':800}],'PPE':[{'Jan22':0},{'Feb22':0},{'Mar22':300},{'Apr22':0}],'S&M Spend':[{'Jan22':200},{'Feb22':500},{'Mar22':1000},{'Apr22':2000}],'Infrastructure':[{'Jan22':150},{'Feb22':150},{'Mar22':150},{'Apr22':150}],'Other':[{'Jan22':200},{'Feb22':0},{'Mar22':400},{'Apr22':0}]},'revenue_data':{'a':[{'Jan22':50},{'Feb22':100},{'Mar22':200}],'b':[{'Jan22':0},{'Feb22':0},{'Mar22':120}],'c':[{'Jan22':0},{'Feb22':80},{'Mar22':0}],'d':[{'Jan22':20},{'Feb22':0},{'Mar22':20}],'e':[{'Jan22':0},{'Feb22':0},{'Mar22':120}]}}
const mockMetrics = [
	{'arpa': [{Jan22: 35}, {Feb22: 90}, {Mar22: 115}]},
	{'arr': [{Jan22: 840}, {Feb22: 2160}, {Mar22: 5520}]},
	{'burn_multiple': [{Feb22: 0.066}, {Mar22: 1.68}]},
	{'cac_payback_period': [{Jan22: 34.285714285714285}, {Feb22: 33.333333333333336}, {Mar22: 4.3478260869565215}]},
	{'churned_customer_count': [{Feb22: -1}, {Mar22: -1}]},
	{'churned_mrr': [{Feb22: -20}, {Mar22: -80}]},
	{'cohort_retention': [{Jan22: {0: 1, 1: 0.5, 2: 1}}, {Feb22: {0: 1, 1: 0.5}}, {Mar22: {0: 1}}]},
	{'contraction_mrr': [{Feb22: 0}, {Mar22: 0}]},
	{'customer_acquisition_cost': [{Jan22: 1200}, {Feb22: 3000}, {Mar22: 500}]},
	{'customer_count': [{Jan22: 2}, {Feb22: 2}, {Mar22: 4}]},
	{'customer_lifetime': [{Feb22: 2}, {Mar22: 2}]},
	{'customer_lifetime_value': [{Feb22: 180}, {Mar22: 230}]},
	{'expansion_mrr': [{Feb22: 50}, {Mar22: 100}]},
	{'gross_mrr_churn_rate': [{Feb22: 0.2857142857142857}, {Mar22: 0.4444444444444444}]},
	{'logo_churn_rate': [{Feb22: 0.5}, {Mar22: 0.5}]},
	{'logo_retention_rate': [{Feb22: 0.5}, {Mar22: 0.5}]},
	{'ltv_cac_ratio': [{Feb22: 0.06}, {Mar22: 0.46}]},
	{'magic_number': [{Feb22: 0.44}, {Mar22: 6.72}]},
	{'mrr': [{Jan22: 70}, {Feb22: 180}, {Mar22: 460}]},
	{'net_burn': [{Jan22: -800}, {Feb22: -2000}, {Mar22: -4000}]},
	{'net_dollar_retention': [{Feb22: 1.4285714285714286}, {Mar22: 1.1111111111111112}]},
	{'net_mrr_churn_rate': [{Feb22: -0.42857142857142855}, {Mar22: -0.1111111111111111}]},
	{'new_customer_count': [{Feb22: 1}, {Mar22: 3}]},
	{'new_mrr': [{Feb22: 80}, {Mar22: 260}]},
	{'quick_ratio': [{Feb22: 6.5}, {Mar22: 4.5}]},
	{'runway': [{Jan22: 0}, {Feb22: 0}, {Mar22: 0}]}
]

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

const mockCalculations = []

jest.mock('../helpers/db/databaseOps', () => ({
	...jest.requireActual('../helpers/db/databaseOps'),
	writeUploadedRawDataToDatabase: jest.fn().mockResolvedValue(),
	fetchDataFromDatabase: jest.fn().mockResolvedValue({'cash_data':{'Cash Outflow':[{'Jan22':1000},{'Feb22':2500},{'Mar22':5000}],'Cash Inflow excluding Financing':[{'Jan22':200},{'Feb22':500},{'Mar22':1000}],'Cash Balance':[{'Jan22':100000},{'Feb22':120000},{'Mar22':122000}],'Financing Inflow':[{'Jan22':0},{'Feb22':10000},{'Mar22':0}]},'revenue_data':{'a':[{'Jan22':50},{'Feb22':100},{'Mar22':200}],'b':[{'Jan22':0},{'Feb22':0},{'Mar22':120}],'c':[{'Jan22':0},{'Feb22':80},{'Mar22':0}],'d':[{'Jan22':20},{'Feb22':0},{'Mar22':20}],'e':[{'Jan22':0},{'Feb22':0},{'Mar22':120}]},'costs_data':{'S&M Payroll':[{'Jan22':1000},{'Feb22':2500},{'Mar22':250}],'Other Payroll':[{'Jan22':10},{'Feb22':25},{'Mar22':250}],'S&M Spend':[{'Jan22':200},{'Feb22':500},{'Mar22':250}]}}),
	writeMetricToDatabase: jest.fn().mockImplementation(async (func, company, data) => {
		mockCalculations.push({[functionNameToMetricNameMap[func.name]]: data})
	})
}))

test('Given new upload data is received, calculates all metrics and writes them to the database', async () => {
	await metrics.calculateAllMetricsAndWriteToDatabase('raisekit', mockUploadData)
	expect(mockCalculations.length).toEqual(mockMetrics.length)
	for(let i = 0; i < mockMetrics.length; i ++) {
		const res = mockCalculations.filter(element => Object.keys(element)[0] == Object.keys(mockMetrics[i])[0])
		expect(mockMetrics[i]).toEqual(res[0])
	}
})