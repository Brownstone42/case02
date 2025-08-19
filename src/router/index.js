import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomePage from '../views/HomePage.vue'
import Case from '../views/Case.vue'
import Calendar from '../views/Calendar.vue'
import Admin from '../views/Admin.vue'

import SelfAnalyze from '@/components/calendar/SelfAnalyze.vue'
import SelfYearly from '@/components/calendar/SelfYearly.vue'
import Compatible from '@/components/calendar/Compatible.vue'
import FindOccasion from '@/components/calendar/FindOccasion.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/case',
        name: 'case',
        component: Case,
    },
    {
        path: '/calendar',
        component: Calendar,
        children: [
            {
                path: 'self-analyze', // Full path: /calendar/self-yearly
                name: 'calendar-self-analyze',
                component: SelfAnalyze,
            },
            {
                path: 'self-yearly', // Full path: /calendar/self-yearly
                name: 'calendar-self-yearly',
                component: SelfYearly,
            },
            {
                path: 'compatible', // Full path: /calendar/compatible
                name: 'calendar-compatible',
                component: Compatible,
            },
            {
                path: 'find-occasion', // Full path: /calendar/find-occasion
                name: 'calendar-find-occasion',
                component: FindOccasion,
            },
            {
                path: '', // Default child route for /calendar
                name: 'calendar',
                redirect: { name: 'calendar-self-yearly' },
            },
        ],
    },
    {
        path: '/admin',
        name: 'admin',
        component: Admin,
        meta: { requiresAuth: true, adminOnly: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore() // Access your Pinia auth store

    // 🔥 IMPORTANT: Wait for Firebase Auth to initialize 🔥
    // This prevents redirecting before Firebase has checked if a user is logged in
    // (e.g., if they were logged in from a previous session).
    if (!authStore.authInitialized) {
        await new Promise((resolve) => {
            // If auth is already initialized, resolve immediately
            if (authStore.authInitialized) {
                resolve()
            } else {
                // Otherwise, set up a one-time subscription to wait for authInitialized to become true
                const unsubscribe = authStore.$subscribe((mutation, state) => {
                    if (state.authInitialized) {
                        unsubscribe() // Clean up the subscription
                        resolve()
                    }
                })
            }
        })
    }

    // Check if the target route requires authentication or is admin-only
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
    const adminOnly = to.matched.some((record) => record.meta.adminOnly)

    if (requiresAuth || adminOnly) {
        // Case 1: Route requires authentication
        if (!authStore.isLoggedIn) {
            console.log(
                'Navigation Guard: Route requires login, but user is not authenticated. Redirecting to Home.',
            )
            next('/') // Redirect to the home page (or a dedicated login page)
        }
        // Case 2: Route requires admin, and user is logged in but not the specific admin
        else if (
            adminOnly &&
            authStore.currentUser &&
            authStore.currentUser.email !== 'anawatbooch@gmail.com'
        ) {
            console.log(
                'Navigation Guard: Route requires admin, but user is not the admin. Redirecting to Home.',
            )
            next('/') // Redirect to the home page
        }
        // Case 3: User is authenticated and meets all requirements (or route doesn't require admin)
        else {
            next() // Allow access to the route
        }
    } else {
        // Case 4: Route does not require authentication or admin access, allow everyone
        next() // Always allow access
    }
})

export default router
