<template>
    <div class="container is-max-desktop mt-6">
        <div class="level is-mobile">
            <div class="level-left is-flex-direction-row">
                <div class="level-item">
                    <h1 class="title is-4">{{ currentDisplayYear }}</h1>
                </div>
            </div>
            <div class="level-right is-flex-direction-row">
                <div class="level-item">
                    <button class="button is-ghost" @click="prevMonth">
                        <span class="icon is-small"><i class="fas fa-chevron-left"></i></span>
                    </button>
                </div>
                <div class="level-item">
                    <h2 class="title is-4">{{ monthNames[currentMonthIndex] }}</h2>
                </div>
                <div class="level-item">
                    <button class="button is-ghost" @click="nextMonth">
                        <span class="icon is-small"><i class="fas fa-chevron-right"></i></span>
                    </button>
                </div>
            </div>
        </div>

        <div class="columns is-mobile is-gapless has-text-centered calendar-day-labels">
            <div class="column calendar-day-name">Sun</div>
            <div class="column calendar-day-name">Mon</div>
            <div class="column calendar-day-name">Tue</div>
            <div class="column calendar-day-name">Wed</div>
            <div class="column calendar-day-name">Thu</div>
            <div class="column calendar-day-name">Fri</div>
            <div class="column calendar-day-name">Sat</div>
        </div>

        <div
            class="columns is-multiline is-mobile is-gapless has-text-centered calendar-dates-grid"
        >
            <div
                v-for="(dayData, index) in currentMonthDays"
                :key="`day-${currentDisplayYear}-${currentMonthIndex}-${index}`"
                class="column calendar-date-box"
                :class="{ 'empty': !dayData }"
            >
                <template v-if="dayData">
                    <div class="date-number">
                        {{
                            new Date(dayData.Calendar_Date).getDate()
                        }}
                    </div>

                    <div class="zodiac-info mb-2">
                        <span
                            class="tag is-small"
                            :class="{'is-danger': dayData.zodiacCount.cyCount > 0}"
                            >{{ `cy${dayData.zodiacCount.cyCount}` }}</span>
                        <span
                            class="tag is-small"
                            :class="{'is-danger': dayData.zodiacCount.cmCount > 0}"
                            >{{ `cm${dayData.zodiacCount.cmCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-danger': dayData.zodiacCount.cdCount > 0}"
                            >{{ `cd${dayData.zodiacCount.cdCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-danger': dayData.zodiacCount.csCount > 0}"
                            >{{ `cs${dayData.zodiacCount.csCount}` }}</span
                        >
                    </div>

                    <div class="zodiac-info mb-2">
                        <span
                            class="tag is-small"
                            :class="{'is-primary': dayData.zodiacCount.hyCount > 0}"
                            >{{ `hy${dayData.zodiacCount.hyCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-primary': dayData.zodiacCount.hmCount > 0}"
                            >{{ `hm${dayData.zodiacCount.hmCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-primary': dayData.zodiacCount.hdCount > 0}"
                            >{{ `hd${dayData.zodiacCount.hdCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-primary': dayData.zodiacCount.hsCount > 0}"
                            >{{ `hs${dayData.zodiacCount.hsCount}` }}</span
                        >
                    </div>

                    <div class="zodiac-info mb-2">
                        <span
                            class="tag is-small"
                            :class="{'is-support': dayData.zodiacCount.tyCount > 0}"
                            >{{ `ty${dayData.zodiacCount.tyCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-support': dayData.zodiacCount.tmCount > 0}"
                            >{{ `tm${dayData.zodiacCount.tmCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-support': dayData.zodiacCount.tdCount > 0}"
                            >{{ `td${dayData.zodiacCount.tdCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-support': dayData.zodiacCount.tsCount > 0}"
                            >{{ `ts${dayData.zodiacCount.tsCount}` }}</span
                        >
                    </div>

                    <div class="zodiac-info mb-2">
                        <span
                            class="tag is-small"
                            :class="{'is-danger': dayData.zodiacCount.clashCount > 0}"
                            >{{ `cls${dayData.zodiacCount.clashCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-success': dayData.zodiacCount.hexCount > 0}"
                            >{{ `hex${dayData.zodiacCount.hexCount}` }}</span
                        >
                        <span
                            class="tag is-small"
                            :class="{'is-support': dayData.zodiacCount.triCount > 0}"
                            >{{ `tri${dayData.zodiacCount.triCount}` }}</span
                        >
                    </div>

                    <div class="element-info mb-2">
                        <span
                            class="tag is-small is-danger"
                            v-if="dayData.unfavoriteCount"
                            >{{ dayData.unfavoriteCount }}</span
                        >
                        <span
                            class="tag is-small is-success"
                            v-if="dayData.favoriteCount"
                            >{{ dayData.favoriteCount }}</span
                        >                        
                        <!--<span
                            class="tag is-small is-support"
                            v-if="dayData.favoriteCount2"
                            >{{ dayData.favoriteCount2 }}</span
                        >
                        <span
                            class="tag is-small is-warning"
                            v-if="dayData.unfavoriteCount2"
                            >{{ dayData.unfavoriteCount2 }}</span
                        >

                        <span
                            class="tag is-small is-primary"
                            v-if="dayData.favoriteCount - dayData.unfavoriteCount > 1"
                            >{{ dayData.favoriteCount - dayData.unfavoriteCount }}</span
                        >
                        <span
                            class="tag is-small is-danger"
                            v-if="dayData.unfavoriteCount - dayData.favoriteCount > 1"
                            >{{ dayData.unfavoriteCount - dayData.favoriteCount }}</span
                        >
                        <span
                            class="tag is-small is-support"
                            v-if="dayData.favoriteCount2 - dayData.unfavoriteCount2 > 1"
                            >{{ dayData.favoriteCount2 - dayData.unfavoriteCount2 }}</span
                        >
                        <span
                            class="tag is-small is-warning"
                            v-if="dayData.unfavoriteCount2 - dayData.favoriteCount2 > 1"
                            >{{ dayData.unfavoriteCount2 - dayData.favoriteCount2 }}</span
                        >-->
                    </div>
                </template>
            </div>
        </div>
    </div>
    <!--<h1>{{ dailyDataMap }}</h1>-->
</template>

<script>
export default {
    name: 'DisplayCalendar',
    props: {
        results: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        console.log('DisplayCalendar mounted, results:', this.results)
        this.currentMonthIndex = new Date().getMonth()
    },
    created() {
        if (Object.values(this.results).length > 0) {
            const firstDate = Object.values(this.results)[0].Calendar_Date
            this.currentDisplayYear = parseInt(firstDate.split('-')[0])
        }
    },
    data() {
        return {
            currentDisplayYear: new Date().getFullYear(), // Will be overwritten in created()
            currentMonthIndex: new Date().getMonth(), // 0 = January, 11 = December
            monthNames: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],

        }
    },
    computed: {
        dailyDataMap() {
            const map = {}
            // Iterate over the values of the results object
            Object.values(this.results).forEach((data) => {
                map[data.Calendar_Date] = data
            })
            return map
        },
        currentMonthDays() {
            const days = []
            const year = this.currentDisplayYear
            const month = this.currentMonthIndex // 0-indexed month

            // Get the first day of the month (0 = Sunday, 6 = Saturday)
            const firstDayOfMonth = new Date(year, month, 1).getDay()

            // Get the number of days in the month
            const daysInMonth = new Date(year, month + 1, 0).getDate()

            // Add null placeholders for days before the 1st
            for (let i = 0; i < firstDayOfMonth; i++) {
                days.push(null) // Use null to represent an empty day slot
            }

            // Add actual days from dailyDataMap
            for (let day = 1; day <= daysInMonth; day++) {
                const monthStr = String(month + 1).padStart(2, '0')
                const dayStr = String(day).padStart(2, '0')
                const key = `${year}-${monthStr}-${dayStr}`
                // Push the data object if found, otherwise a minimal object (or null if preferred)
                days.push(
                    this.dailyDataMap[key] || { Calendar_Date: `${year}-${monthStr}-${dayStr}` },
                )
            }
            return days
        }
    },
    methods: {
        prevMonth() {
            this.currentMonthIndex--
            if (this.currentMonthIndex < 0) {
                this.currentMonthIndex = 11
            }
        },
        nextMonth() {
            this.currentMonthIndex++
            if (this.currentMonthIndex > 11) {
                this.currentMonthIndex = 0
            }
        }
    }
}
</script>

<style scoped>
.calendar-day-labels .column {
    font-weight: bold;
    color: #363636;
    padding: 0.5rem 0.25rem;
}

.calendar-day-name {
    flex-basis: calc(100% / 7);
    max-width: calc(100% / 7);
}

.calendar-dates-grid .column {
    min-height: 60px; /* Adjust height as needed */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 0.25rem;
    border: 1px solid #f0f0f0; /* Light border for cells */
    border-radius: 4px; /* Slightly rounded corners for cells */
    margin: 1px; /* Small margin to create visual separation */
    box-sizing: border-box; /* Include padding and border in the element's total width and height */

    /* Custom styling for 7 columns */
    flex-basis: calc(100% / 7);
    max-width: calc(100% / 7);
}

.calendar-dates-grid .column.empty {
    background-color: #f9f9f9;
    border: 1px solid #f9f9f9;
}

.calendar-date-box .date-number {
    font-weight: bold;
    font-size: 0.9em;
    margin-bottom: 0.25rem;
    color: #4a4a4a;
}

.calendar-date-box .element-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
}

.calendar-date-box .zodiac-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
}

.tag {
    font-size: 0.6rem;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    line-height: 1;
    white-space: nowrap;
}

.tag.is-danger {
    background-color: #f14668; /* Bulma danger red */
    color: white;
}

.tag.is-success {
    background-color: #0f6840; /* Bulma success green */
    color: white;
}

.tag.is-primary {
    background-color: #48c78e; /* Bulma success green */
    color: white;
}

.tag.is-support {
    background-color: #20639a; /* Bulma success green */
    color: white;
}

.tag.is-destroy {
    background-color: #3c3336; /* Bulma success green */
    color: white;
}

.tag.is-warning {
    background-color: #a98812; /* Bulma success yellow */
    color: white;
}
</style>