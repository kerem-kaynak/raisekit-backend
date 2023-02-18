const calculateMRR = async function (df) {
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

module.exports = { calculateMRR }