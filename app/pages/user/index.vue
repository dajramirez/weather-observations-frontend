<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Panel de consulta</h1>
            <p class="text-gray-500 mt-1">Consulta el estado de las estaciones meteorológicas y alertas activas.</p>
        </div>

        <!-- Stats -->
        <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ stations.length }}</p>
                <p class="text-sm text-gray-500 mt-1">Estaciones activas</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <p class="text-3xl font-bold text-red-500">{{ activeAlerts.length }}</p>
                <p class="text-sm text-gray-500 mt-1">Alertas activas</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <p class="text-3xl font-bold text-green-600">{{ avgAltitude }}</p>
                <p class="text-sm text-gray-500 mt-1">Altitud media (m)</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                <p class="text-3xl font-bold text-purple-600">{{ uniqueLocations }}</p>
                <p class="text-sm text-gray-500 mt-1">Ubicaciones distintas</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Stations -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Estaciones meteorológicas</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Haz click en una estación para ver sus últimas observaciones
                    </p>
                </div>
                <div v-if="loading" class="p-6 text-sm text-gray-400">Cargando estaciones...</div>
                <div v-else class="divide-y divide-gray-50">
                    <div v-for="station in stations" :key="station.id">
                        <button @click="toggleStation(station.id)"
                            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
                            <div>
                                <p class="text-sm font-medium text-gray-900">{{ station.name }}</p>
                                <p class="text-xs text-gray-400 mt-0.5">{{ station.location }}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {{ station.altitude }} m
                                </span>
                                <svg :class="expandedStation === station.id ? 'rotate-180' : ''"
                                    class="h-4 w-4 text-gray-400 transition-transform"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        <!-- Expanded panel -->
                        <div v-if="expandedStation === station.id"
                            class="px-6 pb-4 bg-blue-50 border-t border-blue-100">
                            <div v-if="loadingObs" class="text-xs text-gray-400 py-3">Cargando observaciones...</div>
                            <div v-else-if="latestObs.length > 0">
                                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-2">
                                    Últimas observaciones
                                </p>
                                <div class="space-y-2">
                                    <div v-for="obs in latestObs" :key="obs.id"
                                        class="bg-white rounded-lg px-4 py-2 text-xs text-gray-600 flex flex-wrap gap-4">
                                        <span class="text-gray-400">{{ formatDate(obs.observed_at) }}</span>
                                        <span v-if="obs.temperature != null">🌡 {{ obs.temperature }}°C</span>
                                        <span v-if="obs.humidity != null">💧 {{ obs.humidity }}%</span>
                                        <span v-if="obs.pressure != null">🔵 {{ obs.pressure }} hPa</span>
                                        <span v-if="obs.wind_speed != null">💨 {{ obs.wind_speed }} km/h</span>
                                        <span v-if="obs.precipitation != null">🌧 {{ obs.precipitation }} mm</span>
                                    </div>
                                </div>
                            </div>
                            <p v-else class="text-xs text-gray-400 py-3">No hay observaciones registradas.</p>
                        </div>
                    </div>
                    <p v-if="stations.length === 0" class="px-6 py-4 text-sm text-gray-400">
                        No hay estaciones registradas.
                    </p>
                </div>
            </div>

            <!-- Active alerts -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Alertas activas</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Últimas alertas vigentes en el sistema</p>
                </div>
                <div v-if="loading" class="p-6 text-sm text-gray-400">Cargando alertas...</div>
                <div v-else class="divide-y divide-gray-50">
                    <div v-for="alert in activeAlerts" :key="alert.id"
                        class="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div class="flex items-center justify-between mb-1">
                            <span :class="levelClass(alert.level)" class="px-2 py-0.5 rounded-full text-xs font-medium">
                                {{ alert.title }}
                            </span>
                            <span class="text-xs text-gray-400">{{ alert.station?.name ?? '—' }}</span>
                        </div>
                        <p class="text-xs text-gray-500 truncate">{{ alert.message }}</p>
                    </div>
                    <p v-if="activeAlerts.length === 0" class="px-6 py-4 text-sm text-gray-400">
                        No hay alertas activas en este momento.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth'] })

const { formatDate } = useFormatters()
const config = useRuntimeConfig()

const stations = ref<any[]>([])
const activeAlerts = ref<any[]>([])
const loading = ref(true)
const expandedStation = ref<number | null>(null)
const latestObs = ref<any[]>([])
const loadingObs = ref(false)

const avgAltitude = computed(() => {
    if (!stations.value.length) return 0
    return Math.round(stations.value.reduce((sum, s) => sum + (Number(s.altitude) || 0), 0) / stations.value.length)
})

const uniqueLocations = computed(() =>
    new Set(stations.value.map(s => s.location)).size
)

const levelClass = (level: string) => {
    const map: Record<string, string> = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-700',
        red: 'bg-red-100 text-red-700',
    }
    return map[level] ?? 'bg-gray-100 text-gray-600'
}

async function toggleStation(id: number) {
    if (expandedStation.value === id) {
        expandedStation.value = null
        latestObs.value = []
        return
    }
    expandedStation.value = id
    loadingObs.value = true
    try {
        const data: any = await $fetch(`/public/stations/${id}/observations`, {
            baseURL: config.public.apiBase as string,
        })
        latestObs.value = data.data ?? []
    } catch {
        latestObs.value = []
    } finally {
        loadingObs.value = false
    }
}

onMounted(async () => {
    try {
        const data: any = await $fetch('/public', {
            baseURL: config.public.apiBase as string,
        })
        stations.value = data.stations ?? []
        activeAlerts.value = data.active_alerts ?? []
    } catch {
        // If loading fails, show the page anyway
    } finally {
        loading.value = false
    }
})
</script>