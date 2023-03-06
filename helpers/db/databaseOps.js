var admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
require('dotenv').config()

admin.initializeApp({
	credential: admin.credential.applicationDefault()
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

module.exports = {
	writeOrUpdateDoc,
	deleteDoc
}