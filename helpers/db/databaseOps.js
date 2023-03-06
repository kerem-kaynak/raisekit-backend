var admin = require('firebase-admin')
const { getFirestore } = require('firebase-admin/firestore')
require('dotenv').config()

admin.initializeApp({
	credential: admin.credential.applicationDefault()
})

const db = getFirestore()

const writeOrUpdateDoc = async () => {}

const deleteDoc = async () => {}