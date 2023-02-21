const generateTimeArray = (df) => {
	var timeSeries = Object.keys(df[0])
	timeSeries.shift()
	return timeSeries
}

const calculateMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var mrrSeries = []
	timeSeries.forEach((element)=>{
		var sum = 0
		for(let i = 0; i < df.length; i++){
			sum += parseFloat(df[i][element])
		}
		const result = {[element]:sum}
		mrrSeries.push(result)
	})
	return mrrSeries
}

const calculateARR = async (df) => {
	const mrrSeries = await calculateMRR(df)
	var arrSeries = []
	mrrSeries.forEach((element)=>{
		const arrDataPoint = {[Object.keys(element)[0]] : (12 * Object.values(element)[0])}
		arrSeries.push(arrDataPoint)
	})
	return arrSeries
}

const calculateNewMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var newMrrSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr === 0) && (currentMrr !== 0)) ? (currentMrr - previousMrr) : 0
		}
		const newMrrDatapoint = {[currentTimeframe]: sum}
		newMrrSeries.push(newMrrDatapoint)
	}
	return newMrrSeries
}

const calculateChurnedMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var churnedMrrSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr !== 0) && (currentMrr === 0)) ? (currentMrr - previousMrr) : 0
		}
		const churnedMrrDatapoint = {[currentTimeframe]: sum}
		churnedMrrSeries.push(churnedMrrDatapoint)
	}
	return churnedMrrSeries
}

const calculateContractionMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var contractionMrrSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr > currentMrr) && (currentMrr !== 0)) ? (currentMrr - previousMrr) : 0
		}
		const contractionMrrDatapoint = {[currentTimeframe]: sum}
		contractionMrrSeries.push(contractionMrrDatapoint)
	}
	return contractionMrrSeries
}

const calculateExpansionMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var expansionMrrSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr < currentMrr) && (previousMrr !== 0)) ? (currentMrr - previousMrr) : 0
		}
		const expansionMrrDatapoint = {[currentTimeframe]: sum}
		expansionMrrSeries.push(expansionMrrDatapoint)
	}
	return expansionMrrSeries
}


module.exports = { calculateMRR, calculateARR, calculateNewMRR, calculateChurnedMRR, calculateContractionMRR, calculateExpansionMRR }