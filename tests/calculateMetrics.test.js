const { calculateMRR, calculateARR, calculateNewMRR, calculateChurnedMRR, calculateExpansionMRR, calculateContractionMRR, calculateCAC, calculateRunway, calculateNetBurn, calculateLogoRetentionRate, calculateLogoChurnRate, calculateCustomerLifetime, calculateARPA, calculateLifetimeValue, calculateCustomers, calculateNewCustomers, calculateChurnedCustomers, calculateNetDollarRetention, calculateNetMrrChurnRate, calculateGrossMrrChurnRate, calculateCACPaybackPeriod, calculateQuickRatio, calculateLtvCACRatio, calculateCohortRetention, calculateBurnMultiple, calculateMagicNumber } = require('../helpers/metrics/metrics')

const revenueData = [
	{
		'Name': 'KAKCo',
		'Jan22': '40',
		'Feb22': '75',
		'Mar22': '0'
	},
	{
		'Name': 'Raisekit',
		'Jan22': '20',
		'Feb22': '80',
		'Mar22': '120'
	}
]

const costsData = [
	{
		'Name': 'S&M Spend',
		'Jan22': '100',
		'Feb22': '150'
	},
	{
		'Name': 'S&M Payroll',
		'Jan22': '50',
		'Feb22': '75',
	},
	{
		'Name': 'Other Payroll',
		'Jan22': '200',
		'Feb22': '250',
	}
]

const cashData = [
	{
		'Name': 'Cash Inflow excluding Financing',
		'Jan22': '800',
		'Feb22': '900'
	},
	{
		'Name': 'Cash Outflow',
		'Jan22': '1000',
		'Feb22': '750',
	},
	{
		'Name': 'Cash Balance',
		'Jan22': '100000',
		'Feb22': '120000',
	}
]

const cashNetBurnData = [
	{
		'Name': 'Cash Inflow excluding Financing',
		'Jan22': '500',
		'Feb22': '700'
	},
	{
		'Name': 'Cash Outflow',
		'Jan22': '600',
		'Feb22': '800',
	}
]

const expectedValues = {
	mrr: [
		{ 'Jan22': 60 },
		{ 'Feb22': 155 },
		{ 'Mar22': 120 }
	],
	arr: [
		{ 'Jan22': 720 },
		{ 'Feb22': 1860 },
		{ 'Mar22': 1440 }
	],
	new_mrr: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0 }
	],
	churned_mrr: [
		{ 'Feb22': 0 },
		{ 'Mar22': -75 }
	],
	expansion_mrr: [
		{ 'Feb22': 95 },
		{ 'Mar22': 40 }
	],
	contraction_mrr: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0 }
	],
	cac: [
		{ 'Jan22': 150 },
		{ 'Feb22': 225 }
	],
	runway: [
		{ 'Jan22': 500 },
		{ 'Feb22': 0 }
	],
	net_burn: [
		{ 'Jan22': -100 },
		{ 'Feb22': -100 }
	],
	logo_retention: [
		{ 'Feb22': 1 },
		{ 'Mar22': 0.5 }
	],
	logo_churn: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0.5 }
	],
	customer_lifetime: [
		{ 'Feb22': 0 },
		{ 'Mar22': 2 }
	],
	arpa: [
		{ 'Jan22': 30 },
		{ 'Feb22': 77.5 },
		{ 'Mar22': 120 }
	],
	lifetime_value: [
		{ 'Feb22': 0 },
		{ 'Mar22': 240 }
	],
	customers: [
		{ 'Jan22': 2 },
		{ 'Feb22': 2 },
		{ 'Mar22': 1 }
	],
	new_customers: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0 }
	],
	churned_customers: [
		{ 'Feb22': 0 },
		{ 'Mar22': -1 }
	],
	net_dollar_retention: [
		{ 'Feb22': 2.5833333333333335 },
		{ 'Mar22': 0.7741935483870968 }
	],
	net_mrr_churn: [
		{ 'Feb22': -1.5833333333333333 },
		{ 'Mar22': 0.22580645161290322 }
	],
	gross_mrr_churn: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0.4838709677419355 }
	],
	cac_payback_period: [
		{ 'Jan22': 5 },
		{ 'Feb22': 2.903225806451613 }
	],
	quick_ratio: [
		{ 'Feb22': 0 },
		{ 'Mar22': 0.5333333333333333 }
	],
	ltv_cac_ratio: [
		{ 'Feb22': 0 },
		{ 'Mar22': NaN }
	],
	cohort_retention: [
		{ Jan22: { '0': 1, '1': 1, '2': 0.5 } },
		{ Feb22: { '0': 1, '1': 0.5 } },
		{ Mar22: { '0': 1 } }
	],
	burn_multiple: [
		{ 'Feb22': 0.057 },
		{ 'Mar22': NaN }
	],
	magic_number: [
		{ Feb22: 0.07562189054726368 },
		{ Mar22: NaN }
	]
}

test('Given the data, calculates MRR and compares with expected value', async () => {
	expect(await calculateMRR(revenueData)).toEqual(expectedValues.mrr)
})

test('Given the data, calculates ARR and compares with expected value', async () => {
	expect(await calculateARR(revenueData)).toEqual(expectedValues.arr)
})

test('Given the data, calculates New MRR and compares with expected value', async () => {
	expect(await calculateNewMRR(revenueData)).toEqual(expectedValues.new_mrr)
})

test('Given the data, calculates Churned MRR and compares with expected value', async () => {
	expect(await calculateChurnedMRR(revenueData)).toEqual(expectedValues.churned_mrr)
})

test('Given the data, calculates Expansion MRR and compares with expected value', async () => {
	expect(await calculateExpansionMRR(revenueData)).toEqual(expectedValues.expansion_mrr)
})

test('Given the data, calculates Contraction MRR and compares with expected value', async () => {
	expect(await calculateContractionMRR(revenueData)).toEqual(expectedValues.contraction_mrr)
})

test('Given the data, calculates CAC and compares with expected value', async () => {
	expect(await calculateCAC(costsData)).toEqual(expectedValues.cac)
})

test('Given the data, calculates Runway and compares with expected value', async () => {
	expect(await calculateRunway(cashData)).toEqual(expectedValues.runway)
})

test('Given the data, calculates Net Burn and compares with expected value', async () => {
	expect(await calculateNetBurn(cashNetBurnData)).toEqual(expectedValues.net_burn)
})

test('Given the data, calculates Logo Retention Rate and compares with expected value', async () => {
	expect(await calculateLogoRetentionRate(revenueData)).toEqual(expectedValues.logo_retention)
})

test('Given the data, calculates Logo Churn Rate and compares with expected value', async () => {
	expect(await calculateLogoChurnRate(revenueData)).toEqual(expectedValues.logo_churn)
})

test('Given the data, calculates Customer Lifetime and compares with expected value', async () => {
	expect(await calculateCustomerLifetime(revenueData)).toEqual(expectedValues.customer_lifetime)
})

test('Given the data, calculates ARPA and compares with expected value', async () => {
	expect(await calculateARPA(revenueData)).toEqual(expectedValues.arpa)
})

test('Given the data, calculates Customer Lifetime Value and compares with expected value', async () => {
	expect(await calculateLifetimeValue(revenueData)).toEqual(expectedValues.lifetime_value)
})

test('Given the data, calculates Customers and compares with expected value', async () => {
	expect(await calculateCustomers(revenueData)).toEqual(expectedValues.customers)
})

test('Given the data, calculates New Customers and compares with expected value', async () => {
	expect(await calculateNewCustomers(revenueData)).toEqual(expectedValues.new_customers)
})

test('Given the data, calculates Churned Customers and compares with expected value', async () => {
	expect(await calculateChurnedCustomers(revenueData)).toEqual(expectedValues.churned_customers)
})

test('Given the data, calculates Net Dollar Retention and compares with expected value', async () => {
	expect(await calculateNetDollarRetention(revenueData)).toEqual(expectedValues.net_dollar_retention)
})

test('Given the data, calculates Net MRR Churn Rate and compares with expected value', async () => {
	expect(await calculateNetMrrChurnRate(revenueData)).toEqual(expectedValues.net_mrr_churn)
})

test('Given the data, calculates Gross MRR Churn Rate and compares with expected value', async () => {
	expect(await calculateGrossMrrChurnRate(revenueData)).toEqual(expectedValues.gross_mrr_churn)
})

test('Given the data, calculates CAC Payback Period and compares with expected value', async () => {
	expect(await calculateCACPaybackPeriod(costsData, revenueData)).toEqual(expectedValues.cac_payback_period)
})

test('Given the data, calculates Quick Ratio and compares with expected value', async () => {
	expect(await calculateQuickRatio(revenueData)).toEqual(expectedValues.quick_ratio)
})

test('Given the data, calculates LTV/CAC Ratio and compares with expected value', async () => {
	expect(await calculateLtvCACRatio(revenueData, costsData)).toEqual(expectedValues.ltv_cac_ratio)
})

test('Given the data, calculates Cohort Retention Rate and compares with expected value', async () => {
	expect(await calculateCohortRetention(revenueData)).toEqual(expectedValues.cohort_retention)
})

test('Given the data, calculates Burn Multiple and compares with expected value', async () => {
	expect(await calculateBurnMultiple(revenueData, cashData)).toEqual(expectedValues.burn_multiple)
})

test('Given the data, calculates Magic Number and compares with expected value', async () => {
	expect(await calculateMagicNumber(revenueData, costsData)).toEqual(expectedValues.magic_number)
})