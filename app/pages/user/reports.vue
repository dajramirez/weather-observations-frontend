<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Reportes públicos</h1>
            <NuxtLink to="/help/user/reports" target="_blank"
                class="text-xs text-gray-400 hover:text-blue-500 transition flex items-center gap-1 border-l pl-3 border-gray-200 h-5 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ¿Ayuda con esta sección?
            </NuxtLink>
            <p class="text-gray-500 mt-1">Reportes meteorológicos disponibles públicamente.</p>
        </div>

        <div v-if="loading" class="text-gray-500 text-sm">Cargando reportes...</div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estación</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Período</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Generado por</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Fecha</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="report in reports" :key="report.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-medium text-gray-900">{{ report.station?.name ?? '—' }}</td>
                            <td class="px-4 py-3 text-gray-600 text-xs">{{ report.start_at }} → {{ report.end_at }}</td>
                            <td class="px-4 py-3 text-gray-500 text-xs">{{ report.user?.name ?? '—' }}</td>
                            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{
                                formatDate(report.created_at) }}</td>
                            <td class="px-4 py-3">
                                <button @click="viewReport(report)"
                                    class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    Ver
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="reports.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay reportes públicos disponibles.
                </p>
            </div>
        </div>

        <!-- Modal detalle reporte -->
        <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <h2 class="text-base font-semibold text-gray-900">{{ selectedReport?.station?.name }}</h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ selectedReport?.start_at }} → {{ selectedReport?.end_at }}
                            · Generado por {{ selectedReport?.user?.name }}
                        </p>
                    </div>
                    <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="px-6 py-4">
                    <div v-if="loadingDetail" class="text-sm text-gray-400 py-4 text-center">
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
                                    <td class="px-4 py-3 text-right font-medium" :class="tempColor(obs.temperature)">{{
                                        obs.temperature ?? '—' }}</td>
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
                    <button @click="showModal = false"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth'] })

const auth = useAuthStore()
const { api } = useApi()
const { formatDate } = useFormatters()
const config = useRuntimeConfig()

const reports = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const selectedReport = ref<any>(null)
const reportObservations = ref<any[]>([])
const loadingDetail = ref(false)

function tempColor(temp: number | null | undefined) {
    if (temp === null || temp === undefined) return 'text-gray-400'
    if (temp >= 35) return 'text-red-600'
    if (temp >= 25) return 'text-orange-500'
    if (temp >= 15) return 'text-green-500'
    if (temp >= 5) return 'text-blue-500'
    return 'text-indigo-600'
}

async function viewReport(report: any) {
    selectedReport.value = report
    showModal.value = true
    loadingDetail.value = true
    reportObservations.value = []
    try {
        const params = new URLSearchParams({
            station_id: String(report.station_id),
            start_date: report.start_at,
            end_date: report.end_at,
        })
        const data: any = await $fetch(`/public/stations/${report.station_id}/observations`, {
            baseURL: config.public.apiBase as string,
        })
        reportObservations.value = data.data ?? []
    } catch {
        reportObservations.value = []
    } finally {
        loadingDetail.value = false
    }
}

onMounted(async () => {
    auth.loadFromStorage()
    try {
        const data: any = await api('/user/reports')
        reports.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
})
</script>