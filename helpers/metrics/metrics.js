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

const calculateCustomerLifetime = async (df) => {
	const timeSeries = generateTimeArray(df)
	var customerLifetimeSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var churnedCustomers = 0
		var totalCustomers = 0 
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			churnedCustomers += ((currentMrr === 0) && (previousMrr !== 0)) ? 1 : 0
			totalCustomers += (previousMrr !== 0) ? 1 : 0
		}
		const customerLifetimeDatapoint = {[currentTimeframe]: (churnedCustomers !== 0) ? (totalCustomers / churnedCustomers) : 0} 
		customerLifetimeSeries.push(customerLifetimeDatapoint)
	}
	return customerLifetimeSeries
}

const calculateARPA = async (df) => {
	const timeSeries = generateTimeArray(df)
	var arpaSeries = []
	for (let i = 0; i < timeSeries.length; i++) {
		var mrr = 0
		var customers = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			mrr += currentMrr
			customers += ((currentMrr !== 0) ? 1 : 0)
		}
		const arpaDatapoint = {[timeSeries[i]]: (customers !== 0) ? (mrr / customers) : 0}
		arpaSeries.push(arpaDatapoint)
	}
	return arpaSeries
}

const calculateLifetimeValue = async (df) => {
	const timeSeries = generateTimeArray(df)
	var lifetimeValueSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var churnedCustomers = 0
		var lastMonthCustomers = 0
		var mrr = 0
		var currentCustomers = 0
		const currentTimeframe = timeSeries[i]
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			churnedCustomers += ((currentMrr === 0) && (previousMrr !== 0)) ? 1 : 0
			lastMonthCustomers += (previousMrr !== 0) ? 1 : 0
			mrr += currentMrr
			currentCustomers += ((currentMrr !== 0) ? 1 : 0)
		}
		const lifetimeValueDatapoint = {[currentTimeframe]: ((churnedCustomers !== 0) && (currentCustomers !== 0)) ? ((lastMonthCustomers / churnedCustomers) * (mrr / currentCustomers)) : 0}
		lifetimeValueSeries.push(lifetimeValueDatapoint)
	}
	return lifetimeValueSeries
}
const calculateCustomers = async (df) => {
	const timeSeries = generateTimeArray(df)
	var customersSeries = []
	timeSeries.forEach((element) => {
		var sum = 0
		for (let i = 0; i < df.length; i++) {
			if (df[i][element] != 0) { sum++ }
		}
		const customersDatapoint = {[element]: sum}
		customersSeries.push(customersDatapoint)
	})
	return customersSeries
}

const calculateNewCustomers = async (df) => {
	const timeSeries = generateTimeArray(df)
	var newCustomersSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr === 0) && (currentMrr !== 0)) ? 1 : 0
		}
		const newCustomerDatapoint = {[currentTimeframe]: sum}
		newCustomersSeries.push(newCustomerDatapoint)
	}
	return newCustomersSeries
}

const calculateChurnedCustomers = async (df) => {
	const timeSeries = generateTimeArray(df)
	var churnedCustomersSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i-1]])
			sum += ((previousMrr !== 0) && (currentMrr === 0)) ? -1 : 0
		}
		const churnedCustomerDatapoint = {[currentTimeframe]: sum}
		churnedCustomersSeries.push(churnedCustomerDatapoint)
	}
	return churnedCustomersSeries
}
module.exports = { calculateMRR, calculateARR, calculateNewMRR, calculateChurnedMRR, calculateContractionMRR, calculateExpansionMRR, calculateCustomerLifetime, calculateARPA, calculateLifetimeValue,calculateCustomers, calculateNewCustomers, calculateChurnedCustomers }

