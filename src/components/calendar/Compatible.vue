<template>
    <div class="calendar-sub-page has-text-centered">
        <h3 class="title is-5">Self Analyze Calendar</h3>

        <div class="birth-input-section box">
            <label class="label">My Birth Date/Time</label>
            <BirthDateInput v-model="myBirthDate" />

            <label class="label mt-4">Your Birth Date/Time</label>
            <BirthDateInput v-model="yourBirthDate" />

            <p v-if="validationError" class="help is-danger has-text-centered mt-3">
                {{ validationError }}
            </p>

            <div class="control mt-5 has-text-centered is-justify-content-space-around is-flex">
                <button class="button is-primary" @click="clear">Clear</button>
                <button class="button is-primary" @click="checkCompatible">Check Compatible</button>
            </div>
        </div>
    </div>
</template>

<script>
import BirthDateInput from '@/components/common/BirthDateInput.vue'
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { isValid } from 'date-fns'

export default {
    name: 'SelfAnalyze',
    components: {
        BirthDateInput,
    },
    data() {
        return {
            myBirthDate: 620109120000,
            yourBirthDate: 702215880000,
            validationError: '',
        }
    },
    methods: {
        checkCompatible() {
            if (!this.myBirthDate || !this.yourBirthDate) {
                this.validationError = 'Please select both birth date and time.'
                return
            }

            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = false

            const myBirthDate = toDate(this.myBirthDate, { timeZone })
            const yourBirthDate = toDate(this.yourBirthDate, { timeZone })

            if (!isValid(myBirthDate) || !isValid(yourBirthDate)) {
                this.validationError = 'Invalid Date constructed.'
                return
            }

            const myCalculator = new BaziCalculator(myBirthDate, gender, timeZone, isTimeKnown)
            const yourCalculator = new BaziCalculator(yourBirthDate, gender, timeZone, isTimeKnown)

            const myAnalysis = myCalculator.getCompleteAnalysis()
            const yourAnalysis = yourCalculator.getCompleteAnalysis()

            if (!myAnalysis || !yourAnalysis) {
                this.validationError = 'Analysis Error.'
                return
            }

            console.log('my analysis')
            console.log(myAnalysis)

            console.log('your analysis')
            console.log(yourAnalysis)
        },
        clear() {
            this.myBirthDate = null
            this.validationError = ''
        },
    },
}
</script>
<style scoped lang="scss">
.birth-input-section {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
}
</style>
