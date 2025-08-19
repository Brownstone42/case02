import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { collection, doc, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore'
import { parse } from 'date-fns'

export const useDataStore = defineStore('data', {
    state: () => ({
        isSavingData: false,
        lastError: null,
    }),
    actions: {
        async addBaZiResults(results) {
            this.isSavingData = true // Set loading state
            this.lastError = null // Clear previous errors

            if (!results || results.length === 0) {
                this.lastError = 'No results to save.'
                this.isSavingData = false
                console.error('Error: No results to save.')
                return false
            }

            if (results.length > 500) {
                console.warn(
                    `Attempting to save ${results.length} documents. Firestore batch operations are limited to 500. This will only save the first 500.`,
                )
                // For production, you'd implement logic to split into multiple batches here.
            }

            const batch = writeBatch(db)
            const baziDataCollection = collection(db, 'col_bazi_data')

            try {
                results.forEach((item, index) => {
                    let calendarTimestampForDocument = null
                    const dateString = item.Calendar_Date // e.g., '01/01/1980'
                    const timeString = item.Calendar_Time // e.g., '00:30'
                    const fullDateTimeString = `${dateString} ${timeString}`
                    const parsedDate = parse(fullDateTimeString, 'dd/MM/yyyy HH:mm', new Date())

                    calendarTimestampForDocument = Timestamp.fromDate(parsedDate)

                    const docData = {
                        ...item,
                        Calendar_TimeStamp: calendarTimestampForDocument,
                        created: serverTimestamp(), // Add server timestamp to EACH document
                    }

                    batch.set(doc(baziDataCollection), docData)
                })

                await batch.commit()
                console.log(
                    `Successfully added ${results.length} documents to 'col_bazi_data' via batch write.`,
                )
                return true
            } catch (e) {
                console.error('Error adding document to Firestore: ', e)
                this.lastError = e.message
                throw e
            } finally {
                this.isSavingData = false
            }
        },
    },
})
