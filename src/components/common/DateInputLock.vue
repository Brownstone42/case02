<template>
    <div class="date-input-lock">
        <NumberLockDial
            v-for="(dialValue, index) in dateValues"
            :key="index"
            v-model="dateValues[index]"
            :min="0"
            :max="9"
            :class="{ 'is-separator': isSeparator(index) }"
        />
    </div>
</template>

<script>
import NumberLockDial from '@/components/common/NumberLockDial.vue'

export default {
    name: 'DateInputLock',
    components: {
        NumberLockDial,
    },
    props: {
        modelValue: {
            type: String,
            default: '01012025',
        },
    },
    data() {
        const initialDateValues = this.modelValue.split('').map(Number)
        return {
            dateValues: initialDateValues,
            test: 5,
        }
    },
    watch: {
        // We no longer need the watch.modelValue with immediate: true.
        // We still need to watch our local dateValues array to emit to the parent.
        dateValues: {
            handler(newValues) {
                // Convert the array [0, 1, 0, 1, 2, 0, 2, 5] back to a string '01012025'
                const newDateString = newValues.map(String).join('')
                // Emit the updated string back to the parent
                this.$emit('update:modelValue', newDateString)
            },
            deep: true, // This is crucial to watch for changes to items *within* the array
        },
    },
    methods: {
        isSeparator(index) {
            return index === 1 || index === 3
        },
    },
}
</script>

<style scoped lang="scss">
.date-input-lock {
    display: flex;
    justify-content: center;
    gap: 0.5rem; /* Space between dials */
}

.number-lock-dial.is-separator {
    // We'll add some margin to create the visual separation for the '/'
    margin-right: 1.25rem; /* Add more space for separator */
}
</style>
