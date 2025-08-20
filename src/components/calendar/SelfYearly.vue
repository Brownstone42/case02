<template>
    <div class="calendar-sub-page has-text-centered">
        <h3 class="title is-5">Self Yearly Calendar</h3>

        <div class="birth-input-section box">
            <label class="label">My Birth Date/Time</label>
            <BirthDateNoTimeInput v-model="myBirthDate" />
            <label class="label mt-2">From</label>
            <Datepicker v-model="fromYear" year-picker />
            <label class="label mt-2">To</label>
            <Datepicker v-model="toYear" year-picker />

            <p v-if="validationError" class="help is-danger has-text-centered mt-3">
                {{ validationError }}
            </p>

            <div class="control mt-5 has-text-centered is-justify-content-space-around is-flex">
                <button class="button is-primary" @click="clear">Clear</button>
                <button class="button is-primary" @click="getYearlyCalendar()">My Calendar</button>
            </div>
        </div>

        <display-calendar 
            :results="results" 
            :from-year="fromYearNumber" 
            :to-year="toYearNumber"
            v-if="results.length > 0">
        </display-calendar>
    </div>
</template>
<script>
import { getConfig } from '@/utils/config'

import BirthDateInput from '@/components/common/BirthDateInput.vue'
import BirthDateNoTimeInput from '@/components/common/BirthDateNoTimeInput.vue'
import DisplayCalendar from '@/components/common/DisplayCalendar.vue'

import { toDate, formatInTimeZone } from 'date-fns-tz'
import { parse, addHours, isBefore, isValid, subDays, addDays, format } from 'date-fns'

import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'
import Datepicker from '@vuepic/vue-datepicker'

export default { 
    name: 'SelfYearly',
    components: {
        BirthDateInput,
        BirthDateNoTimeInput,
        DisplayCalendar,
        Datepicker
    },
    data() {
        return {
            myBirthDate: 620109120000,
            partnerBirthDate: 618817800000,
            validationError: '',
            isLoading: false,
            fromYear: 2025,
            toYear: 2026,
            fromMonth: '01',
            toMonth: '01',
            self: '26/08/1989',
            results: [],
            gender: 'male',
            timeZone: 'Asia/Bangkok',
            isTimeKnown: false
        }
    },
    computed: {
        fromYearNumber() {
            if (this.fromYear instanceof Date) {
                return this.fromYear.getFullYear();
            }
            return this.fromYear; // Assumes it's a number if not a Date object
        },
        toYearNumber() {
            if (this.toYear instanceof Date) {
                return this.toYear.getFullYear();
            }
            return this.toYear; // Assumes it's a number if not a Date object
        },
    },
    methods: {
        clear() {
            this.results = []
        },
        async getYearlyCalendar() {
            console.log('start getYearlyCalendar')
            this.isLoading = true
            const config = await getConfig()

            const requiredYears = Array.from({ length: this.toYear - this.fromYear }, (_, i) =>
                String(this.fromYear + i),
            )

            //console.log(requiredYears)

            const missing = requiredYears.filter((y) => !config.yearCutoff?.[y])

            if (missing.length) {
                console.log(`Missing yearCutoff for: ${missing.join(', ')}`)
                this.isLoading = false
                return
            }

            const datePart = formatInTimeZone(this.myBirthDate, this.timeZone, 'yyyy-MM-dd')
            const datePart2 = formatInTimeZone(this.partnerBirthDate, this.timeZone, 'yyyy-MM-dd')

            const hardcodedTimeString = ' 12:00:00'

            const newDateString = datePart + hardcodedTimeString
            const newDateString2 = datePart2 + hardcodedTimeString

            const newDateObject = parse(newDateString, 'yyyy-MM-dd HH:mm:ss', new Date())
            const newDateObject2 = parse(newDateString2, 'yyyy-MM-dd HH:mm:ss', new Date())

            const myBirthDate = toDate(newDateObject, this.timeZone)
            const partnerBirthDate = toDate(newDateObject2, this.timeZone)

            const myCalculatorNoTime = new BaziCalculator(myBirthDate, this.gender, this.timeZone, false)
            const myCompleteAnalysisNoTime = myCalculatorNoTime.getCompleteAnalysis()

            const partnerCalculatorNoTime = new BaziCalculator(partnerBirthDate, this.gender, this.timeZone, false)
            const partnerCompleteAnalysisNoTime = partnerCalculatorNoTime.getCompleteAnalysis()

            //const myCalculator = new BaziCalculator(myBirthDate, this.gender, this.timeZone, true)
            //const myCompleteAnalysis = myCalculator.getCompleteAnalysis()

            //console.log(myCompleteAnalysisNoTime)
            //console.log(myCompleteAnalysis)

            const favorite = myCompleteAnalysisNoTime.basicAnalysis.favorableElements.primary
            const unfavorite = myCompleteAnalysisNoTime.basicAnalysis.favorableElements.unfavorable
            const dayMaster = myCompleteAnalysisNoTime.basicAnalysis.dayMaster
            const dayMasterStrength = myCompleteAnalysisNoTime.basicAnalysis.dayMasterStrength
            const pillar = myCompleteAnalysisNoTime.mainPillars

            const selfData = {
                favorite,
                unfavorite,
                dayMaster,
                dayMasterStrength,
                pillar
            }

            const favorite2 = partnerCompleteAnalysisNoTime.basicAnalysis.favorableElements.primary
            const unfavorite2 = partnerCompleteAnalysisNoTime.basicAnalysis.favorableElements.unfavorable
            const dayMaster2 = partnerCompleteAnalysisNoTime.basicAnalysis.dayMaster
            const dayMasterStrength2 = partnerCompleteAnalysisNoTime.basicAnalysis.dayMasterStrength
            const pillar2 = partnerCompleteAnalysisNoTime.mainPillars

            const partnerData = {
                favorite2,
                unfavorite2,
                dayMaster2,
                dayMasterStrength2,
                pillar2
            }

            //console.log(self)

            let current = parse(`01/${this.fromMonth}/${this.fromYear} 12:00`, 'dd/MM/yyyy HH:mm', new Date())
            const end = subDays(parse(`01/${this.toMonth}/${this.toYear} 12:00`, 'dd/MM/yyyy HH:mm', new Date()), 1)
            const results = []

            while (current <= end) {
                //console.log(current)

                const currentCalculator = new BaziCalculator(current, this.gender, this.timeZone, false)
                const currentAnalysis = currentCalculator.getCompleteAnalysis()

                const currentMain = currentAnalysis.mainPillars
                const currentPillar = currentAnalysis.detailedPillars

                //console.log(currentPillar)
                                    
                const yearElement = [currentPillar.year.heavenlyStem.elementType, ...currentPillar.year.earthlyBranch.hiddenStems.map(stem => stem.elementType)]
                const monthElement = [currentPillar.month.heavenlyStem.elementType, ...currentPillar.month.earthlyBranch.hiddenStems.map(stem => stem.elementType)]
                const dayElement = [currentPillar.day.heavenlyStem.elementType, ...currentPillar.day.earthlyBranch.hiddenStems.map(stem => stem.elementType)]

                const allElement  = [...yearElement, ...monthElement, ...dayElement]
                
                const favoriteCount = allElement.filter(element => favorite.includes(element)).length
                const unfavoriteCount = allElement.filter(element => unfavorite.includes(element)).length

                const favoriteCount2 = allElement.filter(element => favorite2.includes(element)).length
                const unfavoriteCount2 = allElement.filter(element => unfavorite2.includes(element)).length

                const zodiacCount = this.countZodiacRelationships(selfData.pillar, currentMain, config)

                results.push({
                    Self_Date: datePart,
                    Calendar_Date: formatInTimeZone(current, this.timeZone, 'yyyy-MM-dd'),
                    selfData,
                    partnerData,
                    favoriteCount,
                    unfavoriteCount,
                    favoriteCount2,
                    unfavoriteCount2,
                    currentData: {
                        yearElement,
                        monthElement,
                        dayElement
                    },
                    currentPillar,
                    zodiacCount
                })

                current = addDays(current, 1)
            }

            this.isLoading = false
            console.log(results)
            this.results = results
        },
        countZodiacRelationships(self, current, config) {
            const isLH = (sign1, sign2) => {
                return config.zodiacLHMap[sign1] === sign2
            }

            const isCL = (sign1, sign2) => {
                return config.zodiacClashMap[sign1] === sign2
            }

            const isSH = (sign1, sign2, sign3) => {
                const sortedSigns = [sign1, sign2, sign3].sort()
                const partners = config.zodiacSHMap[sortedSigns[0]]
                return (
                    partners &&
                    partners.includes(sortedSigns[1]) &&
                    partners.includes(sortedSigns[2])
                )
            }

            const countZodiacBooleans = (resultsObject) => {
                let triCount = 0;
                let hexCount = 0;
                let clashCount = 0;

                let cyCount = 0; //clash year
                let cmCount = 0;
                let cdCount = 0;
                let csCount = 0; //clash self

                let hyCount = 0; //hex year
                let hmCount = 0;
                let hdCount = 0;
                let hsCount = 0; //hex self

                let tyCount = 0; //tri year
                let tmCount = 0;
                let tdCount = 0;
                let tsCount = 0; //tri self


                for (const key in resultsObject) {
                    if (resultsObject.hasOwnProperty(key) && resultsObject[key] === true) {
                        if (key.startsWith('Bool_LH_')) {
                            //hexCount++;
                            if (key.endsWith('_Current_Year')) {
                                hyCount++;
                            } else if (key.endsWith('_Current_Month')) {
                                hmCount++;
                            } else if (key.endsWith('_Current_Day')) {
                                hdCount++
                            } else {
                                hsCount++
                            }
                        }
                        else if (key.startsWith('Bool_CL_')) {
                            //clashCount++;
                            if (key.endsWith('_Current_Year')) {
                                cyCount++;
                            } else if (key.endsWith('_Current_Month')) {
                                cmCount++;
                            } else if (key.endsWith('_Current_Day')) {
                                cdCount++
                            } else {
                                csCount++
                            }
                        }
                        else if (key.startsWith('Bool_SH_')) {
                            //triCount++;
                            if (key.endsWith('_Current_Year')) {
                                tyCount++;
                            } else if (key.endsWith('_Current_Month') || key.endsWith('_Year_Month')) {
                                tmCount++;
                            } else if (key.endsWith('_Current_Day') || key.endsWith('_Year_Day') || key.endsWith('_Month_Day')) {
                                tdCount++
                            } else {
                                tsCount++
                            }
                        }
                    }
                }

                let clCrucial, clImportant, clNormal, clSelf,
                hexCrucial, hexImportant, hexNormal, hexSelf,
                triCrucial, triImportant, triNormal, triSelf,
                desCrucial, desImportant, desNormal, desSelf

                clCrucial = clImportant = clNormal = clSelf = 0
                hexCrucial = hexImportant = hexNormal = hexSelf = 0
                triCrucial = triImportant = triNormal = triSelf = 0
                desCrucial = desImportant = desNormal = desSelf = 0

                for (const key in resultsObject) {
                    if (resultsObject.hasOwnProperty(key) && resultsObject[key] === true) {
                        if (key.startsWith('Bool_LH_')) {
                            const hexMap = config.boolWeightRankMap.Hex

                            if (hexMap.Crucial && hexMap.Crucial.includes(key)) {
                                hexCrucial++;
                                hexCount++;
                            }
                            else if (hexMap.Important && hexMap.Important.includes(key)) {
                                hexImportant++;
                                hexCount++;
                            }
                            else if (hexMap.Normal && hexMap.Normal.includes(key)) {
                                hexNormal++;
                                hexCount++;
                            }
                            else if (hexMap.Self && hexMap.Self.includes(key)) {
                                hexSelf++;
                            }
                        }
                        else if (key.startsWith('Bool_CL_')) {
                            const clashMap = config.boolWeightRankMap.Clash

                            if (clashMap.Crucial && clashMap.Crucial.includes(key)) {
                                clCrucial++;
                                clashCount++;
                            }
                            else if (clashMap.Important && clashMap.Important.includes(key)) {
                                clImportant++;
                                clashCount++;
                            }
                            else if (clashMap.Normal && clashMap.Normal.includes(key)) {
                                clNormal++;
                                clashCount++;
                            }
                            else if (clashMap.Self && clashMap.Self.includes(key)) {
                                clSelf++;
                            }
                        }
                        else if (key.startsWith('Bool_SH_')) {
                            const triMap = config.boolWeightRankMap.Tri

                            if (triMap.Crucial && triMap.Crucial.includes(key)) {
                                triCrucial++;
                                triCount++;
                            }
                            else if (triMap.Important && triMap.Important.includes(key)) {
                                triImportant++;
                                triCount++;
                            }
                            else if (triMap.Normal && triMap.Normal.includes(key)) {
                                triNormal++;
                                triCount++;
                            }
                            else if (triMap.Self && triMap.Self.includes(key)) {
                                triSelf++;
                            }
                        }
                    }
                }

                return {
                    triCount, hexCount, clashCount,
                    cyCount, cmCount, cdCount, csCount,
                    hyCount, hmCount, hdCount, hsCount,
                    tyCount, tmCount, tdCount, tsCount,
                    hexCrucial, hexImportant, hexNormal, hexSelf,
                    clCrucial, clImportant, clNormal, clSelf,
                    triCrucial, triImportant, triNormal, triSelf,
                };
            }

            const Zodiac_Day_Self = self.day.animal
            const Zodiac_Day_Current = current.day.animal
            const Zodiac_Month_Self = self.month.animal
            const Zodiac_Month_Current = current.month.animal
            const Zodiac_Year_Self = self.year.animal
            const Zodiac_Year_Current = current.year.animal

            const comboObj = {
                // LH: Six-Harmony (Couple) checks
                Bool_LH_Self_Year_Month: isLH(Zodiac_Year_Self, Zodiac_Month_Self),
                Bool_LH_Self_Year_Day: isLH(Zodiac_Year_Self, Zodiac_Day_Self),
                Bool_LH_Self_Month_Day: isLH(Zodiac_Month_Self, Zodiac_Day_Self),
                Bool_LH_Self_Year_Current_Year: isLH(Zodiac_Year_Self, Zodiac_Year_Current),
                Bool_LH_Self_Year_Current_Month: isLH(Zodiac_Year_Self, Zodiac_Month_Current),
                Bool_LH_Self_Year_Current_Day: isLH(Zodiac_Year_Self, Zodiac_Day_Current),
                Bool_LH_Self_Month_Current_Year: isLH(Zodiac_Month_Self, Zodiac_Year_Current),
                Bool_LH_Self_Month_Current_Month: isLH(Zodiac_Month_Self, Zodiac_Month_Current),
                Bool_LH_Self_Month_Current_Day: isLH(Zodiac_Month_Self, Zodiac_Day_Current),
                Bool_LH_Self_Day_Current_Year: isLH(Zodiac_Day_Self, Zodiac_Year_Current),
                Bool_LH_Self_Day_Current_Month: isLH(Zodiac_Day_Self, Zodiac_Month_Current),
                Bool_LH_Self_Day_Current_Day: isLH(Zodiac_Day_Self, Zodiac_Day_Current),

                // CL: Clash checks
                Bool_CL_Self_Year_Month: isCL(Zodiac_Year_Self, Zodiac_Month_Self),
                Bool_CL_Self_Year_Day: isCL(Zodiac_Year_Self, Zodiac_Day_Self),
                Bool_CL_Self_Month_Day: isCL(Zodiac_Month_Self, Zodiac_Day_Self),
                Bool_CL_Self_Year_Current_Year: isCL(Zodiac_Year_Self, Zodiac_Year_Current),
                Bool_CL_Self_Year_Current_Month: isCL(Zodiac_Year_Self, Zodiac_Month_Current),
                Bool_CL_Self_Year_Current_Day: isCL(Zodiac_Year_Self, Zodiac_Day_Current),
                Bool_CL_Self_Month_Current_Year: isCL(Zodiac_Month_Self, Zodiac_Year_Current),
                Bool_CL_Self_Month_Current_Month: isCL(Zodiac_Month_Self, Zodiac_Month_Current),
                Bool_CL_Self_Month_Current_Day: isCL(Zodiac_Month_Self, Zodiac_Day_Current),
                Bool_CL_Self_Day_Current_Year: isCL(Zodiac_Day_Self, Zodiac_Year_Current),
                Bool_CL_Self_Day_Current_Month: isCL(Zodiac_Day_Self, Zodiac_Month_Current),
                Bool_CL_Self_Day_Current_Day: isCL(Zodiac_Day_Self, Zodiac_Day_Current),

                // SH: Three-Harmony (Tri) checks
                Bool_SH_Self: isSH(Zodiac_Year_Self, Zodiac_Month_Self, Zodiac_Day_Self),
                Bool_SH_Self_Year_Current_Year_Month: isSH(Zodiac_Year_Self,Zodiac_Year_Current,Zodiac_Month_Self,),
                Bool_SH_Self_Year_Current_Year_Day: isSH(Zodiac_Year_Self,Zodiac_Year_Current,Zodiac_Day_Self,),
                Bool_SH_Self_Year_Current_Month_Day: isSH(Zodiac_Year_Self,Zodiac_Month_Current,Zodiac_Day_Current,),
                Bool_SH_Self_Month_Current_Year_Month: isSH(Zodiac_Month_Self,Zodiac_Year_Current,Zodiac_Month_Current,),
                Bool_SH_Self_Month_Current_Year_Day: isSH(Zodiac_Month_Self,Zodiac_Year_Current,Zodiac_Day_Current,),
                Bool_SH_Self_Month_Current_Month_Day: isSH(Zodiac_Month_Self,Zodiac_Month_Current,Zodiac_Day_Current,),
                Bool_SH_Self_Day_Current_Year_Month: isSH(Zodiac_Day_Self,Zodiac_Year_Current,Zodiac_Month_Current,),
                Bool_SH_Self_Day_Current_Year_Day: isSH(Zodiac_Day_Self,Zodiac_Year_Current,Zodiac_Day_Current,),
                Bool_SH_Self_Day_Current_Month_Day: isSH(Zodiac_Day_Self,Zodiac_Month_Current,Zodiac_Day_Current,),
                Bool_SH_Self_Year_Month_Current_Year: isSH(Zodiac_Year_Self,Zodiac_Month_Self,Zodiac_Year_Current,),
                Bool_SH_Self_Year_Month_Current_Month: isSH(Zodiac_Year_Self,Zodiac_Month_Self,Zodiac_Month_Current,),
                Bool_SH_Self_Year_Month_Current_Day: isSH(Zodiac_Year_Self,Zodiac_Month_Self,Zodiac_Day_Current,),
                Bool_SH_Self_Year_Day_Current_Year: isSH(Zodiac_Year_Self,Zodiac_Day_Self,Zodiac_Year_Current,),
                Bool_SH_Self_Year_Day_Current_Month: isSH(Zodiac_Year_Self,Zodiac_Day_Self,Zodiac_Month_Current,),
                Bool_SH_Self_Year_Day_Current_Day: isSH(Zodiac_Year_Self,Zodiac_Day_Self,Zodiac_Day_Current,),
                Bool_SH_Self_Month_Day_Current_Year: isSH(Zodiac_Month_Self,Zodiac_Day_Self,Zodiac_Year_Current,),
                Bool_SH_Self_Month_Day_Current_Month: isSH(Zodiac_Month_Self,Zodiac_Day_Self,Zodiac_Month_Current,),
                Bool_SH_Self_Month_Day_Current_Day: isSH(Zodiac_Month_Self,Zodiac_Day_Self,Zodiac_Day_Current,),
            }

            const counts = countZodiacBooleans(comboObj);

            const pillar = {...comboObj, ...counts}

            return pillar
        }
    }
}
</script>
<style scoped lang="scss">
.birth-input-section {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
}
</style>