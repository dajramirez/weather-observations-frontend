export default defineNuxtRouteMiddleware(() => {
    if (import.meta.server) return

    const auth = useAuthStore()
    auth.loadFromStorage()

    if (!auth.isAuthenticated) {
        return navigateTo('/login')
    }
})