<template>
    <div class="calendar-sub-page has-text-centered">
        <h3 class="title is-5">Self Analyze Calendar</h3>

        <div class="birth-input-section box">
            <label class="label">My Birth Date/Time</label>
            <BirthDateInput v-model="myBirthDate" />

            <p v-if="validationError" class="help is-danger has-text-centered mt-3">
                {{ validationError }}
            </p>

            <div class="control mt-5 has-text-centered is-justify-content-space-around is-flex">
                <button class="button is-primary" @click="clear">Clear</button>
                <button class="button is-primary" @click="calculateBaZi">Calculate My BaZi</button>
                <button class="button is-primary" @click="dailyAnalysis">Daily Analysis</button>
                <button class="button is-primary" @click="getReport">Report</button>
            </div>
        </div>
    </div>
</template>

<script>
import BirthDateInput from '@/components/common/BirthDateInput.vue'
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'
import { getConfig } from '@/utils/config'
import { toDate, formatInTimeZone } from 'date-fns-tz'
import { parse, addHours, isBefore, isValid } from 'date-fns'
import { calculateDominantElementScores, calculateZodiacCombo } from '@/utils/luckEngine'
import * as XLSX from 'xlsx'

export default {
    name: 'SelfAnalyze',
    components: {
        BirthDateInput,
    },
    data() {
        return {

            myBirthDate: -276358800000, // pure dad
            //myBirthDate: 618817800000, //pure
            //myBirthDate: 696145380000, //june
            //myBirthDate: 620109120000, //ta
            //myBirthDate: 702215880000, //brown
            //yourBirthDate: 702215880000,
            validationError: '',
        }
    },
    methods: {
        exportToExcel(results, from, to) {
            const worksheet = XLSX.utils.json_to_sheet(results)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, `${from}-${to}`)
            XLSX.writeFile(workbook, `Analysis_${from}-${to}.xlsx`)
        },
        async getReport() {
            const config = await getConfig()

            let currentStartDateString = '01/01/1980 01:30'
            const endDateString = '01/02/1980 01:30'

            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = true

            const parsedEndDate = parse(endDateString, 'dd/MM/yyyy HH:mm', new Date())
            const finalEndDate = toDate(parsedEndDate, { timeZone })

            let currentParsedDate = parse(currentStartDateString, 'dd/MM/yyyy HH:mm', new Date())
            let currentDateTime = toDate(currentParsedDate, { timeZone })

            let iteration = 0
            const report = []
            const excelReport = []

            while (isBefore(currentDateTime, finalEndDate)) {
                const myCalculator = new BaziCalculator(
                    currentDateTime,
                    gender,
                    timeZone,
                    isTimeKnown,
                )

                /*const myPillar = myCalculator.calculatePillars()
                const myBasicAnalysis = myCalculator.calculateBasicAnalysis()*/

                const myCompleteAnalysis = myCalculator.getCompleteAnalysis()

                const pillar = myCompleteAnalysis.mainPillars
                const analysis = myCompleteAnalysis.basicAnalysis
                const luck = myCompleteAnalysis.luckPillars

                const myScore = calculateDominantElementScores(pillar, config)
                const myZodiac = calculateZodiacCombo(pillar, config)
                //console.log(zodiac)

                //return

                const reportRow = {
                    pillar,
                    analysis,
                    score: myScore,
                    luck,
                }

                const favoriteString = analysis.favorableElements.primary.join(', ')
                const unfavoriteString = analysis.favorableElements.unfavorable.join(', ')

                const elementCountString = Object.entries(myScore.elementCounts)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')

                const finalScoreString = Object.entries(myScore.finalScores)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')

                const formatZodiac = (zodiacs) => {
                    if (!zodiacs || zodiacs.length === 0) {
                        return ''
                    }
                    return zodiacs.map((pair) => pair.join('-')).join(', ')
                }

                const row1 = {
                    Date: formatInTimeZone(currentDateTime, timeZone, 'yyyy-MM-dd HH:mm'),
                    Year: pillar.year.element,
                    Month: pillar.month.element,
                    Day: pillar.day.element,
                    Time: pillar.time.element,
                    'Favorite/Unfavorite': favoriteString,
                    'Count/Score': elementCountString,
                    'Hex/Tri/Clash': formatZodiac(myZodiac.hexZodiac),
                }
                excelReport.push(row1)

                const row2 = {
                    Date: null,
                    Year: pillar.year.branch.element,
                    Month: pillar.month.branch.element,
                    Day: pillar.day.branch.element,
                    Time: pillar.time.branch.element,
                    'Favorite/Unfavorite': unfavoriteString,
                    'Count/Score': finalScoreString,
                    'Hex/Tri/Clash': formatZodiac(myZodiac.triZodiac),
                }
                excelReport.push(row2)

                const row3 = {
                    Date: null,
                    Year: pillar.year.animal,
                    Month: pillar.month.animal,
                    Day: pillar.day.animal,
                    Time: pillar.time.animal,
                    'Favorite/Unfavorite': null,
                    'Count/Score': null,
                    'Hex/Tri/Clash': formatZodiac(myZodiac.clashZodiac),
                }
                excelReport.push(row3)

                const row4 = {}
                excelReport.push(row4)

                report.push(reportRow)

                currentParsedDate = addHours(currentParsedDate, 2)
                currentDateTime = toDate(currentParsedDate, { timeZone })

                iteration++

                if (iteration > 500) {
                    console.warn('Loop exceeded 500 iterations, breaking to prevent infinite loop.')
                    break
                }
            }
            console.log(report)
            console.log(excelReport)

            const shortenedFrom = currentStartDateString.split(' ')[0].replace(/\//g, '-')
            const shortenedTo = endDateString.split(' ')[0].replace(/\//g, '-')

            this.exportToExcel(excelReport, shortenedFrom, shortenedTo)
        },
        async calculateBaZi() {
            const config = await getConfig()

            if (!this.myBirthDate) {
                this.validationError = 'Please select your birth date and time.'
                return
            }

            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = false

            const myBirthDate = toDate(this.myBirthDate, { timeZone })

            if (!isValid(myBirthDate)) {
                this.validationError = 'Invalid Date constructed.'
                return
            }

            const myCalculator = new BaziCalculator(myBirthDate, gender, timeZone, isTimeKnown)
            const myCompleteAnalysis = myCalculator.getCompleteAnalysis()

            if (!myCompleteAnalysis) {
                this.validationError = 'Analysis Error.'
                return
            }

            console.log(myCompleteAnalysis)

            const finalScores = calculateDominantElementScores(
                myCompleteAnalysis.mainPillars,
                config,
            )

            console.log(finalScores)
        },
        async dailyAnalysis() {
            const config = await getConfig()

            if (!this.myBirthDate || !this.yourBirthDate) {
                this.validationError = 'Please select both birth date and time.'
                return
            }

            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = true

            const birthDate = toDate(this.myBirthDate, { timeZone })

            if (!isValid(birthDate)) {
                this.validationError = 'Invalid My Date constructed.'
                return
            }

            const calculator = new BaziCalculator(birthDate, gender, timeZone, isTimeKnown)

            const targetDateString = toDate(this.yourBirthDate, { timeZone })
            const targetDate = toDate(targetDateString, { timeZone })

            const generalDailyAnalysis = calculator.getAnalysisForDate(targetDate, timeZone, {
                type: 'general',
            })

            const personalizedDailyAnalysis = calculator.getAnalysisForDate(targetDate, timeZone, {
                type: 'personalized',
            })

            if (!generalDailyAnalysis || !personalizedDailyAnalysis) {
                this.validationError = 'Daily Analysis Error.'
                return
            }

            console.log(generalDailyAnalysis)
            console.log(personalizedDailyAnalysis)
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
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
}
</style>
