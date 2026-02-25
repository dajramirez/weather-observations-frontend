export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    auth.loadFromStorage()

    const requiredRole = to.meta.role as string | undefined

    if (!requiredRole) return

    if (requiredRole === 'admin' && !auth.isAdmin) {
        return navigateTo('/login')
    }

    if (requiredRole === 'observer' && !auth.isObserver) {
        return navigateTo('/login')
    }
})