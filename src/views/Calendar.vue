<template>
    <div class="wrap section">
        <h1 class="title is-2 has-text-centered mb-5">BaZi Calendar</h1>

        <div class="calendar-controls">
            <div class="buttons is-centered">
                <router-link to="/calendar/self-analyze" class="button calendar-nav-button"
                    >Self Analyze</router-link
                >
                <router-link to="/calendar/self-yearly" class="button calendar-nav-button"
                    >Self Yearly</router-link
                >
                <router-link to="/calendar/compatible" class="button calendar-nav-button"
                    >Compatible</router-link
                >
                <router-link to="/calendar/find-occasion" class="button calendar-nav-button"
                    >Find Occasion</router-link
                >
            </div>
        </div>

        <div class="calendar-content box mt-5">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'calendar',
}
</script>

<style scoped lang="scss">
div.wrap {
    margin-top: 4rem;
    padding: 1.5rem;
}

.calendar-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    justify-content: center; // Center the buttons
}

.calendar-content {
    margin: 0 auto;
    padding: 2rem;
}

.calendar-nav-button {
    background-color: #f5f5f5; /* A light gray background */
    color: #7a7a7a; /* A medium gray text color */
    border-color: #dbdbdb; /* A light border color */
}

.calendar-nav-button.router-link-active {
    background-color: #209ce7; /* Example: Bulma's 'info' blue color */
    color: #fff; /* White text for contrast */
    border-color: transparent; /* Remove the border */
}
</style>
