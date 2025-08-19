<template>
    <div class="compatible-page-wrap">
        <h2 class="title is-3 has-text-centered mb-5">Find Compatible</h2>

        <div class="compatible-sections columns is-desktop">
            <div class="column is-half-desktop">
                <div class="box">
                    <h3 class="title is-4 has-text-centered mb-4">YOU</h3>

                    <DateInputLock v-model="youBirthDate" />

                    <div class="box">
                        <p class="is-size-5 has-text-centered">ELEMENT + ZODIAC RESULT DISPLAY</p>
                    </div>
                </div>
            </div>

            <div class="column is-half-desktop">
                <div class="box">
                    <h3 class="title is-4 has-text-centered mb-4">OTHER</h3>

                    <DateInputLock v-model="otherBirthDate" />

                    <div class="box">
                        <p class="is-size-5 has-text-centered">ELEMENT + ZODIAC RESULT DISPLAY</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="summary-section box mt-5">
            <h3 class="title is-4 has-text-centered">SUMMARY SECTION</h3>
            <p>Content for the compatibility summary will go here.</p>
        </div>
    </div>
</template>

<script>
import DateInputLock from '@/components/common/DateInputLock.vue'

export default {
    name: 'Compatible',
    components: {
        DateInputLock,
    },
    data() {
        return {
            youBirthDate: '01012025',
            otherBirthDate: '01012025',
        }
    },
}
</script>

<style scoped lang="scss">
.compatible-page-wrap {
    //padding: 2rem;
}

.compatible-sections {
    align-items: flex-start; /* Ensures columns align to the top */
}

.column .box {
    padding: 1.5rem;
}

.summary-section {
    max-width: 100%;
    //padding: 2rem;
}
</style>
