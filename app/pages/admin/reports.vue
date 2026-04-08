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
                </div>
                <button @click="downloadPDF"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar PDF
                </button>
                <button @click="closeReport"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cerrar
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
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Observador
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
                            <td class="px-4 py-3 text-gray-500 text-xs">
                                {{ obs.user?.name ?? '—' }}
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

        <!-- Historial de reportes -->
        <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">Historial de reportes</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Reportes generados anteriormente</p>
                </div>
            </div>
            <div v-if="loadingHistory" class="p-6 text-sm text-gray-400">Cargando historial...</div>
            <div v-else class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estación</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Período</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Generado</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Visibilidad</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="report in history" :key="report.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-medium text-gray-900">{{ report.station?.name ?? '—' }}</td>
                            <td class="px-4 py-3 text-gray-600 text-xs">{{ report.start_at }} → {{ report.end_at }}</td>
                            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{
                                formatDate(report.created_at) }}</td>
                            <td class="px-4 py-3">
                                <span
                                    :class="report.is_public ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ report.is_public ? 'Público' : 'Privado' }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <button @click="viewReport(report)"
                                    class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    Ver
                                </button>
                                <button @click="togglePublic(report)"
                                    class="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    {{ report.is_public ? 'Hacer privado' : 'Hacer público' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="history.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay reportes generados todavía.
                </p>
            </div>
        </div>

        <!-- Modal detalle reporte -->
        <div v-if="showReportModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <h2 class="text-base font-semibold text-gray-900">{{ selectedReport?.station?.name }}</h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ selectedReport?.start_at }} → {{ selectedReport?.end_at }}
                        </p>
                    </div>
                    <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="px-6 py-4">
                    <div v-if="loadingReportDetail" class="text-sm text-gray-400 py-4 text-center">
                        Cargando observaciones...
                    </div>
                    <div v-else-if="reportObservations.length > 0">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-gray-50 border-b border-gray-100">
                                    <th
                                        class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Fecha / Hora</th>
                                    <th
                                        class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Temp. (°C)</th>
                                    <th
                                        class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Humedad (%)</th>
                                    <th
                                        class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Presión (hPa)</th>
                                    <th
                                        class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Viento (km/h)</th>
                                    <th
                                        class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Precip. (mm)</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="obs in reportObservations" :key="obs.id" class="hover:bg-gray-50">
                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(obs.observed_at)
                                    }}</td>
                                    <td class="px-4 py-3 text-right"><span :class="tempColor(obs.temperature)"
                                            class="font-medium">{{ obs.temperature ?? '—' }}</span></td>
                                    <td class="px-4 py-3 text-right text-gray-600">{{ obs.humidity ?? '—' }}</td>
                                    <td class="px-4 py-3 text-right text-gray-600">{{ obs.pressure ?? '—' }}</td>
                                    <td class="px-4 py-3 text-right text-gray-600">{{ obs.wind_speed ?? '—' }}</td>
                                    <td class="px-4 py-3 text-right text-gray-600">{{ obs.precipitation ?? '—' }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p v-else class="text-gray-400 text-sm py-4 text-center">No hay observaciones para este reporte.</p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
                    <button @click="showReportModal = false"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const auth = useAuthStore()
const { api } = useApi()
const { formatDate } = useFormatters()

const stations = ref<{ id: number, name: string }[]>([])
const observations = ref<any[]>([])
const history = ref<any[]>([])
const loadingHistory = ref(false)
const loadingStations = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const searched = ref(false)
const showReportModal = ref(false)
const selectedReport = ref<any>(null)
const loadingReportDetail = ref(false)
const reportObservations = ref<any[]>([])

const form = ref({
    station_id: null as number | null,
    start_date: '',
    end_date: '',
})

// Cargar estaciones asignadas al observer
onMounted(async () => {
    auth.loadFromStorage()
    loadingStations.value = true
    try {
        const data: any = await api('/admin/stations')
        stations.value = Array.isArray(data) ? data : (data.stations ?? [])
    } catch {
        error.value = 'No se pudieron cargar las estaciones.'
    } finally {
        loadingStations.value = false
    }

    await fetchHistory()
})

//Generar reporte
async function fetchReport() {
    error.value = null
    observations.value = []
    loading.value = true
    searched.value = false

    try {
        const params = new URLSearchParams({
            station_id: String(form.value.station_id),
            start_date: form.value.start_date,
            end_date: form.value.end_date,
        })

        const data: any = await api(`/admin/reports?${params.toString()}`)

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

async function closeReport() {
    observations.value = []
    searched.value = false
    await fetchHistory()
}

async function fetchHistory() {
    loadingHistory.value = true
    try {
        const data: any = await api('/admin/reports/history')
        history.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch {
        // Silencioso
    } finally {
        loadingHistory.value = false
    }
}

async function togglePublic(report: any) {
    try {
        await api(`/admin/reports/${report.id}/toggle-public`, { method: 'PATCH' })
        await fetchHistory()
    } catch {
        // Silencioso
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

// Descargar PDF
function downloadPDF() {
    const stationName = stations.value.find(s => s.id == form.value.station_id)?.name ?? 'Estación'

    const rows = observations.value.map(o => `
        <tr>
            <td>${formatDate(o.observed_at)}</td>
            <td>${o.user?.name ?? '—'}</td>
            <td>${o.temperature ?? '—'}°C</td>
            <td>${o.humidity ?? '—'}%</td>
            <td>${o.pressure ?? '—'} hPa</td>
            <td>${o.wind_speed ?? '—'} km/h</td>
            <td>${o.precipitation ?? '—'} mm</td>
        </tr>
    `).join('')

    const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reporte - ${stationName}</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; padding: 20px; color: #333; }
                h1 { font-size: 18px; margin-bottom: 4px; }
                .meta { color: #666; font-size: 11px; margin-bottom: 16px; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th { background: #f3f4f6; text-align: left; padding: 8px; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #e5e7eb; }
                td { padding: 7px 8px; border-bottom: 1px solid #e5e7eb; }
                tr:nth-child(even) { background: #f9fafb; }
                .stats { margin-top: 20px; display: flex; gap: 24px; padding: 12px; background: #f3f4f6; border-radius: 6px; }
                .stat { text-align: center; }
                .stat-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
                .stat-value { font-size: 16px; font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Reporte meteorológico — ${stationName}</h1>
            <div class="meta">
                Período: ${form.value.start_date} → ${form.value.end_date} &nbsp;·&nbsp;
                ${observations.value.length} observaciones
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Fecha / Hora</th>
                        <th>Observador</th>
                        <th>Temperatura</th>
                        <th>Humedad</th>
                        <th>Presión</th>
                        <th>Viento</th>
                        <th>Precipitación</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <div class="stats">
                <div class="stat"><div class="stat-label">Temp. media</div><div class="stat-value">${stats.value.avgTemp}°C</div></div>
                <div class="stat"><div class="stat-label">Temp. máx.</div><div class="stat-value">${stats.value.maxTemp}°C</div></div>
                <div class="stat"><div class="stat-label">Temp. mín.</div><div class="stat-value">${stats.value.minTemp}°C</div></div>
                <div class="stat"><div class="stat-label">Precip. total</div><div class="stat-value">${stats.value.totalPrecip} mm</div></div>
            </div>
        </body>
        </html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const printWindow = window.open(url, '_blank')
    printWindow?.addEventListener('load', () => {
        printWindow.print()
        URL.revokeObjectURL(url)
    })
}

async function viewReport(report: any) {
    selectedReport.value = report
    showReportModal.value = true
    loadingReportDetail.value = true
    reportObservations.value = []
    try {
        const params = new URLSearchParams({
            station_id: String(report.station_id),
            start_date: report.start_at,
            end_date: report.end_at,
        })
        const data: any = await api(`/admin/reports?${params.toString()}`)
        reportObservations.value = data.data ?? []
    } catch {
        reportObservations.value = []
    } finally {
        loadingReportDetail.value = false
    }
}
</script>