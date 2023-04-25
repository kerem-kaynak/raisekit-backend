const validator = require('validator');

const convertUploadedDataToDatabaseFormat = async (df) => {
	let result = {}
	for (let i = 0; i < df.length; i++) {
		const { Name, ...rowValues } = df[i]
		result[Name] = []
		for (let rowHeader in rowValues) {
			if (Object.prototype.hasOwnProperty.call(rowValues, rowHeader)) {
				result[Name].push({ [rowHeader]: parseFloat(rowValues[rowHeader]) })
			}
		}
	}
	return result
}

const convertDatabaseDataToProcessingFormat = async (df) => {
	let dataInProcessingFormat = []
	for (let i = 0; i < Object.keys(df).length; i++) {
		const key = Object.keys(df)[i]
		let rowDatapoint = df[key]
		let finalRowData = {}
		for (let j = 0; j < rowDatapoint.length; j++) {
			finalRowData = { ...finalRowData, ...rowDatapoint[j] }
		}
		const rowName = { 'Name': key }
		const mergedData = { ...rowName, ...finalRowData }
		dataInProcessingFormat.push(mergedData)
	}
	return result
}

const sanitizeData = async (df) => {
	console.log("before sanitization: ", df)
	const sanitizedData = []

	for (const row of df) {
		const sanitizedRow = {}
		for (const [key, value] of Object.entries(row)) {
			const sanitizedKey = validator.escape(key)
			sanitizedRow[sanitizedKey] = value
		}
		sanitizedData.push(sanitizedRow)
	}
	console.log("sanitized: ", sanitizedData)
	return sanitizedData
}

module.exports = {
	convertUploadedDataToDatabaseFormat,
	convertDatabaseDataToProcessingFormat,
	sanitizeData
}