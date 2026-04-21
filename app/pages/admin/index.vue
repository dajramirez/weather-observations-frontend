<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

        <NuxtLink to="/help/admin" target="_blank"
            class="text-xs text-gray-400 hover:text-blue-500 transition flex items-center gap-1 border-l pl-3 border-gray-200 h-5 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¿Ayuda con esta sección?
        </NuxtLink>

        <div v-if="loading" class="text-gray-500">Cargando...</div>

        <div v-else class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ stats?.total_users ?? '-' }}</p>
                <p class="text-sm text-gray-500 mt-1">Usuarios</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ stats?.total_stations ?? '-' }}</p>
                <p class="text-sm text-gray-500 mt-1">Estaciones</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ stats?.total_observations ?? '-' }}</p>
                <p class="text-sm text-gray-500 mt-1">Observaciones</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ stats?.active_alerts ?? '-' }}</p>
                <p class="text-sm text-gray-500 mt-1">Alertas activas</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    meta: { role: 'admin' },
})

const { api } = useApi()

const auth = useAuthStore()
const loading = ref(true)
const stats = ref<any>(null)

onMounted(async () => {
    auth.loadFromStorage()

    if (!auth.token) {
        return navigateTo('/login')
    }

    try {
        const data: any = await api('/admin/dashboard')
        stats.value = data.summary
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>