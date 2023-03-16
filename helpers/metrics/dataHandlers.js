const convertUploadedDataToDatabaseFormat = async (df) => {
	let result = {}
	for (let i = 0; i < df.length; i++) {
		const { Name, ...rowValues } = df[i]
		result[Name] = []
		for (let val in rowValues) {
			if (Object.prototype.hasOwnProperty.call(rowValues, val)) {
				result[Name].push({[val]: parseFloat(rowValues[val])})
			}
		}
	}
	return result
}

const convertDatabaseDataToProcessingFormat = async (df) => {
	let result = []
	for (let i = 0; i < Object.keys(df).length; i++) {
		const key = Object.keys(df)[i]
		let rowData = df[key]
		let finalRow = {}
		for (let j = 0; j < rowData.length; j++) {
			finalRow = { ...finalRow, ...rowData[j]}
		}
		const tempName = { 'Name': key }
		const mergedObj = { ...tempName, ...finalRow}
		result.push(mergedObj)
	}
	return result
}

module.exports = {
	convertUploadedDataToDatabaseFormat,
	convertDatabaseDataToProcessingFormat
}