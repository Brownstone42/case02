<template>
    <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <router-link to="/" class="navbar-item">
                <img src="@/assets/images/logo.svg" alt="BaZi Case Logo" width="112" height="28" />
            </router-link>

            <a
                role="button"
                class="navbar-burger"
                aria-label="menu"
                aria-expanded="false"
                data-target="navbarBasicExample"
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
                <router-link to="/" class="navbar-item"> Home </router-link>
                <router-link to="/case" class="navbar-item"> Case </router-link>
                <router-link to="/calendar" class="navbar-item"> Calendar </router-link>
                <router-link
                    to="/admin"
                    class="navbar-item"
                    v-if="
                        authStore.currentUser &&
                        authStore.currentUser.email === 'anawatbooch@gmail.com'
                    "
                >
                    Admin
                </router-link>
            </div>
            <div class="navbar-end">
                <div class="navbar-item" v-if="authStore.isLoggedIn">
                    <a class="button is-light">
                        <span class="icon"> <i class="fas fa-shopping-cart"></i> </span>
                        <span>Cart</span>
                    </a>
                </div>
                <div class="navbar-item">
                    <div class="buttons">
                        <template v-if="authStore.isLoggedIn">
                            <span class="navbar-item-text has-text-grey-dark mr-2 is-size-6">
                                Hello, {{ authStore.userName }}
                            </span>
                            <a class="button is-danger" @click="handleSignOut">
                                <strong>Logout</strong>
                            </a>
                        </template>
                        <template v-else>
                            <a class="button is-primary" @click="handleSignIn">
                                <strong>Login</strong>
                            </a>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { mapStores } from 'pinia'

export default {
    name: 'AppHeader',
    computed: {
        ...mapStores(useAuthStore),
    },
    mounted() {
        const $navbarBurgers = Array.prototype.slice.call(
            document.querySelectorAll('.navbar-burger'),
            0,
        )

        if ($navbarBurgers.length > 0) {
            $navbarBurgers.forEach((el) => {
                el.addEventListener('click', () => {
                    const target = el.dataset.target
                    const $target = document.getElementById(target)
                    el.classList.toggle('is-active')
                    $target.classList.toggle('is-active')
                })
            })
        }
    },
    methods: {
        async handleSignIn() {
            try {
                await this.authStore.signInWithGoogle()
            } catch (error) {
                console.error('Sign-in failed in component:', error.message)
            }
        },
        async handleSignOut() {
            try {
                await this.authStore.signOut()
                if (this.$router && this.$route.path === '/admin') {
                    this.$router.push('/')
                }
            } catch (error) {
                console.error('Logout failed in component:', error.message)
            }
        },
    },
}
</script>

<style scoped lang="scss">
.navbar {
    height: 4rem; /* Example fixed height for your header */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure it stays on top */
}
.navbar-item img {
    max-height: 2.5rem; /* Ensure logo fits within navbar height */
}
</style>
