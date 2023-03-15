const convertUploadedDataToDatabaseFormat = async (df) => {
	let result = {}
	for (let i = 0; i < df.length; i++) {
		const { Name, ...rowValues } = df[i]
		result[Name] = rowValues
	}
	return result
}

const convertDatabaseDataToProcessingFormat = async (df) => {
	let result = []
	for (let i = 0; i < Object.keys(df).length; i++) {
		const key = Object.keys(df)[i]
		let rowData = df[key]
		for (let val in rowData) {
			if (Object.prototype.hasOwnProperty.call(rowData, val)) {
				rowData[val] = parseFloat(rowData[val])
			}
		}
		const tempName = { 'Name': key }
		const mergedObj = { ...tempName, ...df[key]}
		result.push(mergedObj)
	}
	return result
}

module.exports = {
	convertUploadedDataToDatabaseFormat,
	convertDatabaseDataToProcessingFormat
}