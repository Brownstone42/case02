<template>
    <div class="bazi-result-display">
        <h2 class="title is-4 has-text-centered">Your BaZi Pillars</h2>

        <div class="content">
            <div class="bazi-pillars-container">
                <div class="bazi-pillar-column">
                    <p class="pillar-label has-text-weight-bold">Year Pillar</p>
                    <div class="pillar-circles-group">
                        <div class="element-circle-wrapper">
                            <div class="circle" :style="{ backgroundColor: element.yearColor }">
                                <div class="circle-content">
                                    <div>{{ element.yearMain }}</div>
                                    <div>{{ element.yearSymbol }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="zodiac-circle-wrapper">
                            <div class="circle zodiac">
                                <div
                                    class="up"
                                    :style="{ backgroundColor: zodiac.yearColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.yearColor.mid ? 'bot-right50' : 'bot-right63'"
                                    :style="{ backgroundColor: zodiac.yearColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.yearColor.mid ? 'bot-left25' : 'bot-left37'"
                                    :style="{ backgroundColor: zodiac.yearColor.left }"
                                ></div>
                                <div
                                    class="bot-mid"
                                    v-if="zodiac.yearColor.mid"
                                    :style="{ backgroundColor: zodiac.yearColor.mid }"
                                ></div>
                                <div class="circle-content zodiac">
                                    <div>{{ pillars.yearZodiac }}</div>
                                    <div>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bazi-pillar-column">
                    <p class="pillar-label has-text-weight-bold">Month Pillar</p>
                    <div class="pillar-circles-group">
                        <div class="element-circle-wrapper">
                            <div class="circle" :style="{ backgroundColor: element.monthColor }">
                                <div class="circle-content">
                                    <div>{{ element.monthMain }}</div>
                                    <div>{{ element.monthSymbol }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="zodiac-circle-wrapper">
                            <div class="circle zodiac">
                                <div
                                    class="up"
                                    :style="{ backgroundColor: zodiac.monthColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.monthColor.mid ? 'bot-right50' : 'bot-right63'"
                                    :style="{ backgroundColor: zodiac.monthColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.monthColor.mid ? 'bot-left25' : 'bot-left37'"
                                    :style="{ backgroundColor: zodiac.monthColor.left }"
                                ></div>
                                <div
                                    class="bot-mid"
                                    v-if="zodiac.monthColor.mid"
                                    :style="{ backgroundColor: zodiac.monthColor.mid }"
                                ></div>
                                <div class="circle-content zodiac">
                                    <div>{{ pillars.monthZodiac }}</div>
                                    <div>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bazi-pillar-column">
                    <p class="pillar-label has-text-weight-bold">Day Pillar</p>
                    <div class="pillar-circles-group">
                        <div class="element-circle-wrapper">
                            <div class="circle" :style="{ backgroundColor: element.dayColor }">
                                <div class="circle-content">
                                    <div>{{ element.dayMain }}</div>
                                    <div>{{ element.daySymbol }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="zodiac-circle-wrapper">
                            <div class="circle zodiac">
                                <div
                                    class="up"
                                    :style="{ backgroundColor: zodiac.dayColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.dayColor.mid ? 'bot-right50' : 'bot-right63'"
                                    :style="{ backgroundColor: zodiac.dayColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.dayColor.mid ? 'bot-left25' : 'bot-left37'"
                                    :style="{ backgroundColor: zodiac.dayColor.left }"
                                ></div>
                                <div
                                    class="bot-mid"
                                    v-if="zodiac.dayColor.mid"
                                    :style="{ backgroundColor: zodiac.dayColor.mid }"
                                ></div>
                                <div class="circle-content zodiac">
                                    <div>{{ pillars.dayZodiac }}</div>
                                    <div>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bazi-pillar-column" v-if="pillars.timeCode">
                    <p class="pillar-label has-text-weight-bold">Time Pillar</p>
                    <div class="pillar-circles-group">
                        <div class="element-circle-wrapper">
                            <div class="circle" :style="{ backgroundColor: element.timeColor }">
                                <div class="circle-content">
                                    <div>{{ element.timeMain }}</div>
                                    <div>{{ element.timeSymbol }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="zodiac-circle-wrapper">
                            <div class="circle zodiac">
                                <div
                                    class="up"
                                    :style="{ backgroundColor: zodiac.timeColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.timeColor.mid ? 'bot-right50' : 'bot-right63'"
                                    :style="{ backgroundColor: zodiac.timeColor.top }"
                                ></div>
                                <div
                                    :class="zodiac.timeColor.mid ? 'bot-left25' : 'bot-left37'"
                                    :style="{ backgroundColor: zodiac.timeColor.left }"
                                ></div>
                                <div
                                    class="bot-mid"
                                    v-if="zodiac.timeColor.mid"
                                    :style="{ backgroundColor: zodiac.timeColor.mid }"
                                ></div>
                                <div class="circle-content zodiac">
                                    <div>{{ pillars.timeZodiac }}</div>
                                    <div>&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaZiResultDisplay',
    props: {
        pillars: {
            type: Object,
            required: true,
        },
    },
    computed: {
        element() {
            const getMain = (element) => {
                return element ? element.slice(0, -1) : ''
            }

            const getSymbol = (element) => {
                return element ? element.slice(-1) : ''
            }

            const getColor = (element) => {
                const map = {
                    Wood: 'blue',
                    Fire: 'red',
                    Earth: 'yellow',
                    Metal: 'white',
                    Water: 'black',
                }

                return map[element] || 'gray'
            }

            return {
                yearMain: getMain(this.pillars.yearElement),
                yearSymbol: getSymbol(this.pillars.yearElement),
                yearColor: getColor(getMain(this.pillars.yearElement)),

                monthMain: getMain(this.pillars.monthElement),
                monthSymbol: getSymbol(this.pillars.monthElement),
                monthColor: getColor(getMain(this.pillars.monthElement)),

                dayMain: getMain(this.pillars.dayElement),
                daySymbol: getSymbol(this.pillars.dayElement),
                dayColor: getColor(getMain(this.pillars.dayElement)),

                timeMain: getMain(this.pillars.timeElement),
                timeSymbol: getSymbol(this.pillars.timeElement),
                timeColor: getColor(getMain(this.pillars.timeElement)),
            }
        },
        zodiac() {
            const getColor = (zodiac) => {
                const map = {
                    Rat: { top: 'black', left: 'black' },
                    Ox: { top: 'yellow', left: 'white', mid: 'black' },
                    Tiger: { top: 'blue', left: 'red' },
                    Rabbit: { top: 'blue', left: 'blue' },
                    Dragon: { top: 'yellow', left: 'black', mid: 'blue' },
                    Snake: { top: 'red', left: 'white' },
                    Horse: { top: 'red', left: 'red' },
                    Goat: { top: 'yellow', left: 'blue', mid: 'red' },
                    Monkey: { top: 'white', left: 'black' },
                    Rooster: { top: 'white', left: 'white' },
                    Dog: { top: 'yellow', left: 'red', mid: 'white' },
                    Pig: { top: 'black', left: 'blue' },
                }

                return map[zodiac] || { top: 'gray', left: 'gray' }
            }

            return {
                yearColor: getColor(this.pillars.yearZodiac),
                monthColor: getColor(this.pillars.monthZodiac),
                dayColor: getColor(this.pillars.dayZodiac),
                timeColor: getColor(this.pillars.timeZodiac),
            }
        },
    },
}
</script>

<style scoped lang="scss">
.bazi-result-display {
    padding: 1rem;
}

.bazi-pillars-container {
    display: flex;
    flex-wrap: wrap; /* Keep wrap for mobile default, but override for desktop */
    justify-content: center;
    gap: 0;
    flex-direction: column; /* Default (Mobile-first): Columns stack vertically */
    align-items: center;

    @media screen and (min-width: 769px) {
        flex-direction: row; /* Make pillar-columns arrange horizontally */
        flex-wrap: nowrap; /* <--- CRUCIAL CHANGE: PREVENT WRAPPING ON DESKTOP */
        align-items: flex-start; /* Align columns to the top */
        justify-content: center; /* Center the entire group of 4 columns */
        width: 100%; /* Ensure container takes full width to distribute space */
        max-width: 1000px; /* Optional: Constrain the overall width of the pillar display on large screens */
        margin: 0 auto; /* Optional: Center the entire pillar display horizontally on very wide screens */
    }
}

.bazi-pillar-column {
    display: flex;
    flex-direction: column; /* Keep stacking label, then circle group, vertically within EACH pillar */
    align-items: center;
    text-align: center;
    padding: 0.5rem;
    margin-bottom: 0; /* Space between stacked pillar-columns on mobile */
    flex-basis: 100%; /* Default to full width on mobile */

    @media screen and (min-width: 769px) {
        flex-direction: column; /* Still stack contents within the column */
        flex: 1; /* <--- CRUCIAL CHANGE: Make each column take equal available space */
        /* This helps ensure all 4 fit without wrapping if enough space. */
        max-width: none; /* <--- CRUCIAL CHANGE: Remove max-width on desktop to allow flex:1 to work */
        margin-bottom: 0; /* No margin-bottom when horizontally laid out */
    }
}

// ... (rest of your existing styles like .pillar-label, .pillar-circles-group, .circle etc. remain the same) ...

.pillar-label {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 0.8rem; /* Space below the label */
    white-space: nowrap; /* Prevent label text from wrapping */
}

// ... (previous styles for .bazi-result-display, .bazi-pillars-container, .bazi-pillar-column, .pillar-label) ...

.pillar-circles-group {
    display: flex;
    justify-content: center;
    align-items: center;

    /* Default (Mobile-first): Circles next to each other */
    flex-direction: row;
    gap: 2rem; /* Horizontal gap for mobile */
    margin-bottom: 0; // Keep a consistent bottom margin for the group

    @media screen and (min-width: 769px) {
        /* Desktop: Circles top and bottom */
        flex-direction: column; // <--- CRUCIAL CHANGE: Stack circles vertically on desktop
        gap: 0.5rem; // Adjust gap for vertical stacking on desktop (can be changed)
    }
}

// ... (rest of your existing styles for .element-circle-wrapper, .zodiac-circle-wrapper, .circle, etc. remain the same) ...

.element-circle-wrapper,
.zodiac-circle-wrapper {
    // These wrappers now behave as flex items within .pillar-circles-group
    margin-bottom: 0; /* No need for separate bottom margin here anymore */
    width: auto; /* Let the circle determine its width naturally */
    flex-shrink: 0; /* Prevent the circle wrappers from shrinking too much */
}

/* === EXISTING CIRCLE STYLES (Adjusted for new layout) === */
.circle {
    width: 90px;
    height: 90px;
    border: 2px solid #4a4a4a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0; /* Remove individual circle margins; gap is handled by .pillar-circles-group */
    font-weight: bold;
    text-align: center;
    background-color: white;
    font-size: 1.1rem;
    line-height: 1.2;
    flex-shrink: 0;
}
.circle-content {
    display: flex;
    flex-direction: column;
    line-height: 1.3;
}
.circle.zodiac {
    position: relative;
    overflow: hidden;
}
.circle-content.zodiac {
    position: relative;
    z-index: 1;
}
.circle.zodiac > .up {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
}
.circle.zodiac > .bot-right50 {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 50%;
}
.circle.zodiac > .bot-right63 {
    position: absolute;
    top: 50%;
    left: 37.5%;
    width: 62.5%;
    height: 50%;
}
.circle.zodiac > .bot-mid {
    position: absolute;
    top: 50%;
    left: 25%;
    width: 25%;
    height: 50%;
}
.circle.zodiac > .bot-left25 {
    position: absolute;
    top: 50%;
    left: 0;
    width: 25%;
    height: 50%;
}
.circle.zodiac > .bot-left37 {
    position: absolute;
    top: 50%;
    left: 0;
    width: 37.5%;
    height: 50%;
}
</style>
