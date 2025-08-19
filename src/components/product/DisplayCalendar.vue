<template>
    <div class="container is-max-desktop mt-6">
        <!-- Year and Month Navigation -->
        <div class="level is-mobile">
            <div class="level-left is-flex-direction-row">
                <div class="level-item">
                    <!-- Display the fixed year from the data -->
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
                    <!-- Display the current month name -->
                    <h2 class="title is-4">{{ monthNames[currentMonthIndex] }}</h2>
                </div>
                <div class="level-item">
                    <button class="button is-ghost" @click="nextMonth">
                        <span class="icon is-small"><i class="fas fa-chevron-right"></i></span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Day Labels (Sun, Mon, etc.) -->
        <div class="columns is-mobile is-gapless has-text-centered calendar-day-labels">
            <div class="column calendar-day-name">Sun</div>
            <div class="column calendar-day-name">Mon</div>
            <div class="column calendar-day-name">Tue</div>
            <div class="column calendar-day-name">Wed</div>
            <div class="column calendar-day-name">Thu</div>
            <div class="column calendar-day-name">Fri</div>
            <div class="column calendar-day-name">Sat</div>
        </div>

        <!-- Date Boxes (This is where the dates will be) -->
        <div
            class="columns is-multiline is-mobile is-gapless has-text-centered calendar-dates-grid"
        >
            <div
                v-for="(dayData, index) in currentMonthDays"
                :key="`day-${currentDisplayYear}-${currentMonthIndex}-${index}`"
                class="column calendar-date-box"
                :class="dayData ? getDateClasses(dayData) : 'empty'"
            >
                <template v-if="dayData">
                    <div class="date-number">
                        {{
                            new Date(dayData.Calendar_Date.split('/').reverse().join('-')).getDate()
                        }}
                    </div>
                    <div class="zodiac-info">
                        <!-- SUPPORT DESTROY COUNT info tags -->
                        <span
                            class="tag is-small is-support"
                            v-if="getSupportDestroyCounts(dayData).supportCount >= 4"
                            >SP({{ getSupportDestroyCounts(dayData).supportCount }})</span
                        >
                        <span
                            class="tag is-small is-destroy"
                            v-if="getSupportDestroyCounts(dayData).destroyCount >= 4"
                            >DT({{ getSupportDestroyCounts(dayData).destroyCount }})</span
                        >
                        <!-- Clash (CL) info tags -->
                        <span
                            v-if="dayData.Bool_CL_Self_Year_Current_Year"
                            class="tag is-small is-danger"
                            >YY</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Year_Current_Month"
                            class="tag is-small is-danger"
                            >YM</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Year_Current_Day"
                            class="tag is-small is-danger"
                            >YD</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Month_Current_Year"
                            class="tag is-small is-danger"
                            >MY</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Month_Current_Month"
                            class="tag is-small is-danger"
                            >MM</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Month_Current_Day"
                            class="tag is-small is-danger"
                            >MD</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Day_Current_Year"
                            class="tag is-small is-danger"
                            >DY</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Day_Current_Month"
                            class="tag is-small is-danger"
                            >DM</span
                        >
                        <span
                            v-if="dayData.Bool_CL_Self_Day_Current_Day"
                            class="tag is-small is-danger"
                            >DD</span
                        >
                        <!-- LH info tags -->
                        <span
                            v-if="dayData.Bool_LH_Self_Year_Current_Year"
                            class="tag is-small is-success"
                            >YY</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Year_Current_Month"
                            class="tag is-small is-success"
                            >YM</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Year_Current_Day"
                            class="tag is-small is-success"
                            >YD</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Month_Current_Year"
                            class="tag is-small is-success"
                            >MY</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Month_Current_Month"
                            class="tag is-small is-success"
                            >MM</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Month_Current_Day"
                            class="tag is-small is-success"
                            >MD</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Day_Current_Year"
                            class="tag is-small is-success"
                            >DY</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Day_Current_Month"
                            class="tag is-small is-success"
                            >DM</span
                        >
                        <span
                            v-if="dayData.Bool_LH_Self_Day_Current_Day"
                            class="tag is-small is-success"
                            >DD</span
                        >
                        <!-- SH info tags -->
                        <span
                            v-if="dayData.Bool_SH_Self_Year_Current_Month_Day"
                            class="tag is-small is-primary"
                            >Y|MD</span
                        >
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DisplayCalendar',
    props: {
        results: {
            // This prop will contain the full year's data as an object
            type: Object,
            required: true,
        },
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
            priorityMap: {
                Wood: ['Water', 'Wood', 'Fire', 'Earth', 'Metal'],
                Fire: ['Wood', 'Fire', 'Earth', 'Metal', 'Water'],
                Earth: ['Fire', 'Earth', 'Metal', 'Water', 'Wood'],
                Metal: ['Earth', 'Metal', 'Water', 'Wood', 'Fire'],
                Water: ['Metal', 'Water', 'Wood', 'Fire', 'Earth'],
            },
        }
    },
    computed: {
        // Create a map for quick lookup of daily data
        // Key format: "YYYY-MM-DD"
        dailyDataMap() {
            const map = {}
            // Iterate over the values of the results object
            Object.values(this.results).forEach((data) => {
                // Calendar_Date format is "DD/MM/YYYY"
                const [day, month, year] = data.Calendar_Date.split('/')
                const key = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                map[key] = data
            })
            return map
        },
        // Generates the array of day objects (or null for empty slots) for the current month
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
                    this.dailyDataMap[key] || { Calendar_Date: `${dayStr}/${monthStr}/${year}` },
                )
            }
            return days
        },
    },
    methods: {
        getSupportDestroyCounts(dayData) {
            if (!dayData || !dayData.Day_Master || !this.priorityMap[dayData.Day_Master]) {
                return null // Return null if data is incomplete
            }

            const dayMaster = dayData.Day_Master
            //console.log(dayMaster)
            const priority = this.priorityMap[dayMaster]

            const supportElement = priority[0] // First element is support
            const destroyElement = priority[priority.length - 1] // Last element is destroy

            //console.log(supportElement)

            // Access counts using dynamic property names
            const supportCount = dayData[`Total_${supportElement}`] || 0
            const destroyCount = dayData[`Total_${destroyElement}`] || 0

            return { supportCount, destroyCount }
        },
        // Method to apply specific classes based on zodiac data
        getDateClasses(dayData) {
            const classes = []
            // Check for CL properties and add 'has-cl' class if any are true
            if (
                dayData.Bool_CL_Self_Year_Current_Year ||
                dayData.Bool_CL_Self_Year_Current_Month ||
                dayData.Bool_CL_Self_Year_Current_Day ||
                dayData.Bool_CL_Self_Month_Current_Year ||
                dayData.Bool_CL_Self_Month_Current_Month ||
                dayData.Bool_CL_Self_Month_Current_Day ||
                dayData.Bool_CL_Self_Day_Current_Year ||
                dayData.Bool_CL_Self_Day_Current_Month ||
                dayData.Bool_CL_Self_Day_Current_Day
            ) {
                classes.push('has-cl')
            }

            // Check for LH properties and add 'has-lh' class if any are true (ADD THIS)
            if (
                dayData.Bool_LH_Self_Year_Current_Year ||
                dayData.Bool_LH_Self_Year_Current_Month ||
                dayData.Bool_LH_Self_Year_Current_Day ||
                dayData.Bool_LH_Self_Month_Current_Year ||
                dayData.Bool_LH_Self_Month_Current_Month ||
                dayData.Bool_LH_Self_Month_Current_Day ||
                dayData.Bool_LH_Self_Day_Current_Year ||
                dayData.Bool_LH_Self_Day_Current_Month ||
                dayData.Bool_LH_Self_Day_Current_Day
            ) {
                classes.push('has-lh')
            }

            // Check for SH properties and add 'has-sh' class if any are true (ADD THIS)
            if (dayData.Bool_SH_Self_Year_Current_Month_Day) {
                classes.push('has-sh')
            }
            return classes
        },
        prevMonth() {
            this.currentMonthIndex--
            if (this.currentMonthIndex < 0) {
                this.currentMonthIndex = 11 // Wrap to December
            }
        },
        nextMonth() {
            this.currentMonthIndex++
            if (this.currentMonthIndex > 11) {
                this.currentMonthIndex = 0 // Wrap to January
            }
        },
    },
    created() {
        // Set the currentDisplayYear based on the first data point received
        if (Object.values(this.results).length > 0) {
            const firstDate = Object.values(this.results)[0].Calendar_Date
            this.currentDisplayYear = parseInt(firstDate.split('/')[2])
        }
    },
    mounted() {
        console.log('DisplayCalendar mounted, results:', this.results)
        // Initially set the month to the current month or January
        this.currentMonthIndex = new Date().getMonth()
    },
}
</script>

<style scoped>
/* Import Bulma CSS - This should ideally be in your main App.vue or global CSS */
/* @import 'https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css'; */
/* Import Font Awesome for icons - This should ideally be in your main App.vue or global CSS */
/* @import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css'; */

/* Removed .calendar-month-box as it's no longer used for specific styling */

.calendar-day-labels .column {
    font-weight: bold;
    color: #363636;
    padding: 0.5rem 0.25rem;
}

/* Custom class for day names to ensure 7 columns */
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

.calendar-date-box .zodiac-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 3px;
}

/* Styling for tags */
.tag {
    font-size: 0.6rem;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    line-height: 1;
    white-space: nowrap;
}

/* Re-added is-danger style for red tags */
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

/* Conditional styling for date boxes based on combinations */
.calendar-date-box.has-cl {
    /* background-color: #ffe6e6;  Light red for CL */
}

/* Removed specific tag and combination styling as requested */
</style>
