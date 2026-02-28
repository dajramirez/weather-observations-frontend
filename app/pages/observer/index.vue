<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard Observador</h1>

        <div v-if="loading" class="text-gray-500">Cargando...</div>

        <div v-else class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p class="text-3xl font-bold text-blue-600">{{ stats?.total_assigned ?? '-' }}</p>
                    <p class="text-sm text-gray-500 mt-1">Estaciones asignadas</p>
                </div>
                <div class="bg-white rounded-lg shadow-sm p-4 text-center">
                    <p class="text-3xl font-bold text-blue-600">{{ stats?.year_average_temperature ?? '-' }}°C</p>
                    <p class="text-sm text-gray-500 mt-1">Temperatura media anual</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-4">
                <h2 class="font-semibold text-gray-700 mb-3">Últimas observaciones</h2>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left text-gray-500 border-b">
                            <th class="pb-2">Estación</th>
                            <th class="pb-2">Temperatura</th>
                            <th class="pb-2">Humedad</th>
                            <th class="pb-2">Fecha y hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="obs in recentObservations" :key="obs.id" class="border-b last:border-0">
                            <td class="py-2">{{ obs.station?.name }}</td>
                            <td class="py-2">{{ obs.temperature }}°C</td>
                            <td class="py-2">{{ obs.humidity }}%</td>
                            <td class="py-2">{{ new Date(obs.observed_at).toLocaleString('es-ES') }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="recentObservations.length === 0" class="text-gray-400 text-sm mt-2">
                    No hay observaciones recientes
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="tsx">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    meta: { role: 'observer' },
})

const auth = useAuthStore()
const config = useRuntimeConfig()
const loading = ref(true)
const stats = ref<any>(null)
const recentObservations = ref<any[]>([])

onMounted(async () => {
    auth.loadFromStorage()

    if (!auth.token) {
        return navigateTo('/login')
    }

    try {
        const data: any = await $fetch('/observer/dashboard', {
            baseURL: config.public.apiBase as string,
            headers: { Authorization: `Bearer ${auth.token}` },
        })
        stats.value = data.stats
        recentObservations.value = data.recent_observations
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>