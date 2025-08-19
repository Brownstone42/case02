<template>
  <div class="container is-max-desktop mt-6" v-if="fromYear !== null && toYear !== null">
      <div class="level is-mobile">
          <div class="level-left is-flex-direction-row">
              <div class="level-item">
                  <button 
                      class="button is-ghost" 
                      @click="prevYear" 
                      :disabled="currentDisplayYear === fromYear"
                  >
                      <span class="icon is-small"><i class="fas fa-angle-double-left"></i></span>
                  </button>
              </div>
              <div class="level-item">
                  <h1 class="title is-4">{{ currentDisplayYear }}</h1>
              </div>
              <div class="level-item">
                  <button 
                      class="button is-ghost" 
                      @click="nextYear" 
                      :disabled="currentDisplayYear === toYear - 1"
                  >
                      <span class="icon is-small"><i class="fas fa-angle-double-right"></i></span>
                  </button>
              </div>
          </div>
          <div class="level-right is-flex-direction-row">
              <div class="level-item">
                  <button 
                      class="button is-ghost" 
                      @click="prevMonth"
                      :disabled="currentMonthIndex === 0 && currentDisplayYear === fromYear"
                  >
                      <span class="icon is-small"><i class="fas fa-chevron-left"></i></span>
                  </button>
              </div>
              <div class="level-item">
                  <h2 class="title is-4">{{ currentDisplayMonthName }}</h2>
              </div>
              <div class="level-item">
                  <button 
                      class="button is-ghost" 
                      @click="nextMonth"
                      :disabled="currentMonthIndex === 11 && currentDisplayYear === toYear - 1"
                  >
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
                      >{{ `cy${dayData.zodiacCount.cyCount}` }}</span
                      >
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
                          class="tag is-small is-danger"
                          v-if="dayData.zodiacCount.clashCount > 0"
                      >{{ `cls${dayData.zodiacCount.clashCount}` }}</span
                      >
                      <span
                          class="tag is-small is-success"
                          v-if="dayData.zodiacCount.hexCount > 0"
                      >{{ `hex${dayData.zodiacCount.hexCount}` }}</span
                      >
                      <span
                          class="tag is-small is-support"
                          v-if="dayData.zodiacCount.triCount > 0"
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
                  </div>
              </template>
          </div>
      </div>
  </div>
</template>

<script>
import { format, getDay, isSunday, isSaturday, parse, getYear, getMonth, getDate, subDays, addDays } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

export default {
    name: 'DisplayCalendar',
    props: {
        results: {
            type: Array,
            required: true,
        },
        fromYear: { type: Number, required: true },
        toYear: { type: Number, required: true },
    },
    mounted() {
        this.setInitialCalendarView();
    },
    data() {
        return {
            currentDisplayYear: new Date().getFullYear(),
            currentMonthIndex: new Date().getMonth(), // 0 = January, 11 = December
            monthNames: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December',
            ],
        };
    },
    computed: {
        currentDisplayMonthName() {
            return this.monthNames[this.currentMonthIndex];
        },
        dailyDataMap() {
            if (!this.results || this.results.length === 0) {
                return {};
            }
            const map = {};
            const filteredResults = this.results.filter(dayData => {
                const dayDate = parse(dayData.Calendar_Date, 'yyyy-MM-dd', new Date());
                return getYear(dayDate) === this.currentDisplayYear && getMonth(dayDate) === this.currentMonthIndex;
            });
            filteredResults.forEach((data) => {
                map[data.Calendar_Date] = data;
            });
            return map;
        },
        currentMonthDays() {
            const days = [];
            const year = this.currentDisplayYear;
            const month = this.currentMonthIndex;

            const firstDayOfMonth = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayOfMonth; i++) {
                days.push(null);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const monthStr = String(month + 1).padStart(2, '0');
                const dayStr = String(day).padStart(2, '0');
                const key = `${year}-${monthStr}-${dayStr}`;
                
                days.push(
                    this.dailyDataMap[key] || null,
                );
            }
            return days;
        }
    },
    methods: {
        setInitialCalendarView() {
          if (this.results && this.results.length > 0) {
            const firstDateStr = this.results[0].Calendar_Date;
            const firstDate = parse(firstDateStr, 'yyyy-MM-dd', new Date());
            this.currentDisplayYear = getYear(firstDate);
            this.currentMonthIndex = getMonth(firstDate);
          }
        },
        prevYear() {
            if (this.currentDisplayYear > this.fromYear) {
                this.currentDisplayYear--;
            }
        },
        nextYear() {
            if (this.currentDisplayYear < this.toYear) { // Corrected check
                this.currentDisplayYear++;
            }
        },
        prevMonth() {
            this.currentMonthIndex--;
            if (this.currentMonthIndex < 0) {
                this.currentMonthIndex = 11;
                this.currentDisplayYear--;
            }
        },
        nextMonth() {
            this.currentMonthIndex++;
            if (this.currentMonthIndex > 11) {
                this.currentMonthIndex = 0;
                this.currentDisplayYear++;
            }
        }
    }
};
</script>

<style scoped>
/* All of your existing styles are here. */
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