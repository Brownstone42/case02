<template>
    <div class="birth-date-input-component">
        <div class="field">
            <div class="control">
                <Datepicker
                    v-model="selectedDate"
                    :format="dateFormat"
                    placeholder="Select your birth date"
                    model-type="timestamp"
                    text-input
                    :year-range="[1850, 2150]"
                    :enable-time-picker="false"
                ></Datepicker>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    name: 'BirthDateNoTimeInput',
    components: {
        Datepicker,
    },
    props: ['modelValue'],
    data() {
        return {
            dateFormat: 'dd/MM/yyyy',
            selectedDate: this.modelValue,
        }
    },
    watch: {
        modelValue(newVal) {
            this.selectedDate = newVal
        },
        selectedDate(newVal) {
            console.log('BirthDateInput: Emitting date', newVal)
            this.$emit('update:modelValue', newVal)
        },
    },
}
</script>

<style scoped lang="scss">
// ... (no changes needed here for now) ...
</style>
