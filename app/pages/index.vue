<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navbar -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <span class="font-bold text-lg text-blue-600">WeatherObs</span>
                <NuxtLink to="/login"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Acceder
                </NuxtLink>
            </div>
        </nav>

        <!-- Hero -->
        <div class="bg-white border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-4 py-16 text-center">
                <div
                    class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                    Sistema de monitorización meteorológica
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">WheatherObs</h1>
                <p class="text-gray-500 text-lg max-w-xl mx-auto mb-8">
                    Plataforma de gestión y consulta de estaciones meteorológicas. Monitoriza observaciones, alertas y
                    genera informes en tiempo real.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <NuxtLink to="/login"
                        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Acceder al sistema
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 py-10 space-y-10">

            <!-- Stats rápidas -->
            <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-blue-600">{{ stations.length }}</p>
                    <p class="text-sm text-gray-500 mt-1">Estaciones activas</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-red-500">{{ activeAlerts.length }}</p>
                    <p class="text-sm text-gray-500 mt-1">Alertas activas</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-green-600">{{ stationsWithAltitude }}</p>
                    <p class="text-sm text-gray-500 mt-1">Altitud media (m)</p>
                </div>
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center">
                    <p class="text-3xl font-bold text-purple-600">{{ uniqueLocations }}</p>
                    <p class="text-sm text-gray-500 mt-1">Ubicaciones distintas</p>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Estaciones-->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Estaciones meteorológicas</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Listado de todas las estaciones del sistema</p>
                </div>
                <div v-if="loading" class="p-6 text-sm text-gray-400">Cargando estaciones...</div>
                <div v-else class="divide-y divide-gray-50">
                    <div v-for="station in stations" :key="station.id"
                        class="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div>
                            <p class="text-sm font-medium text-gray-900">{{ station.name }}</p>
                            <p class="text-xs text-gray-400 mt-0.5">{{ station.location }}</p>
                        </div>
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {{ station.altitude }} m
                        </span>
                    </div>
                    <p v-if="stations.length === 0" class="px-6 py-4 text-sm text-gray-400">No hay estaciones
                        registradas</p>
                </div>
            </div>

            <!-- Alertas activas -->
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
                            <span class="text-xs text-gray-400">{{ alert.station?.name ?? '-' }}</span>
                        </div>
                        <p class="text-xs text-gray-500 truncate">{{ alert.message }}</p>
                    </div>
                    <p v-if="activeAlerts.length === 0" class="px-6 py-4 text-sm text-gray-400">
                        No hay alertas activas en este momento.
                    </p>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-xs text-gray-400 pb-6">
            WeatherObs · Sistema de gestión meteorológica ·
            <NuxtLink to="/login" class="text-blue-500 hover:underline">Acceder</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const config = useRuntimeConfig()

const stations = ref<any[]>([])
const activeAlerts = ref<any[]>([])
const loading = ref(true)

const stationsWithAltitude = computed(() => {
    if (!stations.value.length) return 0
    const avg = stations.value.reduce((sum, s) => sum + (s.altitude ?? 0), 0) / stations.value.length
    return Math.round(avg)
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

onMounted(async () => {
    try {
        const data: any = await $fetch('/public', {
            baseURL: config.public.apiBase
        })
        stations.value = data.stations ?? []
        activeAlerts.value = data.active_alerts ?? []
    } catch {
        // Si falla la carga mostramos la página igualmente
    } finally {
        loading.value = false
    }
})
</script>