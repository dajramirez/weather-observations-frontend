import { navigateTo, useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user : null as any,
        token: null as string | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role?.name === 'admin',
        isObserver: (state) => state.user?.role?.name === 'observer',
    },

    actions: {
        async login(email: string, password: string) {
            const config = useRuntimeConfig()

            const data: any = await $fetch('/login', {
                baseURL: config.public.apiBase as string,
                method: 'POST',
                body: { email, password },
            })

            this.token = data.access_token
            this.user = data.user

            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify(data.user))
        },
        
        logout() {
            $fetch('/api/logout', {
                baseURL: useRuntimeConfig().public.apiBase as string,
                method: 'POST',
                headers: {Authorization: `Bearer ${this.token}`},
            }).finally(() => {
                this.token = null
                this.user = null
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                navigateTo('/login')
            })
        },

        loadFromStorage() {
            const token = localStorage.getItem('token')
            const user = localStorage.getItem('user')
            if (token && user) {
                this.token = token
                this.user = JSON.parse(user)
            }
        }
    },
})