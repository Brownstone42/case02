<template>
    <div class="home-hero" @click="navigateToProductConfig">
        <div class="hero-content">
            <h1 class="title is-1 has-text-white has-text-centered">
                Discover Your Unique BaZi Case
            </h1>
            <p class="subtitle is-3 has-text-white has-text-centered">
                Click anywhere to begin your personalized design journey.
            </p>
            <div class="has-text-centered mt-5">
                <a class="button is-primary is-large is-rounded"> Start Now! </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    methods: {
        navigateToProductConfig() {
            this.$router.push('/case')
        },
    },
}
</script>

<style scoped lang="scss">
.home-hero {
    height: calc(100vh - 4rem);
    margin-top: 4rem;
    width: 100vw;
    background-image: url('@/assets/images/home-hero-bg.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 1;
    }
}
.hero-content {
    position: relative; /* Bring content above the overlay */
    z-index: 2;
    text-align: center;
    padding: 1.5rem; /* Add some padding */
    max-width: 900px; /* Limit width for better readability on large screens */
}
.title,
.subtitle {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5); /* Add text shadow for readability */
}
</style>
