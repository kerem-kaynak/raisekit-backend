const { convertUploadedDataToDatabaseFormat, convertDatabaseDataToProcessingFormat } = require('../helpers/metrics/dataHandlers')

const databaseFormatData =
  {
  	KAKCo: [
  		{ 'Jan22': 40 },
  		{ 'Feb22': 75 },
  		{ 'Mar22': 0 }
  	],
  	Raisekit: [
  		{ 'Jan22': 20 },
  		{ 'Feb22': 80 },
  		{ 'Mar22': 120 }
  	]
  }

const uploadedRawDataFormat = [
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

const processingDataFormat = [
	{
		'Name': 'KAKCo',
		'Jan22': 40,
		'Feb22': 75,
		'Mar22': 0
	},
	{
		'Name': 'Raisekit',
		'Jan22': 20,
		'Feb22': 80,
		'Mar22': 120
	}
]

test('Given uploaded data format, returns the same data in our database format', async () => {
	expect(await convertUploadedDataToDatabaseFormat(uploadedRawDataFormat)).toEqual(databaseFormatData)
})

test('Given database format data, returns the same data in our processing format', async () => {
	expect(await convertDatabaseDataToProcessingFormat(databaseFormatData)).toEqual(processingDataFormat	)
})