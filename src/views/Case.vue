<template>
    <div class="wrap section">
        <h1 class="title is-2 has-text-centered mb-5">Your BaZi Case</h1>

        <div class="birth-input-section box">
            <p class="subtitle is-4 mb-4">Enter Your Birth Details:</p>

            <BirthDateInput
                v-model:birthDate="selectedBirthDate"
                v-model:birthTime="selectedBirthTime"
            />

            <p v-if="validationError" class="help is-danger has-text-centered mt-3">
                {{ validationError }}
            </p>

            <div class="control mt-5 has-text-centered is-justify-content-space-around is-flex">
                <button class="button is-primary" @click="handleCalculateBaZi">
                    Calculate My BaZi
                </button>

                <button class="button is-primary" @click="library">Library</button>

                <button class="button is-primary" @click="clear">Clear</button>
            </div>
        </div>

        <div v-if="pillars.dayCode" class="bazi-result-container box mt-0">
            <BaZiResultDisplay :pillars="pillars" />

            <div class="has-text-centered mt-4">
                <button class="button is-primary is-large is-rounded" @click="showProduct">
                    Show Products
                </button>
            </div>
        </div>

        <div v-if="showProductDisplay" class="product-display-container mt-0">
            <ProductDisplay />
        </div>
    </div>
</template>

<script>
import { loadCutoffDataFromURL } from '@/utils/loadCutoff'
import { calculatePillar } from '@/utils/luckEngine'
import BirthDateInput from '@/components/product/BirthDateInput.vue'
import BaZiResultDisplay from '@/components/product/BaZiResultDisplay.vue'
import ProductDisplay from '@/components/product/ProductDisplay.vue'

import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { isValid } from 'date-fns'

export default {
    name: 'Product',
    components: {
        BirthDateInput,
        BaZiResultDisplay,
        ProductDisplay,
    },
    async created() {
        if (!this.cutoffLoaded) {
            const data = await loadCutoffDataFromURL('/data/cutoff-data.xlsx')

            this.yearCutoff = data.yearCutoff
            this.monthCutoffDay = data.monthCutoffDay
            this.cutoffLoaded = true
        }
    },
    data() {
        return {
            selectedBirthDate: 620076600000, // Will store the date from BirthDateInput
            selectedBirthTime: 1752985800000, // Will store the time from BirthDateInput
            validationError: '', // Stores any validation error message

            pillars: {},
            showProductDisplay: false,

            cutoffLoaded: false,
            yearCutoff: {},
            monthCutoffDay: {},
            startDate: '15/04/1924',
            dayCode: 1,
            monthCode: 5,
            yearCode: 1,
            element: [
                'Wood+',
                'Wood-',
                'Fire+',
                'Fire-',
                'Earth+',
                'Earth-',
                'Metal+',
                'Metal-',
                'Water+',
                'Water-',
            ],
            zodiac: [
                'Rat',
                'Ox',
                'Tiger',
                'Rabbit',
                'Dragon',
                'Snake',
                'Horse',
                'Goat',
                'Monkey',
                'Rooster',
                'Dog',
                'Pig',
            ],
        }
    },
    computed: {
        config() {
            return {
                startDate: this.startDate,
                dayCode: this.dayCode,
                monthCode: this.monthCode,
                yearCode: this.yearCode,
                yearCutoff: this.yearCutoff,
                monthCutoffDay: this.monthCutoffDay,
                element: this.element,
                zodiac: this.zodiac,
            }
        },
    },
    methods: {
        clear() {
            this.pillars = {}
            this.showProductDisplay = false
        },
        showProduct() {
            this.showProductDisplay = true
        },
        library() {
            this.validationError = ''
            this.showBaZiResult = false

            if (!this.selectedBirthDate || !this.selectedBirthTime) {
                this.validationError = 'Please select both your birth date and time.'
                return
            }

            const year = 1989
            const month = 8
            const day = 26
            const hour = 11
            const minute = 32
            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = true

            const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
            const birthDate = toDate(dateString, { timeZone })

            if (!isValid(birthDate)) {
                console.error('Invalid Date constructed. Check inputs and timezone.')
                // Handle error appropriately
            } else {
                // 3. Instantiate the Calculator
                // Gender normalizes internally: non-'male' inputs become 'female' for calculations
                const calculator = new BaziCalculator(birthDate, gender, timeZone, isTimeKnown)

                // 4. Get the Complete Analysis
                const analysis = calculator.getCompleteAnalysis()

                if (analysis) {
                    console.log('--- Four Pillars (Simple) ---')
                    console.log(analysis.mainPillars)
                    // Example: { year: {...}, month: {...}, day: {...}, time: {...} }

                    console.log('\n--- Luck Pillars Summary ---')
                    if (analysis.luckPillars) {
                        console.log(
                            `Direction: ${analysis.luckPillars.incrementRule === 1 ? 'Forward' : 'Backward'}`,
                        )
                        console.log(`Timing Known: ${analysis.luckPillars.isTimingKnown}`)
                        console.log(
                            `Start Age: ${analysis.luckPillars.startAgeYears}y ${analysis.luckPillars.startAgeMonths}m ${analysis.luckPillars.startAgeDays}d`,
                        )
                    }

                    console.log('\n--- Basic Analysis ---')
                    console.log(analysis.basicAnalysis)

                    console.log('\n--- Chart String ---')
                    console.log(calculator.toString()) // Output: 乙亥年 壬午月 庚午日 丁亥時
                }
            }
        },
        handleCalculateBaZi() {
            this.validationError = ''
            this.showBaZiResult = false

            if (!this.selectedBirthDate || !this.selectedBirthTime) {
                this.validationError = 'Please select both your birth date and time.'
                return
            }

            const result = calculatePillar(
                this.selectedBirthDate,
                this.selectedBirthTime,
                this.config,
            )

            this.pillars = result
        },
    },
}
</script>

<style scoped lang="scss">
div.wrap {
    margin-top: 4rem;
    padding: 1.5rem 0;
}

.birth-input-section {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
}

.bazi-result-container {
    max-width: 800px; /* Example width for the result section */
    margin: 3rem auto; /* Center it with some top margin */
    padding: 2rem;
}

.product-display-container {
    padding: 2rem;
}
</style>
