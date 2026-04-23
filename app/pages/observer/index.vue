<template>
    <div>
        <!-- Header -->
        <div class="flex items-center gap-2 mb-1">
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
        <p class="text-gray-500 mt-1 mb-6">Resumen de tu actividad y estaciones asignadas.</p>

        <div v-if="loading" class="text-gray-500 text-sm">Cargando...</div>

        <div v-else class="space-y-6">

            <!-- Stats -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-blue-600">{{ stats?.total_assigned ?? '-' }}</p>
                    <p class="text-sm text-gray-500 mt-1">Estaciones asignadas</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-green-600">{{ stats?.year_average_temperature ?? '-' }}°C</p>
                    <p class="text-sm text-gray-500 mt-1">Temp. media anual</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-purple-600">{{ recentObservations.length }}</p>
                    <p class="text-sm text-gray-500 mt-1">Últimas observaciones</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <!-- Estaciones asignadas -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-base font-semibold text-gray-900">Estaciones asignadas</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Estaciones en las que puedes registrar observaciones</p>
                    </div>
                    <div class="divide-y divide-gray-50">
                        <div v-for="station in stations" :key="station.id"
                            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ station.name }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ station.location }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {{ station.altitude }} m
                                </span>
                                <span class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    {{ station.observations_count }} obs.
                                </span>
                            </div>
                        </div>
                        <p v-if="stations.length === 0" class="px-6 py-4 text-sm text-gray-400">
                            No tienes estaciones asignadas.
                        </p>
                    </div>
                </div>

                <!-- Últimas observaciones -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-base font-semibold text-gray-900">Últimas observaciones</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Tus 10 registros más recientes</p>
                    </div>
                    <div class="divide-y divide-gray-50">
                        <div v-for="obs in recentObservations" :key="obs.id"
                            class="px-6 py-3 hover:bg-gray-50 transition-colors">
                            <div class="flex items-center justify-between mb-1">
                                <span class="text-sm font-medium text-gray-900">{{ obs.station?.name }}</span>
                                <span class="text-xs text-gray-400">{{
                                    new Date(obs.observed_at).toLocaleString('es-ES') }}</span>
                            </div>
                            <div class="flex flex-wrap gap-3 text-xs text-gray-500">
                                <span v-if="obs.temperature != null">🌡 {{ obs.temperature }}°C</span>
                                <span v-if="obs.humidity != null">💧 {{ obs.humidity }}%</span>
                                <span v-if="obs.pressure != null">🔵 {{ obs.pressure }} hPa</span>
                                <span v-if="obs.wind_speed != null">💨 {{ obs.wind_speed }} km/h</span>
                                <span v-if="obs.precipitation != null">🌧 {{ obs.precipitation }} mm</span>
                            </div>
                        </div>
                        <p v-if="recentObservations.length === 0" class="px-6 py-4 text-sm text-gray-400">
                            No hay observaciones recientes.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    meta: { role: 'observer' },
})

const { api } = useApi()
const auth = useAuthStore()
const loading = ref(true)
const stats = ref<any>(null)
const stations = ref<any[]>([])
const recentObservations = ref<any[]>([])

onMounted(async () => {
    auth.loadFromStorage()

    if (!auth.token) {
        return navigateTo('/login')
    }

    try {
        const data: any = await api('/observer/dashboard')
        stats.value = data.stats
        stations.value = data.stations ?? []
        recentObservations.value = data.recent_observations ?? []
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>