<template>
    <div class="birth-date-input-component">
        <div class="field">
            <label class="label">Birth Date</label>
            <div class="control">
                <Datepicker
                    v-model="birthDate"
                    :format="dateFormat"
                    placeholder="Select your birth date"
                    model-type="timestamp"
                    :enable-time-picker="false"
                ></Datepicker>
            </div>
        </div>

        <div class="field">
            <label class="label">Birth Time</label>
            <div class="control">
                <Datepicker
                    v-model="birthTime"
                    :format="timeFormat"
                    placeholder="Select your birth time"
                    time-picker
                    :is-24="true"
                    :start-time="{ hours: 0, minutes: 0 }"
                    model-type="timestamp"
                ></Datepicker>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'BirthDateInput',
    components: {
        Datepicker,
    },
    data() {
        return {
            birthDate: 620076600000, // Will hold the selected date timestamp
            birthTime: 1752985800000, // Will hold the selected time timestamp
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'HH:mm',
        }
    },
    watch: {
        // Watch for changes in birthDate and emit to parent
        birthDate(newVal) {
            console.log('BirthDateInput: Emitting date', newVal) // For debugging
            this.$emit('update:birthDate', newVal) // Emit the new date value
        },
        // Watch for changes in birthTime and emit to parent
        birthTime(newVal) {
            console.log('BirthDateInput: Emitting time', newVal) // For debugging
            this.$emit('update:birthTime', newVal) // Emit the new time value
        },
    },
}
</script>

<style scoped lang="scss">
// ... (no changes needed here for now) ...
</style>
