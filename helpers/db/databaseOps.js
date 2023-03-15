var admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
const { convertUploadedDataToDatabaseFormat } = require('../metrics/dataHandlers')
require('dotenv').config()

admin.initializeApp({
	credential: admin.credential.cert('./serviceAccountCreds.json')
})

const db = getFirestore()

const writeOrUpdateDoc = async (data) => {
	const newEntryRef = db.collection('Test Collection').doc('Test Doc') //todo: pass collection and doc name as parameters
	await newEntryRef.set(data)
}

const deleteDoc = async () => {
	const newEntryRef = db.collection('Test Collection').doc('Test Doc')
	await newEntryRef.delete()
}

const writeUploadedRawDataToDatabase = async (company, body) => {
	const fieldNames = {
		'revenue': 'revenue_data',
		'costs': 'costs_data',
		'cash': 'cash_data'
	}
	const formattedData = await convertUploadedDataToDatabaseFormat(body.data)
	const res = await db.collection('companies').doc(company).update({
		[fieldNames[body.type]]: formattedData
	})
	return res
}

const fetchDataFromDatabase = async (company) => {
	const fetchedData = await (await db.collection('companies').doc(company).get()).data()
	return fetchedData
}

module.exports = {
	writeOrUpdateDoc,
	deleteDoc,
	writeUploadedRawDataToDatabase,
	fetchDataFromDatabase
}