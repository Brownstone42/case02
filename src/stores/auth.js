import { defineStore } from 'pinia'
import { auth } from '@/firebase'

import {
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut as firebaseSignOut,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false,
        authInitialized: false,
    }),
    getters: {
        currentUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated,
        userName: (state) => (state.user ? state.user.displayName || state.user.email : 'Guest'),
        userPhotoURL: (state) => (state.user ? state.user.photoURL : null),
    },
    actions: {
        async signInWithGoogle() {
            const provider = new GoogleAuthProvider()
            try {
                console.log('1. signInWithGoogle: Attempting pop-up sign-in...')
                const result = await signInWithPopup(auth, provider)
                console.log(
                    '2. signInWithGoogle: Pop-up closed, result obtained. User ID:',
                    result.user.uid,
                )
                this.user = result.user // Update the user in the store
                this.isAuthenticated = true // Set authenticated to true
                console.log(
                    '2a. signInWithGoogle: Store state manually updated. IsAuthenticated:',
                    this.isAuthenticated,
                )
                return true
            } catch (error) {
                console.error('Google Sign-in error:', error)
                throw error
            }
        },
        async signOut() {
            try {
                await firebaseSignOut(auth)
                console.log('Sign-out process initiated.')
                return true
            } catch (error) {
                console.error('Sign-out error:', error)
                throw error
            }
        },
        initAuthListener() {
            if (this.authInitialized) {
                console.log('Auth listener already initialized.')
                return
            }
            console.log('0. initAuthListener: Setting up Firebase auth state listener.')

            onAuthStateChanged(auth, (user) => {
                if (user) {
                    this.user = user
                    this.isAuthenticated = true
                    console.log(
                        '3. Auth State Changed: User detected, setting store state. UID:',
                        user.uid,
                    )
                } else {
                    this.user = null
                    this.isAuthenticated = false
                    console.log('4. Auth State Changed: No user detected, clearing store state.')
                }
                this.authInitialized = true
                console.log(
                    '5. Auth State Changed: Auth initialization complete/state updated. IsAuthenticated:',
                    this.isAuthenticated,
                )
            })
        },
    },
})
