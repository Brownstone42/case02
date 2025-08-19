import {
    parse,
    isBefore,
    differenceInCalendarDays,
    differenceInCalendarMonths,
    differenceInCalendarYears,
} from 'date-fns'

const GENERATING_BONUS_MULTIPLIER = 0.5
const CONTROLLING_PENALTY_MULTIPLIER = 0.5
const DRAIN_PENALTY_MULTIPLIER = 0.25
const EXHAUST_PENALTY_MULTIPLIER = 0.25

export function calculatePillar(myDate, myTime, config) {
    const { startDate, dayCode, monthCode, yearCode, yearCutoff, monthCutoffDay, element, zodiac } =
        config

    const hasTime = !!myTime
    //console.log(hasTime)
    //console.log(myDate)

    const convertToDateObject = (value, formatString) => {
        if (value instanceof Date && !isNaN(value)) {
            return value
        }
        if (typeof value === 'number') {
            return new Date(value)
        }
        if (typeof value === 'string') {
            if (formatString === 'HH:mm') {
                const [hours, minutes] = value.split(':').map(Number)
                const dummyDate = new Date()
                dummyDate.setHours(hours, minutes, 0, 0)
                dummyDate.setMilliseconds(0)
                return dummyDate
            }
            return parse(value, formatString, new Date())
        }
        return new Date()
    }

    const datePartAsDateObj = convertToDateObject(myDate, 'dd/MM/yyyy')
    let timePartAsDateObj = ''
    if (!hasTime) {
        timePartAsDateObj = convertToDateObject('23:59', 'HH:mm')
    } else if (myTime == '23:30') {
        timePartAsDateObj = convertToDateObject('00:30', 'HH:mm')
    } else {
        timePartAsDateObj = convertToDateObject(myTime, 'HH:mm')
    }

    const myDateObj = new Date(
        datePartAsDateObj.getFullYear(),
        datePartAsDateObj.getMonth(),
        datePartAsDateObj.getDate(),
        timePartAsDateObj.getHours(),
        timePartAsDateObj.getMinutes(),
        0, // seconds
        0, // milliseconds
    )

    /*if (myDate == '05/01/1980' || myDate == '06/01/1980') {
        console.log(myDate)
        console.log(myTime)
    }*/

    const startDateObj = parse(startDate, 'dd/MM/yyyy', new Date())

    let totalDaysDifference = differenceInCalendarDays(myDateObj, startDateObj)
    let totalMonthsDifference = differenceInCalendarMonths(myDateObj, startDateObj)
    let totalYearsDifference = differenceInCalendarYears(myDateObj, startDateObj)

    const inputYear = myDateObj.getFullYear().toString()
    const inputMonth = myDateObj.getMonth() + 1
    const paddedMonth = String(inputMonth).padStart(2, '0')
    const monthKey = `${paddedMonth}/${inputYear}`

    if (yearCutoff[inputYear]) {
        const cutoff = parse(yearCutoff[inputYear], 'dd/MM/yyyy HH:mm', new Date())
        if (isBefore(myDateObj, cutoff)) {
            totalYearsDifference -= 1
        }
    }

    if (monthCutoffDay[monthKey]) {
        const cutoff = parse(monthCutoffDay[monthKey], 'dd/MM/yyyy HH:mm', new Date())
        //console.log(cutoff)
        if (isBefore(myDateObj, cutoff)) {
            totalMonthsDifference -= 1
        }
    }

    const pillar = {}

    // Code
    pillar.dayCode = (totalDaysDifference + dayCode) % 60
    pillar.monthCode = (totalMonthsDifference + monthCode) % 60
    pillar.yearCode = (totalYearsDifference + yearCode) % 60

    // Element
    const getElement = (code) => {
        const idx = (code % 10) - 1
        return element[idx === -1 ? 9 : idx]
    }

    pillar.dayElement = getElement(pillar.dayCode)
    pillar.monthElement = getElement(pillar.monthCode)
    pillar.yearElement = getElement(pillar.yearCode)

    // Zodiac
    const getZodiac = (code) => {
        const idx = (code % 12) - 1
        return zodiac[idx === -1 ? 11 : idx]
    }

    pillar.dayZodiac = getZodiac(pillar.dayCode)
    pillar.monthZodiac = getZodiac(pillar.monthCode)
    pillar.yearZodiac = getZodiac(pillar.yearCode)

    // Time
    if (hasTime) {
        const hour = myDateObj.getHours()
        let timeZodiac = ''
        let timeRow = 0

        if (hour >= 23 || hour < 1) {
            timeZodiac = 'Rat'
            timeRow = 1
        } else if (hour < 3) {
            timeZodiac = 'Ox'
            timeRow = 2
        } else if (hour < 5) {
            timeZodiac = 'Tiger'
            timeRow = 3
        } else if (hour < 7) {
            timeZodiac = 'Rabbit'
            timeRow = 4
        } else if (hour < 9) {
            timeZodiac = 'Dragon'
            timeRow = 5
        } else if (hour < 11) {
            timeZodiac = 'Snake'
            timeRow = 6
        } else if (hour < 13) {
            timeZodiac = 'Horse'
            timeRow = 7
        } else if (hour < 15) {
            timeZodiac = 'Goat'
            timeRow = 8
        } else if (hour < 17) {
            timeZodiac = 'Monkey'
            timeRow = 9
        } else if (hour < 19) {
            timeZodiac = 'Rooster'
            timeRow = 10
        } else if (hour < 21) {
            timeZodiac = 'Dog'
            timeRow = 11
        } else {
            timeZodiac = 'Pig'
            timeRow = 12
        }

        const decider = pillar.dayCode % 10
        let timeCode = timeRow
        if ([2, 7].includes(decider)) timeCode += 12
        else if ([3, 8].includes(decider)) timeCode += 24
        else if ([4, 9].includes(decider)) timeCode += 36
        else if ([5, 0].includes(decider)) timeCode += 48

        pillar.timeCode = timeCode
        pillar.timeElement = getElement(timeCode)
        pillar.timeZodiac = getZodiac(timeCode)
    }

    return pillar
}
export function calculateDominantElementScores(pillars, config) {
    /*  EARTH: 3
        FIRE: 1
        METAL: 1
        WATER: 3 DAY MASTER
        WOOD: 0
    
    pillars = {
        year: {
            element: 'EARTH',
            branch: {
                element: 'EARTH',
            },
        },
        month: {
            element: 'EARTH',
            branch: {
                element: 'FIRE',
            },
        },
        day: {
            element: 'WATER',
            branch: {
                element: 'WATER',
            },
        },
        time: {
            element: 'WATER',
            branch: {
                element: 'METAL',
            },
        },
    }*/

    const dayMasterElement = pillars.day.element
    const hasTimePillar = pillars.time && pillars.time.element && pillars.time.branch.element

    const allElements = [
        pillars.year.element,
        pillars.month.element,
        pillars.day.element,
        pillars.year.branch.element,
        pillars.month.branch.element,
        pillars.day.branch.element,
        ...(hasTimePillar ? [pillars.time.element, pillars.time.branch.element] : []),
    ].filter(Boolean)

    const elementCounts = { WOOD: 0, FIRE: 0, EARTH: 0, METAL: 0, WATER: 0 }
    allElements.forEach((el) => elementCounts[el]++)

    const finalScores = { ...elementCounts }
    const preFinalScores = { ...elementCounts }
    const dayMasterInstances = elementCounts[dayMasterElement]
    const dayMasterBaseScore = 2.5 + (dayMasterInstances > 0 ? dayMasterInstances - 1 : 0)

    console.log('--- Debugging Calculation ---')
    console.log('Original Element Counts:', elementCounts)

    for (const element of Object.keys(finalScores)) {
        const isDayMaster = element === dayMasterElement
        let baseScore = isDayMaster
            ? dayMasterBaseScore
            : elementCounts[element] > 0
              ? elementCounts[element]
              : 0
        let score = baseScore

        if (elementCounts[element] === 0) {
            finalScores[element] = 0
            continue
        }

        console.log(`\n--- Calculating for: ${element} ---`)
        console.log(`Base Score: ${baseScore}`)

        const generatingElement = config.getGeneratingElement(element)
        const controllingElement = config.getControllingElement(element)
        const outputElement = config.getOutputElement(element)
        const exhaustElement = config.getExhaustElement(element)

        const generatingCount = elementCounts[generatingElement] || 0
        const controllingCount = elementCounts[controllingElement] || 0

        score += generatingCount * GENERATING_BONUS_MULTIPLIER
        score -= controllingCount * CONTROLLING_PENALTY_MULTIPLIER

        console.log(
            `Generating Element: ${generatingElement} (Count: ${generatingCount}) -> Bonus: +${generatingCount * GENERATING_BONUS_MULTIPLIER}`,
        )
        console.log(
            `Controlling Element: ${controllingElement} (Count: ${controllingCount}) -> Penalty: -${controllingCount * CONTROLLING_PENALTY_MULTIPLIER}`,
        )

        const outputCount = elementCounts[outputElement] || 0
        const exhaustCount = elementCounts[exhaustElement] || 0

        score -= outputCount * DRAIN_PENALTY_MULTIPLIER
        score -= exhaustCount * EXHAUST_PENALTY_MULTIPLIER

        console.log(
            `Drain Penalty (from ${outputElement}): -${outputCount * DRAIN_PENALTY_MULTIPLIER}`,
        )
        console.log(
            `Exhaust Penalty (from ${exhaustElement}): -${exhaustCount * EXHAUST_PENALTY_MULTIPLIER}`,
        )

        preFinalScores[element] = score
        console.log(`Final Score for ${element}: ${preFinalScores[element]}`)
        finalScores[element] = score > 0 ? score : 0
    }

    const totalScore = Object.values(finalScores).reduce((sum, score) => sum + score, 0)

    const normalizedScores = {}
    if (totalScore > 0) {
        for (const element in finalScores) {
            normalizedScores[element] = Math.round((finalScores[element] / totalScore) * 100)
        }
    } else {
        for (const element in finalScores) {
            normalizedScores[element] = 0
        }
    }

    return { finalScoresPercent: normalizedScores, elementCounts, finalScores, preFinalScores }
}
export function calculateZodiacCombo(pillars, config) {
    const getZodiacPairs = (zodiacs, zodiacMap) => {
        const matchedPairs = []
        const unmatched = new Set(zodiacs)

        for (const currentZodiac of zodiacs) {
            if (!unmatched.has(currentZodiac)) continue
            const partnerZodiac = zodiacMap[currentZodiac]
            if (unmatched.has(partnerZodiac)) {
                matchedPairs.push([currentZodiac, partnerZodiac])
                unmatched.delete(currentZodiac)
                unmatched.delete(partnerZodiac)
            }
        }
        return matchedPairs
    }

    const getZodiacTri = (zodiacs) => {
        const matchedSets = []
        const unmatched = new Set(zodiacs)

        for (const currentZodiac of zodiacs) {
            if (!unmatched.has(currentZodiac)) continue

            const partners = config.zodiacSHMap[currentZodiac]

            if (partners && partners.length === 2) {
                const partner1 = partners[0]
                const partner2 = partners[1]

                if (unmatched.has(partner1) && unmatched.has(partner2)) {
                    const set = [currentZodiac, partner1, partner2]
                    matchedSets.push(set)

                    unmatched.delete(currentZodiac)
                    unmatched.delete(partner1)
                    unmatched.delete(partner2)
                }
            }
        }
        return matchedSets
    }

    const zodiacs = [
        pillars.year.animal,
        pillars.month.animal,
        pillars.day.animal,
        pillars.time.animal,
    ]

    const hexZodiac = getZodiacPairs(zodiacs, config.zodiacLHMap)
    const clashZodiac = getZodiacPairs(zodiacs, config.zodiacClashMap)
    const triZodiac = getZodiacTri(zodiacs)

    return {
        hexZodiac,
        clashZodiac,
        triZodiac,
    }
}
