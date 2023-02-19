const calculateMRR = async (df) => {
	var timeSeries = Object.keys(df[0])
	timeSeries.shift()
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

module.exports = { calculateMRR, calculateARR }