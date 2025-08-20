import { loadCutoffDataFromURL } from '@/utils/loadCutoff'

export async function getConfig() {
    const cutoffs = await loadCutoffDataFromURL('/data/cutoff-data.xlsx')

    const yearCutoff = cutoffs.yearCutoff
    const monthCutoffDay = cutoffs.monthCutoffDay

    const config = {
        startDate: '15/04/1924',
        dayCode: 1,
        monthCode: 5,
        yearCode: 1,
        yearCutoff,
        monthCutoffDay,
        element: [
            'Wood',
            'Wood',
            'Fire',
            'Fire',
            'Earth',
            'Earth',
            'Metal',
            'Metal',
            'Water',
            'Water',
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
        timeRanges: [
            { order: 1, sample: '00:30', range: '00:00-00:59' },
            { order: 2, sample: '02:30', range: '01:00-02:59' },
            { order: 3, sample: '04:30', range: '03:00-04:59' },
            { order: 4, sample: '06:30', range: '05:00-06:59' },
            { order: 5, sample: '08:30', range: '07:00-08:59' },
            { order: 6, sample: '10:30', range: '09:00-10:59' },
            { order: 7, sample: '12:30', range: '11:00-12:59' },
            { order: 8, sample: '14:30', range: '13:00-14:59' },
            { order: 9, sample: '16:30', range: '15:00-16:59' },
            { order: 10, sample: '18:30', range: '17:00-18:59' },
            { order: 11, sample: '20:30', range: '19:00-20:59' },
            { order: 12, sample: '22:30', range: '21:00-22:59' },
            { order: 13, sample: '23:30', range: '23:00-23:59' },
        ],
        zodiacIndex: {
            Rat: 1,
            Ox: 2,
            Tiger: 3,
            Rabbit: 4,
            Dragon: 5,
            Snake: 6,
            Horse: 7,
            Goat: 8,
            Monkey: 9,
            Rooster: 10,
            Dog: 11,
            Pig: 12,
        },
        zodiacElementMap: {
            Rat: 'Water',
            Ox: 'Earth',
            Tiger: 'Wood',
            Rabbit: 'Wood',
            Dragon: 'Earth',
            Snake: 'Fire',
            Horse: 'Fire',
            Goat: 'Earth',
            Monkey: 'Metal',
            Rooster: 'Metal',
            Dog: 'Earth',
            Pig: 'Water',
        },
        zodiacClashMap: {
            Rat: 'Horse',
            Ox: 'Goat',
            Tiger: 'Monkey',
            Rabbit: 'Rooster',
            Dragon: 'Dog',
            Snake: 'Pig',
            Horse: 'Rat',
            Goat: 'Ox',
            Monkey: 'Tiger',
            Rooster: 'Rabbit',
            Dog: 'Dragon',
            Pig: 'Snake',
        },
        zodiacLHMap: {
            Rat: 'Ox',
            Ox: 'Rat',
            Tiger: 'Pig',
            Rabbit: 'Dog',
            Dragon: 'Rooster',
            Snake: 'Monkey',
            Horse: 'Goat',
            Goat: 'Horse',
            Monkey: 'Snake',
            Rooster: 'Dragon',
            Dog: 'Rabbit',
            Pig: 'Tiger',
        },
        zodiacSHMap: {
            Rat: ['Dragon', 'Monkey'],
            Ox: ['Snake', 'Rooster'],
            Tiger: ['Horse', 'Dog'],
            Rabbit: ['Goat', 'Pig'],
            Dragon: ['Rat', 'Monkey'],
            Snake: ['Ox', 'Rooster'],
            Horse: ['Tiger', 'Dog'],
            Goat: ['Rabbit', 'Pig'],
            Monkey: ['Rat', 'Dragon'],
            Rooster: ['Ox', 'Snake'],
            Dog: ['Tiger', 'Horse'],
            Pig: ['Rabbit', 'Goat'],
        },
        blossomMap: {
            Tiger: ['Rabbit'],
            Horse: ['Rabbit'],
            Dog: ['Rabbit'],
            Rabbit: ['Rat'],
            Pig: ['Rat'],
            Goat: ['Rat'],
            Snake: ['Horse'],
            Rooster: ['Horse'],
            Ox: ['Horse'],
            Monkey: ['Rooster'],
            Rat: ['Rooster'],
            Dragon: ['Rooster'],
        },
        getGeneratingElement: (element) => {
            if (element === 'Wood') return 'Water'
            if (element === 'Fire') return 'Wood'
            if (element === 'Earth') return 'Fire'
            if (element === 'Metal') return 'Earth'
            if (element === 'Water') return 'Metal'
            return null
        },
        getControllingElement: (element) => {
            if (element === 'WOOD') return 'METAL'
            if (element === 'FIRE') return 'WATER'
            if (element === 'EARTH') return 'WOOD'
            if (element === 'METAL') return 'FIRE'
            if (element === 'WATER') return 'EARTH'
            return null
        },
        getOutputElement: (element) => {
            if (element === 'WOOD') return 'FIRE'
            if (element === 'FIRE') return 'EARTH'
            if (element === 'EARTH') return 'METAL'
            if (element === 'METAL') return 'WATER'
            if (element === 'WATER') return 'WOOD'
            return null
        },
        getExhaustElement: (element) => {
            if (element === 'WOOD') return 'EARTH'
            if (element === 'FIRE') return 'METAL'
            if (element === 'EARTH') return 'WATER'
            if (element === 'METAL') return 'WOOD'
            if (element === 'WATER') return 'FIRE'
            return null
        },
        //'Bool_DT_Self_Day_Current_Month'
        //'Bool_DT_Self_Year_Current_Year'
        boolWeightRankMap: {
            /*'Destruction': {
                'Important: [
                    'Bool_DT_Self_Day_Current_Month',
                    'Bool_DT_Self_Year_Current_Year'
                ]
            },
            */
            'Clash': {
                'Crucial': [
                    'Bool_CL_Self_Year_Current_Month',
                    'Bool_CL_Self_Day_Current_Month',
                    'Bool_CL_Self_Day_Current_Year',
                    'Bool_CL_Self_Year_Current_Year',
                ],
                'Important': [
                    'Bool_CL_Self_Month_Current_Month',
                ],
                'Normal': [
                    'Bool_CL_Self_Year_Current_Day',
                    'Bool_CL_Self_Month_Current_Year',
                    'Bool_CL_Self_Month_Current_Day',
                    'Bool_CL_Self_Day_Current_Day'
                ],
                'Self': [
                    'Bool_CL_Self_Year_Month',
                    'Bool_CL_Self_Year_Day',
                    'Bool_CL_Self_Month_Day'
                ]
            },
            'Hex': {
                'Crucial': [
                    'Bool_LH_Self_Year_Current_Month',
                    'Bool_LH_Self_Day_Current_Month',
                    'Bool_LH_Self_Day_Current_Year',
                    'Bool_LH_Self_Year_Current_Year',
                ],
                'Important': [
                    'Bool_LH_Self_Month_Current_Month',
                ],
                'Normal': [
                    'Bool_LH_Self_Year_Current_Day',
                    'Bool_LH_Self_Month_Current_Year',
                    'Bool_LH_Self_Month_Current_Day',
                    'Bool_LH_Self_Day_Current_Day'
                ],
                'Self': [
                    'Bool_LH_Self_Year_Month',
                    'Bool_LH_Self_Year_Day',
                    'Bool_LH_Self_Month_Day'
                ]
            },
            'Tri': {
                'Crucial': [
                    'Bool_SH_Self_Year_Current_Month_Day',
                    'Bool_SH_Self_Day_Current_Month_Day'
                ],
                'Self': [
                    'Bool_SH_Self'
                ]
            } 
        }
    }

    return config
}
