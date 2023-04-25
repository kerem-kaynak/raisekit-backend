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
	const monthsSeries = generateTimeArray(df)
	var mrrSeries = []
	monthsSeries.forEach((month) => {
		var mrrSumForCurrentMonth = 0
		for (let i = 0; i < df.length; i++) {
			mrrSumForCurrentMonth += parseFloat(df[i][month])
		}
		const result = { [month]: mrrSumForCurrentMonth }
		mrrSeries.push(result)
	})
	return mrrSeries
}

const calculateARR = async (df) => {
	const mrrSeries = await calculateMRR(df)
	var arrSeries = []
	mrrSeries.forEach((month) => {
		const arrDataPoint = {
			[Object.keys(month)[0]]: 12 * Object.values(month)[0],
		}
		arrSeries.push(arrDataPoint)
	})
	return arrSeries
}

const calculateNewMRR = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var newMrrSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var newMrrSum = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			newMrrSum +=
        previousMrr === 0 && currentMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const newMrrDatapoint = { [currentMonth]: newMrrSum }
		newMrrSeries.push(newMrrDatapoint)
	}
	return newMrrSeries
}

const calculateChurnedMRR = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var churnedMrrSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var churnedMrrSum = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			churnedMrrSum +=
        previousMrr !== 0 && currentMrr === 0 ? currentMrr - previousMrr : 0
		}
		const churnedMrrDatapoint = { [currentMonth]: churnedMrrSum }
		churnedMrrSeries.push(churnedMrrDatapoint)
	}
	return churnedMrrSeries
}

const calculateContractionMRR = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var contractionMrrSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var contractionMrrSum = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			contractionMrrSum +=
        previousMrr > currentMrr && currentMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const contractionMrrDatapoint = { [currentMonth]: contractionMrrSum }
		contractionMrrSeries.push(contractionMrrDatapoint)
	}
	return contractionMrrSeries
}

const calculateExpansionMRR = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var expansionMrrSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		let currentTimeframe
		for (let j = 0; j < df.length; j++) {
			currentTimeframe = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum +=
        previousMrr < currentMrr && previousMrr !== 0 ? currentMrr - previousMrr : 0
		}
		const expansionMrrDatapoint = { [currentTimeframe]: sum }
		expansionMrrSeries.push(expansionMrrDatapoint)
	}
	return expansionMrrSeries
}

const calculateLogoRetentionRate = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var logoRetentionSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var retainedCustomers = 0
		var totalCustomers = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			retainedCustomers += currentMrr !== 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const logoRetentionDatapoint = {
			[currentMonth]:
        totalCustomers !== 0 ? retainedCustomers / totalCustomers : 0,
		}
		logoRetentionSeries.push(logoRetentionDatapoint)
	}
	return logoRetentionSeries
}

const calculateLogoChurnRate = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var logoChurnSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var churnedCustomers = 0
		var totalCustomers = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const logoChurnDatapoint = {
			[currentMonth]:
        totalCustomers !== 0 ? churnedCustomers / totalCustomers : 0,
		}
		logoChurnSeries.push(logoChurnDatapoint)
	}
	return logoChurnSeries
}

const calculateCustomerLifetime = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var customerLifetimeSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var churnedCustomers = 0
		var totalCustomers = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			totalCustomers += previousMrr !== 0 ? 1 : 0
		}
		const customerLifetimeDatapoint = {
			[currentMonth]:
        churnedCustomers !== 0 ? totalCustomers / churnedCustomers : 0,
		}
		customerLifetimeSeries.push(customerLifetimeDatapoint)
	}
	return customerLifetimeSeries
}

const calculateARPA = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var arpaSeries = []
	for (let i = 0; i < monthsSeries.length; i++) {
		var mrr = 0
		var customers = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			mrr += currentMrr
			customers += currentMrr !== 0 ? 1 : 0
		}
		const arpaDatapoint = {
			[monthsSeries[i]]: customers !== 0 ? mrr / customers : 0,
		}
		arpaSeries.push(arpaDatapoint)
	}
	return arpaSeries
}

const calculateLifetimeValue = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var lifetimeValueSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var churnedCustomers = 0
		var lastMonthCustomers = 0
		var mrr = 0
		var currentCustomers = 0
		const currentMonth = monthsSeries[i]
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			lastMonthCustomers += previousMrr !== 0 ? 1 : 0
			mrr += currentMrr
			currentCustomers += currentMrr !== 0 ? 1 : 0
		}
		const lifetimeValueDatapoint = {
			[currentMonth]:
        churnedCustomers !== 0 && currentCustomers !== 0 ? (lastMonthCustomers / churnedCustomers) * (mrr / currentCustomers) : 0,
		}
		lifetimeValueSeries.push(lifetimeValueDatapoint)
	}
	return lifetimeValueSeries
}
const calculateCustomers = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var customersSeries = []
	monthsSeries.forEach((element) => {
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
	const monthsSeries = generateTimeArray(df)
	var newCustomersSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum += previousMrr === 0 && currentMrr !== 0 ? 1 : 0
		}
		const newCustomerDatapoint = { [currentMonth]: sum }
		newCustomersSeries.push(newCustomerDatapoint)
	}
	return newCustomersSeries
}

const calculateChurnedCustomers = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var churnedCustomersSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		let currentMonth
		for (let j = 0; j < df.length; j++) {
			currentMonth = monthsSeries[i]
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum += previousMrr !== 0 && currentMrr === 0 ? -1 : 0
		}
		const churnedCustomerDatapoint = { [currentMonth]: sum }
		churnedCustomersSeries.push(churnedCustomerDatapoint)
	}
	return churnedCustomersSeries
}

const calculateNetDollarRetention = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var netDollarRetentionSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum += previousMrr !== 0 ? currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const netDollarRetentionDatapoint = {
			[monthsSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		netDollarRetentionSeries.push(netDollarRetentionDatapoint)
	}
	return netDollarRetentionSeries
}
const calculateNetMrrChurnRate = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var netMrrChurnRateSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum += previousMrr !== 0 ? previousMrr - currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const netMrrChurnRateDatapoint = {
			[monthsSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		netMrrChurnRateSeries.push(netMrrChurnRateDatapoint)
	}
	return netMrrChurnRateSeries
}

const calculateGrossMrrChurnRate = async (df) => {
	const monthsSeries = generateTimeArray(df)
	var grossMrrChurnRateSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var sum = 0
		var previousSum = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			sum +=
        previousMrr !== 0 && previousMrr > currentMrr ? previousMrr - currentMrr : 0
			previousSum += previousMrr !== 0 ? previousMrr : 0
		}
		const grossMrrChurnRateDatapoint = {
			[monthsSeries[i]]: previousSum !== 0 ? sum / previousSum : 0,
		}
		grossMrrChurnRateSeries.push(grossMrrChurnRateDatapoint)
	}
	return grossMrrChurnRateSeries
}

const calculateCAC = async (df) => {
	const relevantItemsArray = df.filter(
		(item) => item.Name == 'S&M Spend' || item.Name == 'S&M Payroll'
	)
	const monthsSeries = generateTimeArray(relevantItemsArray)
	let cacSeries = []
	for (let i = 0; i < monthsSeries.length; i++) {
		let sum = 0
		for (let j = 0; j < relevantItemsArray.length; j++) {
			const currentCAC = parseFloat(relevantItemsArray[j][monthsSeries[i]])
			sum += currentCAC
		}
		const CACDatapoint = { [monthsSeries[i]]: sum }
		cacSeries.push(CACDatapoint)
	}
	return cacSeries
}

const calculateRunway = async (df) => {
	const monthsSeries = generateTimeArray(df)
	let runwaySeries = []
	for (let i = 0; i < monthsSeries.length; i++) {
		const currentOutflow = parseFloat(df[1][monthsSeries[i]])
		const currentInflow = parseFloat(df[0][monthsSeries[i]])
		const currentNetBurn = currentOutflow - currentInflow
		const runwayDatapoint = {
			[monthsSeries[i]]:
        currentNetBurn >= 0 ? df[2][monthsSeries[i]] / currentNetBurn : 0,
		}
		runwaySeries.push(runwayDatapoint)
	}
	return runwaySeries
}

const calculateCACPaybackPeriod = async (costDf, revenueDf) => {
	const costArray = costDf.filter(
		(item) => item.Name == 'S&M Spend' || item.Name == 'S&M Payroll'
	)
	const monthsSeries = generateTimeArray(costArray)
	let cacSeries = []
	let arpaSeries = []

	for (let i = 0; i < monthsSeries.length; i++) {
		let totalCAC = 0
		let mrr = 0
		let customers = 0

		for (let j = 0; j < costArray.length; j++) {
			const currentCAC = parseFloat(costArray[j][monthsSeries[i]])
			totalCAC += currentCAC
		}
		const CACDatapoint = { [monthsSeries[i]]: totalCAC }
		cacSeries.push(CACDatapoint)

		for (let k = 0; k < revenueDf.length; k++) {
			const currentMrr = parseFloat(revenueDf[k][monthsSeries[i]])
			mrr += currentMrr
			customers += currentMrr !== 0 ? 1 : 0
		}
		const arpaDatapoint = {
			[monthsSeries[i]]: customers !== 0 ? mrr / customers : 0,
		}
		arpaSeries.push(arpaDatapoint)
	}

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
	const monthsSeries = generateTimeArray(df)
	var quickRatioSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		var churnedAndContractionMrr = 0
		var newAndExpansionMrr = 0
		for (let j = 0; j < df.length; j++) {
			const currentMrr = parseFloat(df[j][monthsSeries[i]])
			const previousMrr = parseFloat(df[j][monthsSeries[i - 1]])
			churnedAndContractionMrr +=
        (previousMrr !== 0) && (previousMrr > currentMrr) ? (previousMrr - currentMrr) : 0
			newAndExpansionMrr +=
        previousMrr < currentMrr ? (currentMrr - previousMrr) : 0
		}
		const quickRatioDatapoint = {
			[monthsSeries[i]]: (churnedAndContractionMrr !== 0)
				? (newAndExpansionMrr / churnedAndContractionMrr)
				: 0
		}
		quickRatioSeries.push(quickRatioDatapoint)
	}
	return quickRatioSeries
}

const calculateLtvCACRatio = async (dfRevenue, dfCosts) => {
	const monthsSeries = generateTimeArray(dfRevenue)
	const relevantItemsArray = dfCosts.filter(
		(item) => item.Name == 'S&M Spend' || item.Name == 'S&M Payroll'
	)
	var lifetimeValueCACRatioSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		let CACSum = 0
		var churnedCustomers = 0
		var lastMonthCustomers = 0
		var mrr = 0
		var currentCustomers = 0
		const currentMonth = monthsSeries[i]
	
		for (let j = 0; j < dfRevenue.length; j++) {
			const currentMrr = parseFloat(dfRevenue[j][monthsSeries[i]])
			const previousMrr = parseFloat(dfRevenue[j][monthsSeries[i - 1]])
			churnedCustomers += currentMrr === 0 && previousMrr !== 0 ? 1 : 0
			lastMonthCustomers += previousMrr !== 0 ? 1 : 0
			mrr += currentMrr
			currentCustomers += currentMrr !== 0 ? 1 : 0
		}
		for (let k = 0; k < relevantItemsArray.length; k++) {
			const currentCAC = parseFloat(relevantItemsArray[k][monthsSeries[i]])
			CACSum += currentCAC
		}
		const lifetimeValueDatapoint = (churnedCustomers !== 0 && currentCustomers !== 0) ? (lastMonthCustomers / churnedCustomers) * (mrr / currentCustomers) : 0
		const CACDatapoint = CACSum
		const lifetimeValueCACRatioDatapoint = {
			[currentMonth]: CACDatapoint !== 0 ? lifetimeValueDatapoint / CACDatapoint : 0
		} 
		lifetimeValueCACRatioSeries.push(lifetimeValueCACRatioDatapoint)
	}
	return lifetimeValueCACRatioSeries
} 

const calculateCohortRetention = async (df) => {
	const monthsSeries = generateTimeArray(df)
	let cohortRetention = []
	for (let i = 0; i < monthsSeries.length; i++) {
		const currentCohortMonth = monthsSeries[i]
		let currentCohortData = {
			[currentCohortMonth]: {}
		}
		for (let j = i; j < (monthsSeries.length); j++) {
			const currentMonth = monthsSeries[j]
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

const calculateBurnMultiple = async (dfRevenue, dfCash) => {
	const monthsSeries = generateTimeArray(dfRevenue)
	const cashRelevantData = dfCash.filter(element => element.Name == 'Cash Balance')
	let burnMultipleSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		let netArrSum = 0
		for (let j = 0; j < dfRevenue.length; j++) {
			netArrSum += 12 * (parseFloat(dfRevenue[j][monthsSeries[i]]) - parseFloat(dfRevenue[j][monthsSeries[i-1]]))
		}
		const netBurnSum = cashRelevantData[0][monthsSeries[i]] - cashRelevantData[0][monthsSeries[i - 1]]
		const burnMultipleDatapoint = {[monthsSeries[i]]: (netBurnSum !== 0) ? (netArrSum / netBurnSum) : 0}
		burnMultipleSeries.push(burnMultipleDatapoint)
	}
	return burnMultipleSeries
}

const calculateNetBurn = async (df) => {
	const monthsSeries = generateTimeArray(df)
	const inflowData = df.filter(element => element.Name == 'Cash Inflow excluding Financing')
	const outflowData = df.filter(element => element.Name == 'Cash Outflow')
	let netBurnSeries = []
	for (let i = 0; i < monthsSeries.length; i++) {
		const netBurnSum = inflowData[0][monthsSeries[i]] - outflowData[0][monthsSeries[i]]
		const netBurnDatapoint = {[monthsSeries[i]]: netBurnSum}
		netBurnSeries.push(netBurnDatapoint)
	}
	return netBurnSeries
}

const calculateMagicNumber = async (dfRevenue, dfCosts) => {
	const monthsSeries = generateTimeArray(dfRevenue)
	const costRelevantData = dfCosts.filter((item) => item.Name == 'S&M Spend' || item.Name == 'S&M Payroll')
	let magicNumberSeries = []
	for (let i = 1; i < monthsSeries.length; i++) {
		let netNewArrSum = 0
		let cacSum = 0
		for (let j = 0; j < dfRevenue.length; j++) {
			netNewArrSum += 12 * (parseFloat(dfRevenue[j][monthsSeries[i]]) - parseFloat(dfRevenue[j][monthsSeries[i-1]]))
		}
		for (let k = 0; k < costRelevantData.length; k++) {
			cacSum += costRelevantData[k][monthsSeries[i]]
		}
		const magicNumberDatapoint = {[monthsSeries[i]]: (cacSum !== 0) ? (netNewArrSum / cacSum) : 0}
		magicNumberSeries.push(magicNumberDatapoint)
	}
	return magicNumberSeries
}

const calculateMetricWithTwoInputsAndWriteToDatabase = async (func, df1, df2, company) => {
	const metricCalculationResult = await func(df1, df2)
	const databaseWriteOperationResult = await writeMetricToDatabase(func, company, metricCalculationResult)
	return databaseWriteOperationResult
}

const calculateAllMetricsAndWriteToDatabase = async (df, company) => {
	const metricList = {
		revenue: [
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
		],
		costs: [
			calculateCAC,
		],
		cash: [
			calculateRunway,
			calculateNetBurn,
		],
	}
	await writeUploadedRawDataToDatabase(company, df)
	const dataFromDatabase = await fetchDataFromDatabase(company)
	const revenueDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.revenue_data)
	const costsDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.costs_data)
	const cashDataInProcessingFormat =
    await convertDatabaseDataToProcessingFormat(dataFromDatabase.cash_data)
	for (let val in metricList.revenue) {
		await calculateMetricAndWriteToDatabase(
			metricList.revenue[val],
			revenueDataInProcessingFormat,
			company
		)
	}
	for (let val in metricList.costs) {
		await calculateMetricAndWriteToDatabase(
			metricList.costs[val],
			costsDataInProcessingFormat,
			company
		)
	}
	for (let val in metricList.cash) {
		await calculateMetricAndWriteToDatabase(
			metricList.cash[val],
			cashDataInProcessingFormat,
			company
		)
	}
	await calculateMetricWithTwoInputsAndWriteToDatabase(
		calculateCACPaybackPeriod,
		costsDataInProcessingFormat,
		revenueDataInProcessingFormat,
		company
	)
	await calculateMetricWithTwoInputsAndWriteToDatabase(
		calculateLtvCACRatio,
		revenueDataInProcessingFormat,
		costsDataInProcessingFormat,
		company
	)
	await calculateMetricWithTwoInputsAndWriteToDatabase(
		calculateBurnMultiple,
		revenueDataInProcessingFormat,
		cashDataInProcessingFormat,
		company
	)
	await calculateMetricWithTwoInputsAndWriteToDatabase(
		calculateMagicNumber,
		revenueDataInProcessingFormat,
		costsDataInProcessingFormat,
		company
	)
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
	calculateMetricAndWriteToDatabase,
	calculateAllMetricsAndWriteToDatabase,
	calculateLtvCACRatio,
	calculateCohortRetention,
	calculateBurnMultiple,
	calculateNetBurn,
	calculateMagicNumber,
	writeMetricToDatabase,
	writeUploadedRawDataToDatabase,
	generateTimeArray
}