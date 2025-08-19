<template>
    <div class="import-bazi-section">
        <h2 class="title is-4">Generate BaZi Data</h2>
        <p class="subtitle is-6 mb-4">
            Generate and upload BaZi data to Firestore for a specific year range.
        </p>

        <div class="admin-controls">
            <button
                class="button is-primary"
                @click="generateBazi(fromYear, toYear, fromMonth, toMonth)"
                :disabled="isLoading"
            >
                Generate BaZi
            </button>
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
    </div>
</template>

<script>
import { getConfig } from '@/utils/config'
import { calculatePillar } from '@/utils/luckEngine'
import { format, addDays, parse, subDays } from 'date-fns'
import * as XLSX from 'xlsx'
import { useDataStore } from '@/stores/data'
import { mapStores } from 'pinia'

export default {
    name: 'ImportBaZiData',
    data() {
        return {
            isLoading: false,
            fromYear: 1980,
            toYear: 1980,
            fromMonth: 1,
            toMonth: 2,
        }
    },
    computed: {
        ...mapStores(useDataStore),
    },
    methods: {
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

            console.log(results)
            //this.exportToExcel(results, fromYear, toYear)

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

            const sortedCounts = Object.values(currentTotal)
                .slice()
                .sort((a, b) => a - b)

            if (JSON.stringify(sortedCounts) === JSON.stringify([1, 1, 2, 2, 2])) {
                const lowestElements = Object.keys(currentTotal).filter(
                    (key) => currentTotal[key] === 1,
                )

                for (let i = 0; i < priority.length && additions.length < 2; i++) {
                    if (lowestElements.includes(priority[i])) {
                        additions.push(priority[i])
                        currentTotal[priority[i]]++
                    }
                }

                return additions
            }

            while (additions.length < 5) {
                const min = Math.min(...Object.values(currentTotal))
                const candidates = Object.keys(currentTotal).filter((k) => currentTotal[k] === min)

                for (let i = 0; i < priority.length; i++) {
                    const el = priority[i]
                    if (candidates.includes(el)) {
                        additions.push(el)
                        currentTotal[el]++
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
    },
}
</script>

<style scoped lang="scss">
.import-bazi-section {
    padding: 2rem;
}
.admin-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
}
.loading-indicator {
    display: flex;
    align-items: center;
    color: #4a4a4a;
    font-style: italic;
    .icon {
        animation: fa-spin 2s infinite linear;
    }
}
</style>
