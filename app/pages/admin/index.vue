<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>

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

const auth = useAuthStore()
const config = useRuntimeConfig()
const loading = ref(true)
const stats = ref<any>(null)

onMounted(async () => {
    auth.loadFromStorage()

    if (!auth.token) {
        return navigateTo('/login')
    }

    try {
        const data: any = await $fetch('/admin/dashboard', {
            baseURL: config.public.apiBase as string,
            headers: { Authorization: `Bearer ${auth.token}` },
        })
        stats.value = data.summary
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>