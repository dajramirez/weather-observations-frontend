<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-xl font-bold text-gray-900">Generar Reporte</h1>
            <p class="text-gray-500 mt-1">Consulta y exporta observaciones por estación y rango de fechas</p>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Filtros</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Estación -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estación</label>
                    <select v-model="form.station_id" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        :disabled="loadingStations">
                        <option value="">
                            {{ loadingStations ? 'Cargando estaciones...' : 'Seleccione una estación' }}
                        </option>
                        <option v-for="station in stations" :key="station.id" :value="station.id">
                            {{ station.name }}
                        </option>
                    </select>
                </div>

                <!-- Fecha inicio -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                    <input v-model="form.start_date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <!-- Fecha fin -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                    <input v-model="form.end_date" type="date" class="w-full border border-gray-300 rounded-lg px-3 py-2
                        text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
            </div>

            <!-- Botón generar -->
            <div class="mt-4 flex justify-end">
                <button @click="fetchReport"
                    :disabled="loading || !form.station_id || !form.start_date || !form.end_date" class="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ loading ? 'Generando...' : 'Generar reporte' }}
                </button>
            </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 flex-shrink-0" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-700">{{ error }}</p>
        </div>

        <!-- Resultados -->
        <div v-if="observations.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200">
            <!-- Cabecera resultados -->
            <div class="py-6 px-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 class="text-sm font-semibold text-gray-700">Resultados</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ observations.length }} observaciones encontradas</p>
                    <p v-if="observer" class="text-xs text-gray-500 mt-0.5">
                        Observador: <span class="font-medium text-gray-700">{{ observer.name }}</span>
                    </p>
                </div>
                <button @click="downloadCSV" class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg 
                    hover:bg-green-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar CSV
                </button>
            </div>

            <!-- Tabla -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Fecha / Hora
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Temp. (°C)
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Precip. (mm)
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Humedad (%)
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Presión (hPa)
                            </th>
                            <th
                                class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Viento (km/h)
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="obs in observations" :key="obs.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 text-gray-700 font-medium whitespace-nowrap">
                                {{ formatDate(obs.observed_at) }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span :class="tempColor(obs.temperature)" class="font-medium">
                                    {{ obs.temperature ?? '-' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right text-gray-600">
                                {{ obs.precipitation ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-right text-gray-600">
                                {{ obs.humidity ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-right text-gray-600">
                                {{ obs.pressure ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-right text-gray-600">
                                {{ obs.wind_speed ?? '-' }}
                                <span v-if="obs.wind_direction" class="text-gray-400 text-xs ml-1">
                                    {{ obs.wind_direction }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer estadísticas -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <p class="text-xs text-gray-400">Temp. media</p>
                    <p class="text-lg font-bold text-gray-800">{{ stats.avgTemp }}°C</p>
                    <p class="text-xs text-gray-400">Temp. máx</p>
                    <p class="text-lg font-bold text-red-500">{{ stats.maxTemp }}°C</p>
                    <p class="text-xs text-gray-400">Temp. mín</p>
                    <p class="text-lg font-bold">{{ stats.minTemp }}°C</p>
                    <p class="text-xs text-gray-400">Precip. total</p>
                    <p class="text-lg font-bold">{{ stats.totalPrecip }}mm</p>
                </div>
            </div>
        </div>

        <!-- Estado vacío (después de buscar) -->
        <div v-else-if="searched && !loading"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mx-auto mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-500 font-medium">Sin observaciones en ese rango</p>
            <p class="text-gray-400 text-sm mt-1">Prueba con un rango de fechas diferente.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { api } = useApi()
const { formatDate } = useFormatters()

const observer = ref<{ id: number, name: string } | null>(null)
const stations = ref<{ id: number, name: string }[]>([])
const observations = ref<any[]>([])
const loadingStations = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const searched = ref(false)

const form = ref({
    station_id: null as number | null,
    start_date: '',
    end_date: '',
})

// Cargar estaciones asignadas al observer
onMounted(async () => {
    loadingStations.value = true
    try {
        const data: any = await api('/observer/stations')
        stations.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch {
        error.value = 'No se pudieron cargar las estaciones.'
    } finally {
        loadingStations.value = false
    }
})

//Generar reporte
async function fetchReport() {
    error.value = null
    observer.value = null
    observations.value = []
    loading.value = true
    searched.value = false

    try {
        const params = new URLSearchParams({
            station_id: String(form.value.station_id),
            start_date: form.value.start_date,
            end_date: form.value.end_date,
        })

        const data: any = await api(`/observer/reports?${params.toString()}`)

        observer.value = data.observer ?? null
        observations.value = data.data ?? []
    } catch (err: any) {
        const status = err?.response?.status
        if (status === 404) {
            error.value = null // Lo manejamos con el estado vacío
        } else {
            error.value = err?.data?.message ?? 'Error al generar el reporte.'
        }
    } finally {
        loading.value = false
        searched.value = true
    }
}

// Estadísiticas calculadas en el lado del cliente
const stats = computed(() => {
    if (!observations.value.length) return {}
    const temps = observations.value.map(o => parseFloat(o.temperature)).filter(n => !isNaN(n))
    const precips = observations.value.map(o => parseFloat(o.precipitation)).filter(n => !isNaN(n))
    return {
        avgTemp: temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '-',
        maxTemp: temps.length ? Math.max(...temps).toFixed(1) : '-',
        minTemp: temps.length ? Math.min(...temps).toFixed(1) : '-',
        totalPrecip: precips.length ? precips.reduce((a, b) => a + b, 0).toFixed(1) : '0.0',
    }
})

// Color temperatura
function tempColor(temp: number | null | undefined) {
    if (temp === null || temp === undefined) return 'text-gray-400'
    if (temp >= 35) return 'text-red-600'
    if (temp >= 25) return 'text-orange-500'
    if (temp >= 15) return 'text-green-500'
    if (temp >= 5) return 'text-blue-500'
    return 'text-indigo-600'
}

// Descargar CSV
function downloadCSV() {
    const meta = [`Observador:,${observer.value?.name ?? ''}`]
    const headers = ['ID', 'Fecha/Hora', 'Temperatura (°C)', 'Precipitación (mm)', 'Humedad (%)', 'Presión (hPa)', 'Viento (km/h)', 'Dirección viento']
    const rows = observations.value.map(o => [
        o.id,
        o.observed_at,
        o.temperature ?? '',
        o.precipitation ?? '',
        o.humidity ?? '',
        o.pressure ?? '',
        o.wind_speed ?? '',
        o.wind_direction ?? '',
    ])

    const stationName = stations.value.find(s => s.id == form.value.station_id)?.name ?? form.value.station_id
    const csvContent = [...meta, '', headers, ...rows].map(r => Array.isArray(r) ? r.join(',') : r).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte_${stationName}_${form.value.start_date}_${form.value.end_date}.csv`
    link.click()
    URL.revokeObjectURL(url)
}
</script>