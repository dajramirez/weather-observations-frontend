<template>
    <div>
        <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <NuxtLink to="/help/observer/" target="_blank"
                class="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-600 flex items-center justify-center transition-colors flex-shrink-0"
                title="Ayuda con esta sección">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </NuxtLink>
        </div>
        <p class="text-gray-500 mt-1">Consulta el estado de las estaciones meteorológicas y alertas activas.</p>
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

const { api } = useApi()
const auth = useAuthStore()
const loading = ref(true)
const stats = ref<any>(null)
const recentObservations = ref<any[]>([])

onMounted(async () => {
    auth.loadFromStorage()

    if (!auth.token) {
        return navigateTo('/login')
    }

    try {
        const data: any = await api('/observer/dashboard')
        stats.value = data.stats
        recentObservations.value = data.recent_observations
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>