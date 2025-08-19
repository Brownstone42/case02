<template>
    <div class="wrap section">
        <div class="admin-controls">
            <button
                class="button is-primary"
                @click="generateBazi(fromYear, toYear, fromMonth, toMonth)"
                :disabled="isLoading"
            >
                Generate BaZi
            </button>
            <button
                class="button is-primary"
                @click="generateBaziLite(fromYear, toYear, fromMonth, toMonth)"
                :disabled="isLoading"
            >
                Generate BaZi Lite
            </button>
            <button
                class="button is-primary"
                @click="generateSelfCombine(fromYear, toYear, fromMonth, toMonth, self)"
                :disabled="isLoading"
            >
                Generate Self Combine
            </button>
            <button
                class="button is-primary"
                @click="getPillarFromLibrary(fromYear, toYear)"
                :disabled="isLoading"
            >
                Get Pillar From Library
            </button>
            <input type="text" class="input" v-model="self" />
            <input type="number" class="input" v-model="fromYear" />
            <input type="number" class="input" v-model="toYear" />
            <input type="number" class="input" v-model="fromMonth" />
            <input type="number" class="input" v-model="toMonth" />

            <div v-if="isLoading" class="loading-indicator">
                <span class="icon is-large is-loading">
                    <i class="fas fa-spinner fa-pulse"></i>
                </span>
                <p class="ml-2">Generating BaZi...</p>
            </div>
        </div>

        <display-calendar :results="results" v-if="results.length > 0"></display-calendar>
    </div>
</template>

<script>
import { getConfig } from '@/utils/config'
import { calculatePillar } from '@/utils/luckEngine'
import { format, addDays, parse, subDays, startOfYear, isBefore } from 'date-fns'
import * as XLSX from 'xlsx'
import { useDataStore } from '@/stores/data'
import { mapStores } from 'pinia'
import DisplayCalendar from '../components/product/DisplayCalendar.vue'
import { BaziCalculator } from '@aharris02/bazi-calculator-by-alvamind'

export default {
    name: 'admin',
    data() {
        return {
            isLoading: false,
            fromYear: 1950,
            toYear: 2050,
            fromMonth: 1,
            toMonth: 1,
            self: '26/08/1989',
            results: {},
        }
    },
    components: {
        DisplayCalendar,
    },
    computed: {
        ...mapStores(useDataStore),
    },
    methods: {
        async getPillarFromLibrary(fromYear, toYear) {
            console.log('start getPillarFromLibrary')
            this.isLoading = true            

            const config = await getConfig() //USE THIS JUST TO MAKE LOADING WORK
            const startDateInYear = new Date(fromYear, 0, 1)
            const endDateInYear = new Date(toYear, 0, 1)
            const startDate = startOfYear(startDateInYear)
            const endDate = startOfYear(endDateInYear)
            const gender = 'male'
            const timeZone = 'Asia/Bangkok'
            const isTimeKnown = false
            const results = []
            let currentDate = startDate

            while (isBefore(currentDate, endDate)) {
                const myCalculator = new BaziCalculator(
                    currentDate,
                    gender,
                    timeZone,
                    isTimeKnown,
                )
                const myCompleteAnalysis = myCalculator.getCompleteAnalysis()
                const pillar = myCompleteAnalysis.detailedPillars

                results.push({
                    currentDate: format(currentDate, 'yyyy-MM-dd'),
                    dayName: format(currentDate, 'EEEE'),
                    yearStem: pillar.year.heavenlyStem.elementType,
                    yearBranch: pillar.year.earthlyBranch.animal,
                    yearHiddenStem1: pillar.year.earthlyBranch.hiddenStems[0].elementType,
                    yearHiddenStem2: pillar.year.earthlyBranch.hiddenStems[1] ? pillar.year.earthlyBranch.hiddenStems[1].elementType : '',
                    yearHiddenStem3: pillar.year.earthlyBranch.hiddenStems[2] ? pillar.year.earthlyBranch.hiddenStems[2].elementType : '',

                    monthStem: pillar.month.heavenlyStem.elementType,
                    monthBranch: pillar.month.earthlyBranch.animal,
                    monthHiddenStem1: pillar.month.earthlyBranch.hiddenStems[0].elementType,
                    monthHiddenStem2: pillar.month.earthlyBranch.hiddenStems[1] ? pillar.month.earthlyBranch.hiddenStems[1].elementType : '',
                    monthHiddenStem3: pillar.month.earthlyBranch.hiddenStems[2] ? pillar.month.earthlyBranch.hiddenStems[2].elementType : '',
                    
                    dayStem: pillar.day.heavenlyStem.elementType,
                    dayBranch: pillar.day.earthlyBranch.animal,
                    dayHiddenStem1: pillar.month.earthlyBranch.hiddenStems[0].elementType,
                    dayHiddenStem2: pillar.day.earthlyBranch.hiddenStems[1] ? pillar.day.earthlyBranch.hiddenStems[1].elementType : '',
                    dayHiddenStem3: pillar.day.earthlyBranch.hiddenStems[2] ? pillar.day.earthlyBranch.hiddenStems[2].elementType : '', 
                })

                currentDate = addDays(currentDate, 1)                
            }

            this.exportToExcel2(results)

            this.isLoading = false
            console.log(results)
        },
        exportToExcel2(results) {
            const worksheet = XLSX.utils.json_to_sheet(results)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, '01')
            XLSX.writeFile(workbook, 'Self_Pillar.xlsx')
        },
        async generateSelfCombine(fromYear, toYear, fromMonth = '01', toMonth = '12', self) {
            console.log('start generateSelfCombine')
            this.isLoading = true

            const config = await getConfig()
            const requiredYears = Array.from({ length: toYear - fromYear + 1 }, (_, i) =>
                String(fromYear + i),
            )

            const missing = requiredYears.filter((y) => !config.yearCutoff?.[y])

            if (missing.length) {
                console.log(`Missing yearCutoff for: ${missing.join(', ')}`)
                this.isLoading = false
                return
            }

            const selfData = calculatePillar(self, '', config)
            const selfPillar = {
                Year_Element: selfData.yearElement,
                Year_Zodiac: selfData.yearZodiac,
                Year_Zodiac_Element: config.zodiacElementMap[selfData.yearZodiac],
                Month_Element: selfData.monthElement,
                Month_Zodiac: selfData.monthZodiac,
                Month_Zodiac_Element: config.zodiacElementMap[selfData.monthZodiac],
                Day_Element: selfData.dayElement,
                Day_Zodiac: selfData.dayZodiac,
                Day_Zodiac_Element: config.zodiacElementMap[selfData.dayZodiac],
            }

            const selfTotal = this.getTotal(selfPillar)

            let current = parse(`01/${fromMonth}/${fromYear}`, 'dd/MM/yyyy', new Date())
            const end = subDays(parse(`01/${toMonth}/${toYear}`, 'dd/MM/yyyy', new Date()), 1)

            const results = []

            while (current <= end) {
                const displayDateStr = format(current, 'dd/MM/yyyy')
                let logicDateStr = displayDateStr

                const dayName = format(current, 'EEEE')
                const monthName = format(current, 'MMMM')
                const data = calculatePillar(logicDateStr, '', config)

                const currentMainPillar = {
                    Year_Element: data.yearElement,
                    Year_Zodiac: data.yearZodiac,
                    Year_Zodiac_Element: config.zodiacElementMap[data.yearZodiac],
                    Month_Element: data.monthElement,
                    Month_Zodiac: data.monthZodiac,
                    Month_Zodiac_Element: config.zodiacElementMap[data.monthZodiac],
                    Day_Element: data.dayElement,
                    Day_Zodiac: data.dayZodiac,
                    Day_Zodiac_Element: config.zodiacElementMap[data.dayZodiac],
                    Day_Master: data.dayElement,
                }

                const currentTotal = this.getTotal(currentMainPillar)
                const combineTotal = {}
                for (const key in selfTotal) {
                    if (currentTotal.hasOwnProperty(key)) {
                        combineTotal[key] = selfTotal[key] + currentTotal[key]
                    }
                }
                const zodiacPillar = {
                    Zodiac_Year_Self: selfPillar.Year_Zodiac,
                    Zodiac_Month_Self: selfPillar.Month_Zodiac,
                    Zodiac_Day_Self: selfPillar.Day_Zodiac,
                    Zodiac_Year_Current: currentMainPillar.Year_Zodiac,
                    Zodiac_Month_Current: currentMainPillar.Month_Zodiac,
                    Zodiac_Day_Current: currentMainPillar.Day_Zodiac,
                }

                const combinations = this.getZodiacCombinations(zodiacPillar, config)
                //console.log(combinations)

                results.push({
                    Self_Date: self,
                    Calendar_Date: displayDateStr,
                    Day_Name: dayName,
                    Month_Name: monthName,
                    Total_Wood: combineTotal.Wood,
                    Total_Fire: combineTotal.Fire,
                    Total_Earth: combineTotal.Earth,
                    Total_Metal: combineTotal.Metal,
                    Total_Water: combineTotal.Water,
                    Day_Master: selfData.dayElement,
                    ...zodiacPillar,
                    ...combinations,
                })

                current = addDays(current, 1)
            }

            console.log(results)
            this.results = results
            this.isLoading = false
        },
        async generateBaziLite(fromYear, toYear, fromMonth = '01', toMonth = '12') {
            console.log('start generateBaziLite')
            this.isLoading = true

            const config = await getConfig()
            const requiredYears = Array.from({ length: toYear - fromYear + 1 }, (_, i) =>
                String(fromYear + i),
            )
            const missing = requiredYears.filter((y) => !config.yearCutoff?.[y])

            if (missing.length) {
                console.log(`Missing yearCutoff for: ${missing.join(', ')}`)
                this.isLoading = false
                return
            }

            const results = []

            let current = parse(`01/${fromMonth}/${fromYear}`, 'dd/MM/yyyy', new Date())
            const end = subDays(parse(`01/${toMonth}/${toYear}`, 'dd/MM/yyyy', new Date()), 1)

            while (current <= end) {
                const displayDateStr = format(current, 'dd/MM/yyyy')
                let logicDateStr = displayDateStr

                const dayName = format(current, 'EEEE')
                const monthName = format(current, 'MMMM')
                const data = calculatePillar(logicDateStr, '', config)

                const mainPillar = {
                    Year_Element: data.yearElement,
                    Year_Zodiac: data.yearZodiac,
                    Year_Zodiac_Element: config.zodiacElementMap[data.yearZodiac],
                    Month_Element: data.monthElement,
                    Month_Zodiac: data.monthZodiac,
                    Month_Zodiac_Element: config.zodiacElementMap[data.monthZodiac],
                    Day_Element: data.dayElement,
                    Day_Zodiac: data.dayZodiac,
                    Day_Zodiac_Element: config.zodiacElementMap[data.dayZodiac],
                    Day_Master: data.dayElement,
                }

                const subPillar = {
                    Year_Zodiac_Clash: config.zodiacClashMap[data.yearZodiac],
                    Year_Zodiac_LH: config.zodiacLHMap[data.yearZodiac],
                    Year_Zodiac_SH1: config.zodiacSHMap[data.yearZodiac][0],
                    Year_Zodiac_SH2: config.zodiacSHMap[data.yearZodiac][1],
                    Year_Zodiac_Index: config.zodiacIndex[data.yearZodiac],
                    Year_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.yearZodiac]],
                    Year_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.yearZodiac]],
                    Year_Zodiac_SH1_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][0]],
                    Year_Zodiac_SH2_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][1]],
                    Month_Zodiac_Clash: config.zodiacClashMap[data.monthZodiac],
                    Month_Zodiac_LH: config.zodiacLHMap[data.monthZodiac],
                    Month_Zodiac_SH1: config.zodiacSHMap[data.monthZodiac][0],
                    Month_Zodiac_SH2: config.zodiacSHMap[data.monthZodiac][1],
                    Month_Zodiac_Index: config.zodiacIndex[data.monthZodiac],
                    Month_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.monthZodiac]],
                    Month_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.monthZodiac]],
                    Month_Zodiac_SH1_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][0]],
                    Month_Zodiac_SH2_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][1]],
                    Day_Zodiac_Clash: config.zodiacClashMap[data.dayZodiac],
                    Day_Zodiac_LH: config.zodiacLHMap[data.dayZodiac],
                    Day_Zodiac_SH1: config.zodiacSHMap[data.dayZodiac][0],
                    Day_Zodiac_SH2: config.zodiacSHMap[data.dayZodiac][1],
                    Day_Zodiac_Index: config.zodiacIndex[data.dayZodiac],
                    Day_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.dayZodiac]],
                    Day_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.dayZodiac]],
                    Day_Zodiac_SH1_Index: config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][0]],
                    Day_Zodiac_SH2_Index: config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][1]],
                }

                const pillar = {
                    Year_Element: data.yearElement,
                    Year_Zodiac: data.yearZodiac,
                    Year_Zodiac_Element: config.zodiacElementMap[data.yearZodiac],
                    Year_Zodiac_Clash: config.zodiacClashMap[data.yearZodiac],
                    Year_Zodiac_LH: config.zodiacLHMap[data.yearZodiac],
                    Year_Zodiac_SH1: config.zodiacSHMap[data.yearZodiac][0],
                    Year_Zodiac_SH2: config.zodiacSHMap[data.yearZodiac][1],
                    Year_Zodiac_Index: config.zodiacIndex[data.yearZodiac],
                    Year_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.yearZodiac]],
                    Year_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.yearZodiac]],
                    Year_Zodiac_SH1_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][0]],
                    Year_Zodiac_SH2_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][1]],
                    Month_Element: data.monthElement,
                    Month_Zodiac: data.monthZodiac,
                    Month_Zodiac_Element: config.zodiacElementMap[data.monthZodiac],
                    Month_Zodiac_Clash: config.zodiacClashMap[data.monthZodiac],
                    Month_Zodiac_LH: config.zodiacLHMap[data.monthZodiac],
                    Month_Zodiac_SH1: config.zodiacSHMap[data.monthZodiac][0],
                    Month_Zodiac_SH2: config.zodiacSHMap[data.monthZodiac][1],
                    Month_Zodiac_Index: config.zodiacIndex[data.monthZodiac],
                    Month_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.monthZodiac]],
                    Month_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.monthZodiac]],
                    Month_Zodiac_SH1_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][0]],
                    Month_Zodiac_SH2_Index:
                        config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][1]],
                    Day_Element: data.dayElement,
                    Day_Zodiac: data.dayZodiac,
                    Day_Zodiac_Element: config.zodiacElementMap[data.dayZodiac],
                    Day_Zodiac_Clash: config.zodiacClashMap[data.dayZodiac],
                    Day_Zodiac_LH: config.zodiacLHMap[data.dayZodiac],
                    Day_Zodiac_SH1: config.zodiacSHMap[data.dayZodiac][0],
                    Day_Zodiac_SH2: config.zodiacSHMap[data.dayZodiac][1],
                    Day_Zodiac_Index: config.zodiacIndex[data.dayZodiac],
                    Day_Zodiac_Clash_Index:
                        config.zodiacIndex[config.zodiacClashMap[data.dayZodiac]],
                    Day_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.dayZodiac]],
                    Day_Zodiac_SH1_Index: config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][0]],
                    Day_Zodiac_SH2_Index: config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][1]],
                    Day_Master: data.dayElement,
                }

                const total = this.getTotal(pillar)
                const suggest = this.getSuggest(data.dayElement, total)
                //console.log(suggest)

                results.push({
                    Calendar_Date: displayDateStr,
                    Day_Name: dayName,
                    Month_Name: monthName,
                    Total_Wood: total.Wood,
                    Total_Fire: total.Fire,
                    Total_Earth: total.Earth,
                    Total_Metal: total.Metal,
                    Total_Water: total.Water,
                    Suggest_Element: suggest.join(', '),
                    ...pillar,
                })

                current = addDays(current, 1)
            }

            console.log(results)
            this.exportToExcel(results, fromYear, toYear)
            this.isLoading = false
        },
        async generateBazi(fromYear, toYear, fromMonth = '01', toMonth = '12') {
            console.log('start generateBazi')
            this.isLoading = true

            const config = await getConfig()
            const requiredYears = Array.from({ length: toYear - fromYear + 1 }, (_, i) =>
                String(fromYear + i),
            )
            const missing = requiredYears.filter((y) => !config.yearCutoff?.[y])

            if (missing.length) {
                console.log(`Missing yearCutoff for: ${missing.join(', ')}`)
                this.isLoading = false
                return
            }

            const results = []

            //for (let year = fromYear; year <= toYear; year++) {
            let current = parse(`01/${fromMonth}/${fromYear}`, 'dd/MM/yyyy', new Date())
            const end = subDays(parse(`01/${toMonth}/${toYear}`, 'dd/MM/yyyy', new Date()), 1)

            console.log(current)
            console.log(end)

            while (current <= end) {
                const dayName = format(current, 'EEEE')
                const monthName = format(current, 'MMMM')

                config.timeRanges.forEach(({ order, sample, range }) => {
                    const displayDateStr = format(current, 'dd/MM/yyyy')
                    let logicDateStr = displayDateStr

                    if (order === 13) {
                        const nextDay = addDays(current, 1)
                        logicDateStr = format(nextDay, 'dd/MM/yyyy')
                    }

                    const data = calculatePillar(logicDateStr, sample, config)
                    const pillar = {
                        Year_Element: data.yearElement,
                        Year_Zodiac: data.yearZodiac,
                        Year_Zodiac_Element: config.zodiacElementMap[data.yearZodiac],
                        Year_Zodiac_Clash: config.zodiacClashMap[data.yearZodiac],
                        Year_Zodiac_LH: config.zodiacLHMap[data.yearZodiac],
                        Year_Zodiac_SH1: config.zodiacSHMap[data.yearZodiac][0],
                        Year_Zodiac_SH2: config.zodiacSHMap[data.yearZodiac][1],
                        Year_Zodiac_Index: config.zodiacIndex[data.yearZodiac],
                        Year_Zodiac_Clash_Index:
                            config.zodiacIndex[config.zodiacClashMap[data.yearZodiac]],
                        Year_Zodiac_LH_Index:
                            config.zodiacIndex[config.zodiacLHMap[data.yearZodiac]],
                        Year_Zodiac_SH1_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][0]],
                        Year_Zodiac_SH2_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.yearZodiac][1]],
                        Month_Element: data.monthElement,
                        Month_Zodiac: data.monthZodiac,
                        Month_Zodiac_Element: config.zodiacElementMap[data.monthZodiac],
                        Month_Zodiac_Clash: config.zodiacClashMap[data.monthZodiac],
                        Month_Zodiac_LH: config.zodiacLHMap[data.monthZodiac],
                        Month_Zodiac_SH1: config.zodiacSHMap[data.monthZodiac][0],
                        Month_Zodiac_SH2: config.zodiacSHMap[data.monthZodiac][1],
                        Month_Zodiac_Index: config.zodiacIndex[data.monthZodiac],
                        Month_Zodiac_Clash_Index:
                            config.zodiacIndex[config.zodiacClashMap[data.monthZodiac]],
                        Month_Zodiac_LH_Index:
                            config.zodiacIndex[config.zodiacLHMap[data.monthZodiac]],
                        Month_Zodiac_SH1_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][0]],
                        Month_Zodiac_SH2_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.monthZodiac][1]],
                        Day_Element: data.dayElement,
                        Day_Zodiac: data.dayZodiac,
                        Day_Zodiac_Element: config.zodiacElementMap[data.dayZodiac],
                        Day_Zodiac_Clash: config.zodiacClashMap[data.dayZodiac],
                        Day_Zodiac_LH: config.zodiacLHMap[data.dayZodiac],
                        Day_Zodiac_SH1: config.zodiacSHMap[data.dayZodiac][0],
                        Day_Zodiac_SH2: config.zodiacSHMap[data.dayZodiac][1],
                        Day_Zodiac_Index: config.zodiacIndex[data.dayZodiac],
                        Day_Zodiac_Clash_Index:
                            config.zodiacIndex[config.zodiacClashMap[data.dayZodiac]],
                        Day_Zodiac_LH_Index: config.zodiacIndex[config.zodiacLHMap[data.dayZodiac]],
                        Day_Zodiac_SH1_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][0]],
                        Day_Zodiac_SH2_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.dayZodiac][1]],
                        Day_Master: data.dayElement,
                        Time_Element: data.timeElement,
                        Time_Zodiac: data.timeZodiac,
                        Time_Zodiac_Element: config.zodiacElementMap[data.timeZodiac],
                        Time_Zodiac_Clash: config.zodiacClashMap[data.timeZodiac],
                        Time_Zodiac_LH: config.zodiacLHMap[data.timeZodiac],
                        Time_Zodiac_SH1: config.zodiacSHMap[data.timeZodiac][0],
                        Time_Zodiac_SH2: config.zodiacSHMap[data.timeZodiac][1],
                        Time_Zodiac_Index: config.zodiacIndex[data.timeZodiac],
                        Time_Zodiac_Clash_Index:
                            config.zodiacIndex[config.zodiacClashMap[data.timeZodiac]],
                        Time_Zodiac_LH_Index:
                            config.zodiacIndex[config.zodiacLHMap[data.timeZodiac]],
                        Time_Zodiac_SH1_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.timeZodiac][0]],
                        Time_Zodiac_SH2_Index:
                            config.zodiacIndex[config.zodiacSHMap[data.timeZodiac][1]],
                    }

                    const total = this.getTotal(pillar)
                    const suggest = this.getSuggest(data.dayElement, total)
                    const blossoms = this.getBlossom(config, data)

                    results.push({
                        Calendar_Date: displayDateStr,
                        Calendar_Time: sample,
                        Day_Name: dayName,
                        Month_Name: monthName,
                        Time_Range: range,
                        Total_Wood: total.Wood,
                        Total_Fire: total.Fire,
                        Total_Earth: total.Earth,
                        Total_Metal: total.Metal,
                        Total_Water: total.Water,
                        Suggest_Element: suggest.join(', '),
                        ...pillar,
                        ...blossoms,
                    })
                })

                current = addDays(current, 1)
            }
            //}

            console.log(results)
            this.exportToExcel(results, fromYear, toYear)
            /*try {
                await this.dataStore.addBaZiResults(results)
                console.log('BaZi data successfully sent to Firestore.')
            } catch (error) {
                console.error('Failed to save BaZi data to Firestore:', error)
            }*/
            this.isLoading = false
        },
        exportToExcel(results, from, to) {
            const worksheet = XLSX.utils.json_to_sheet(results)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, `${from}-${to}`)
            XLSX.writeFile(workbook, `BaZi_${from}-${to}.xlsx`)
        },
        getTotal(pillar) {
            const count = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 }

            const elementsToCheck = [
                pillar.Year_Element,
                pillar.Year_Zodiac_Element,
                pillar.Month_Element,
                pillar.Month_Zodiac_Element,
                pillar.Day_Element,
                pillar.Day_Zodiac_Element,
                pillar.Time_Element,
                pillar.Time_Zodiac_Element,
            ]

            elementsToCheck.forEach((el) => {
                if (count[el] !== undefined) {
                    count[el]++
                }
            })

            return count
        },
        getSuggest(dayMaster, total) {
            const currentTotal = { ...total }
            const priorityMap = {
                Wood: ['Water', 'Wood', 'Fire', 'Earth', 'Metal'],
                Fire: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
                Earth: ['Fire', 'Earth', 'Metal', 'Water', 'Wood'],
                Metal: ['Earth', 'Metal', 'Water', 'Wood', 'Fire'],
                Water: ['Metal', 'Water', 'Wood', 'Fire', 'Earth'],
            }
            const priority = priorityMap[dayMaster]
            const additions = []

            while (additions.length < 5) {
                const min = Math.min(...Object.values(currentTotal))
                const candidates = Object.keys(currentTotal).filter((k) => currentTotal[k] === min)

                for (let i = 0; i < priority.length; i++) {
                    const el = priority[i]
                    if (candidates.includes(el)) {
                        additions.push(el)
                        currentTotal[el]++
                        const sortedCounts = Object.values(currentTotal)
                            .slice()
                            .sort((a, b) => a - b)
                        if (JSON.stringify(sortedCounts) == JSON.stringify([2, 2, 2, 2, 2])) {
                            return additions
                        }
                        break
                    }
                }
            }

            return additions
        },
        getBlossom(config, data) {
            const blossomFound = {
                yearPillar: [],
                monthPillar: [],
                dayPillar: [],
                timePillar: [],
            }

            const refs = {
                year: config.blossomMap[data.yearZodiac],
                month: config.blossomMap[data.monthZodiac],
                day: config.blossomMap[data.dayZodiac],
                time: config.blossomMap[data.timeZodiac],
            }

            if (refs.year.includes(data.monthZodiac)) blossomFound.yearPillar.push('month')
            if (refs.year.includes(data.dayZodiac)) blossomFound.yearPillar.push('day')
            if (refs.year.includes(data.timeZodiac)) blossomFound.yearPillar.push('time')

            if (refs.month.includes(data.yearZodiac)) blossomFound.monthPillar.push('year')
            if (refs.month.includes(data.dayZodiac)) blossomFound.monthPillar.push('day')
            if (refs.month.includes(data.timeZodiac)) blossomFound.monthPillar.push('time')

            if (refs.day.includes(data.yearZodiac)) blossomFound.dayPillar.push('year')
            if (refs.day.includes(data.monthZodiac)) blossomFound.dayPillar.push('month')
            if (refs.day.includes(data.timeZodiac)) blossomFound.dayPillar.push('time')

            if (refs.time.includes(data.yearZodiac)) blossomFound.timePillar.push('year')
            if (refs.time.includes(data.monthZodiac)) blossomFound.timePillar.push('month')
            if (refs.time.includes(data.dayZodiac)) blossomFound.timePillar.push('day')

            const yearMonth = refs.year.includes(data.monthZodiac) ? 1 : 0
            const yearDay = refs.year.includes(data.dayZodiac) ? 1 : 0
            const yearTime = refs.year.includes(data.timeZodiac) ? 1 : 0

            const monthYear = refs.month.includes(data.yearZodiac) ? 1 : 0
            const monthDay = refs.month.includes(data.dayZodiac) ? 1 : 0
            const monthTime = refs.month.includes(data.timeZodiac) ? 1 : 0

            const dayYear = refs.day.includes(data.yearZodiac) ? 1 : 0
            const dayMonth = refs.day.includes(data.monthZodiac) ? 1 : 0
            const dayTime = refs.day.includes(data.timeZodiac) ? 1 : 0

            const timeYear = refs.time.includes(data.yearZodiac) ? 1 : 0
            const timeMonth = refs.time.includes(data.monthZodiac) ? 1 : 0
            const timeDay = refs.time.includes(data.dayZodiac) ? 1 : 0

            const Blossom_Total =
                yearMonth +
                yearDay +
                yearTime +
                monthYear +
                monthDay +
                monthTime +
                dayYear +
                dayMonth +
                dayTime +
                timeYear +
                timeMonth +
                timeDay

            const Blossoms = {
                Blossom_Year_Month: yearMonth,
                Blossom_Year_Day: yearDay,
                Blossom_Year_Time: yearTime,
                Blossom_Month_Year: monthYear,
                Blossom_Month_Day: monthDay,
                Blossom_Month_Time: monthTime,
                Blossom_Day_Year: dayYear,
                Blossom_Day_Month: dayMonth,
                Blossom_Day_Time: dayTime,
                Blossom_Time_Year: timeYear,
                Blossom_Time_Month: timeMonth,
                Blossom_Time_Day: timeDay,
                Blossom_Total,
            }

            return Blossoms
        },
        getZodiacCombinations(zodiacPillar, config) {
            const {
                Zodiac_Day_Self,
                Zodiac_Day_Current,
                Zodiac_Month_Current,
                Zodiac_Month_Self,
                Zodiac_Year_Current,
                Zodiac_Year_Self,
            } = zodiacPillar

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

            const results = {
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

            return results
        },
    },
}
</script>

<style scoped lang="scss">
div.wrap {
    margin-top: 4rem;
    padding: 1.5rem;
}

.admin-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem; /* Space between button and loader */
    flex-wrap: wrap; /* Allow items to wrap if screen is too small */
}

.loading-indicator {
    display: flex;
    align-items: center;
    color: #4a4a4a; /* A common gray text color */
    font-style: italic;
    .icon {
        animation: fa-spin 2s infinite linear; /* If FontAwesome spin is not working automatically */
    }
}

/* You can put specific styles for the spinner if needed */
/*
@keyframes fa-pulse {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
*/
</style>
