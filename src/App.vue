<template>
    <AppHeader />
    <router-view></router-view>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue'

export default {
    name: 'App',
    components: {
        AppHeader,
    },
}
</script>

<style lang="scss">
/* Global styles or overrides for Bulma can go here if not in main.scss */
/* Ensure HTML and body take full height */
html,
body {
    height: 100%;
}
#app {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Ensure app takes at least full viewport height */
}
</style>
