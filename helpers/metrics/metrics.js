const {
	writeUploadedRawDataToDatabase,
	fetchDataFromDatabase,
	writeMetricToDatabase,
} = require('../db/databaseOps')
const { convertDatabaseDataToProcessingFormat } = require('./dataHandlers')

const generateTimeArray = (df) => {
	var timeSeries = Object.keys(df[0])
	timeSeries.shift()
	return timeSeries
}

const calculateMRR = async (df) => {
	const timeSeries = generateTimeArray(df)
	var mrrSeries = []
	timeSeries.forEach((element) => {
		var sum = 0
		for (let i = 0; i < df.length; i++) {
			sum += parseFloat(df[i][element])
		}
		const result = { [element]: sum }
		mrrSeries.push(result)
	})
	return mrrSeries
}

const calculateARR = async (df) => {
	const mrrSeries = await calculateMRR(df)
	var arrSeries = []
	mrrSeries.forEach((element) => {
		const arrDataPoint = {
			[Object.keys(element)[0]]: 12 * Object.values(element)[0],
		}
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum +=
        previousMrr === 0 && currentMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const newMrrDatapoint = { [currentTimeframe]: sum }
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum +=
        previousMrr !== 0 && currentMrr === 0 ? currentMrr - previousMrr : 0
		}
		const churnedMrrDatapoint = { [currentTimeframe]: sum }
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum +=
        previousMrr > currentMrr && currentMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const contractionMrrDatapoint = { [currentTimeframe]: sum }
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum +=
        previousMrr < currentMrr && previousMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const expansionMrrDatapoint = { [currentTimeframe]: sum }
		expansionMrrSeries.push(expansionMrrDatapoint)
	}
	return expansionMrrSeries
}

const calculateLogoRetentionRate = async (df) => {
	const timeSeries = generateTimeArray(df)
	var logoRetentionSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var retainedCustomers = 0
		var totalCustomers = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			retainedCustomers += currentMrr !== 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const logoRetentionDatapoint = {
			[currentTimeframe]:
        totalCustomers !== 0 ? retainedCustomers / totalCustomers : 0,
		}
		logoRetentionSeries.push(logoRetentionDatapoint)
	}
	return logoRetentionSeries
}

const calculateLogoChurnRate = async (df) => {
	const timeSeries = generateTimeArray(df)
	var logoChurnSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var churnedCustomers = 0
		var totalCustomers = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = timeSeries[i]
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const logoChurnDatapoint = {
			[currentTimeframe]:
        totalCustomers !== 0 ? churnedCustomers / totalCustomers : 0,
		}
		logoChurnSeries.push(logoChurnDatapoint)
	}
	return logoChurnSeries
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const customerLifetimeDatapoint = {
			[currentTimeframe]:
        churnedCustomers !== 0 ? totalCustomers / churnedCustomers : 0,
		}
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
			customers += currentMrr !== 0 ? 1 : 0
		}
		const arpaDatapoint = {
			[timeSeries[i]]: customers !== 0 ? mrr / customers : 0,
		}
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			lastMonthCustomers += previousMrr !== 0 ? 1 : 0
			mrr += currentMrr
			currentCustomers += currentMrr !== 0 ? 1 : 0
		}
		const lifetimeValueDatapoint = {
			[currentTimeframe]:
        churnedCustomers !== 0 && currentCustomers !== 0 ? (lastMonthCustomers / churnedCustomers) * (mrr / currentCustomers) : 0,
		}
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
			if (df[i][element] != 0) {
				sum++
			}
		}
		const customersDatapoint = { [element]: sum }
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum += previousMrr === 0 && currentMrr !== 0 ? 1 : 0
		}
		const newCustomerDatapoint = { [currentTimeframe]: sum }
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
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum += previousMrr !== 0 && currentMrr === 0 ? -1 : 0
		}
		const churnedCustomerDatapoint = { [currentTimeframe]: sum }
		churnedCustomersSeries.push(churnedCustomerDatapoint)
	}
	return churnedCustomersSeries
}

const calculateNetDollarRetention = async (df) => {
	const timeSeries = generateTimeArray(df)
	var netDollarRetentionSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum += previousMrr !== 0 ? currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const netDollarRetentionDatapoint = {
			[timeSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		netDollarRetentionSeries.push(netDollarRetentionDatapoint)
	}
	return netDollarRetentionSeries
}
const calculateNetMrrChurnRate = async (df) => {
	const timeSeries = generateTimeArray(df)
	var netMrrChurnRateSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum += previousMrr !== 0 ? previousMrr - currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const netMrrChurnRateDatapoint = {
			[timeSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		netMrrChurnRateSeries.push(netMrrChurnRateDatapoint)
	}
	return netMrrChurnRateSeries
}

const calculateGrossMrrChurnRate = async (df) => {
	const timeSeries = generateTimeArray(df)
	var grossMrrChurnRateSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			sum +=
        previousMrr !== 0 && previousMrr > currentMrr ? previousMrr - currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const grossMrrChurnRateDatapoint = {
			[timeSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		grossMrrChurnRateSeries.push(grossMrrChurnRateDatapoint)
	}
	return grossMrrChurnRateSeries
}

const calculateCAC = async (df) => {
	const relevantItemsArray = df.filter(
		(item) => item.Item == 'S&M Spend' || item.Item == 'S&M Payroll'
	)
	const timeSeries = generateTimeArray(relevantItemsArray)
	let cacSeries = []
	for (let i = 0; i < timeSeries.length; i++) {
		let sum = 0
		for (let j = 0; j < relevantItemsArray.length; j++) {
			const currentCAC = parseFloat(relevantItemsArray[j][timeSeries[i]])
			sum += currentCAC
		}
		const CACDatapoint = { [timeSeries[i]]: sum }
		cacSeries.push(CACDatapoint)
	}
	return cacSeries
}

const calculateRunway = async (df) => {
	const timeSeries = generateTimeArray(df)
	let runwaySeries = []
	for (let i = 0; i < timeSeries.length; i++) {
		const currentOutflow = parseFloat(df[1][timeSeries[i]])
		const currentInflow = parseFloat(df[0][timeSeries[i]])
		const currentNetBurn = currentOutflow - currentInflow
		const runwayDatapoint = {
			[timeSeries[i]]:
        currentNetBurn >= 0 ? df[2][timeSeries[i]] / currentNetBurn : 0,
		}
		runwaySeries.push(runwayDatapoint)
	}
	return runwaySeries
}

const calculateCACPaybackPeriod = async (costDf, revenueDf) => {
	// filter out S&M costs
	const costArray = costDf.filter(
		(item) => item.Name == 'S&M Spend' || item.Name == 'S&M Payroll'
	)
	// timeArray for CAC
	const timeSeries = generateTimeArray(costArray)
	// timeArray for ARPA
	// const timeSeriesARPA = generateTimeArray(revenue);
	let cacSeries = []
	let arpaSeries = []

	for (let i = 0; i < timeSeries.length; i++) {
		let totalCAC = 0
		let mrr = 0
		let customers = 0

		// CAC calculation

		for (let j = 0; j < costArray.length; j++) {
			const currentCAC = parseFloat(costArray[j][timeSeries[i]])
			totalCAC += currentCAC
		}
		const CACDatapoint = { [timeSeries[i]]: totalCAC }
		cacSeries.push(CACDatapoint)

		// ARPA calculation (mrr / no. of accounts)
		for (let k = 0; k < revenueDf.length; k++) {
			const currentMrr = parseFloat(revenueDf[k][timeSeries[i]])
			mrr += currentMrr
			customers += currentMrr !== 0 ? 1 : 0
		}
		const arpaDatapoint = {
			[timeSeries[i]]: customers !== 0 ? mrr / customers : 0,
		}
		arpaSeries.push(arpaDatapoint)
	}
	// cacseries = [{ Jan22: 2 },4,6]
	// [2]
	// arpaseries = [4,8,10]
	// CAC Payback Period Calculation
	const cacPaybackPeriodSeries = cacSeries.map((datapoint, i) => {
		return {
			[Object.keys(datapoint)[0]]:
        Object.values(datapoint)[0] / Object.values(arpaSeries[i])[0],
		}
	})
	return cacPaybackPeriodSeries
}
const calculateMetricAndWriteToDatabase = async (func, df, company) => {
	const res = await func(df)
	const dbRes = await writeMetricToDatabase(func, company, res)
	return dbRes
}

const calculateQuickRatio = async (df) => {
	const timeSeries = generateTimeArray(df)
	var quickRatioSeries = []
	for (let i = 1; i < timeSeries.length; i++) {
		var churnedAndContractionMrr = 0
		var newAndExpansionMrr = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][timeSeries[i]])
			const previousMrr = parseFloat(df[j][timeSeries[i - 1]])
			churnedAndContractionMrr +=
        (previousMrr !== 0) && (previousMrr > currentMrr) ? (previousMrr - currentMrr) : 0
			newAndExpansionMrr +=
        previousMrr < currentMrr ? (currentMrr - previousMrr) : 0
		}
		const quickRatioDatapoint = {
			[timeSeries[i]]: (churnedAndContractionMrr !== 0)
				? (newAndExpansionMrr / churnedAndContractionMrr)
				: 0
		}
		quickRatioSeries.push(quickRatioDatapoint)
	}
	return quickRatioSeries
}

const calculateCohortRetention = async (df) => {
	const timeSeries = generateTimeArray(df)
	let cohortRetention = []
	for (let i = 0; i < timeSeries.length; i++) {
		const currentCohortMonth = timeSeries[i]
		let currentCohortData = {
			[currentCohortMonth]: {}
		}
		for (let j = i; j < (timeSeries.length); j++) {
			const currentMonth = timeSeries[j]
			const currentIndex = (j - i)
			let cohortCount = 0
			let currentMonthCount = 0
			for (let k = 0; k < df.length; k++) {
				const baselineMrrCurrentCustomer = parseFloat(df[k][currentCohortMonth])
				const currentMrrCurrentCustomer = parseFloat(df[k][currentMonth])
				cohortCount += (baselineMrrCurrentCustomer !== 0) ? 1 : 0
				currentMonthCount += ((baselineMrrCurrentCustomer !== 0) && (currentMrrCurrentCustomer !== 0)) ? 1 : 0
			}
			Object.assign(currentCohortData[currentCohortMonth], {[currentIndex] : (cohortCount !== 0) ? (currentMonthCount / cohortCount) : 0})
		}
		cohortRetention.push(currentCohortData)
	}
	return cohortRetention
}

const calculateMetricWithTwoInputsAndWriteToDatabase = async (
	func,
	df1,
	df2,
	company
) => {
	const res = await func(df1, df2)
	const dbRes = await writeMetricToDatabase(func, company, res)
	return dbRes
}

const calculateAllMetricsAndWriteToDatabase = async (df, company) => {
	const metricList = {
		revenue: {
			calculateARPA,
			calculateARR,
			calculateChurnedCustomers,
			calculateChurnedMRR,
			calculateContractionMRR,
			calculateCustomerLifetime,
			calculateCustomers,
			calculateExpansionMRR,
			calculateGrossMrrChurnRate,
			calculateLifetimeValue,
			calculateLogoChurnRate,
			calculateLogoRetentionRate,
			calculateMRR,
			calculateNetDollarRetention,
			calculateNetMrrChurnRate,
			calculateNewCustomers,
			calculateNewMRR,
			calculateQuickRatio,
			calculateCohortRetention
		},
		costs: {
			calculateCAC,
		},
		cash: {
			calculateRunway,
		},
	}
	const dbWriteResponse = await writeUploadedRawDataToDatabase(company, df)
	const dataFromDatabase = await fetchDataFromDatabase(company)
	const revenueDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.revenue_data)
	const costsDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.costs_data)
	const cashDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.cash_data)
	for (let val in metricList.revenue) {
		if (Object.prototype.hasOwnProperty.call(metricList.revenue, val)) {
			const res = await calculateMetricAndWriteToDatabase(
				metricList.revenue[val],
				revenueDataInProcessingFormat,
				company
			)
		}
	}
	for (let val in metricList) {
		if (Object.prototype.hasOwnProperty.call(metricList.costs, val)) {
			const res = await calculateMetricAndWriteToDatabase(
				metricList.costs[val],
				costsDataInProcessingFormat,
				company
			)
		}
	}
	for (let val in metricList) {
		if (Object.prototype.hasOwnProperty.call(metricList.cash, val)) {
			const res = await calculateMetricAndWriteToDatabase(
				metricList.cash[val],
				cashDataInProcessingFormat,
				company
			)
		}
		const res = await calculateMetricWithTwoInputsAndWriteToDatabase(
			calculateCACPaybackPeriod,
			costsDataInProcessingFormat,
			revenueDataInProcessingFormat,
			company
		)
	}
}

module.exports = {
	calculateMRR,
	calculateARR,
	calculateNewMRR,
	calculateChurnedMRR,
	calculateContractionMRR,
	calculateExpansionMRR,
	calculateCustomerLifetime,
	calculateARPA,
	calculateLifetimeValue,
	calculateCustomers,
	calculateNewCustomers,
	calculateChurnedCustomers,
	calculateLogoRetentionRate,
	calculateLogoChurnRate,
	calculateNetDollarRetention,
	calculateCACPaybackPeriod,
	calculateNetMrrChurnRate,
	calculateMetricWithTwoInputsAndWriteToDatabase,
	calculateGrossMrrChurnRate,
	calculateCAC,
	calculateRunway,
	calculateQuickRatio,
	calculateCohortRetention,
	calculateMetricAndWriteToDatabase,
	calculateAllMetricsAndWriteToDatabase,
}