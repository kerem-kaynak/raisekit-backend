const { generateTimeArray } = require('../helpers/metrics/metrics')

const dummyData = [
	{
		'Name': 'KAKCo',
		'Jan22': '20',
		'Feb22': '15',
		'Mar22': '35',
		'Apr22': '75',
		'May22': '115'
	},
	{
		'Name': 'Raisekit',
		'Jan22': '10',
		'Feb22': '25',
		'Mar22': '185',
		'Apr22': '95',
		'May22': '10'
	}
]

test('Given a new dataset in upload format, returns an array of keys excluding the Name, therefore the months', async () => {
	expect(generateTimeArray(dummyData)).toEqual(['Jan22', 'Feb22', 'Mar22', 'Apr22', 'May22'])
})