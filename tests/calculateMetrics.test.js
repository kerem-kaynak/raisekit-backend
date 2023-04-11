const { calculateMRR, calculateARR, calculateNewMRR, calculateChurnedMRR, calculateExpansionMRR, calculateContractionMRR, calculateCAC } = require('../helpers/metrics/metrics')

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