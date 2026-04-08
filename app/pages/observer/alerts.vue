<template>
    <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Alertas</h1>

        <div class="bg-white rounded-lg shadow-sm p-4">
            <div v-if="loading" class="text-gray-500 text-sm">Cargando alertas...</div>
            <div v-else>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left text-gray-500 border-b">
                            <th class="pb-2">Estación</th>
                            <th class="pb-2">Tipo</th>
                            <th class="pb-2">Mensaje</th>
                            <th class="pb-2">Fecha</th>
                            <th class="pb-2">Estado</th>
                            <th class="pb-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="alert in alerts" :key="alert.id" class="border-b last:border-0 hover:bg-gray-50">
                            <td class="py-2">{{ alert.station?.name ?? '-' }}</td>
                            <td class="py-2">
                                <span :class="typeClass(alert.level)"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ alert.title }}
                                </span>
                            </td>
                            <td class="py-2 max-w-xs truncate">{{ alert.message }}</td>
                            <td class="py-2">{{ new Date(alert.created_at).toLocaleString('es-ES') }}</td>
                            <td class="py-2">
                                <span :class="alert.resolved ? 'text-green-600' : 'text-red-500'"
                                    class="text-xs font-medium">
                                    {{ alert.resolved ? 'Resuelta' : 'Activa' }}
                                </span>
                            </td>
                            <td class="py-2">
                                <button @click="openDetail(alert)"
                                    class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    Ver
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p v-if="alerts.length === 0" class="text-gray-400 text-sm mt-2">
                    No hay alertas registradas.
                </p>

                <div v-if="pagination" class="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>Pagina {{ pagination.current_page }} de {{ pagination.last_page }}</span>
                    <div class="flex gap-2">
                        <button :disabled="pagination.current_page === 1"
                            @click="fetchAlerts(pagination.current_page - 1)"
                            class="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">
                            Anterior
                        </button>
                        <button :disabled="pagination.current_page === pagination.last_page"
                            @click="fetchAlerts(pagination.current_page + 1)"
                            class="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 class="text-base font-semibold text-gray-900">{{ detailAlert?.title }}</h2>
                <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="px-6 py-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Estación</p>
                        <p class="text-sm text-gray-800 mt-0.5">{{ detailAlert?.station?.name ?? '—' }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Nivel</p>
                        <span :class="typeClass(detailAlert?.level)"
                            class="px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 inline-block">
                            {{ detailAlert?.level }}
                        </span>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Estado</p>
                        <p :class="detailAlert?.is_active ? 'text-green-600' : 'text-gray-400'"
                            class="text-sm font-medium mt-0.5">
                            {{ detailAlert?.is_active ? 'Activa' : 'Inactiva' }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Fecha</p>
                        <p class="text-sm text-gray-800 mt-0.5">{{ new
                            Date(detailAlert?.created_at).toLocaleString('es-ES') }}</p>
                    </div>
                </div>
                <div>
                    <p class="text-xs text-gray-400 uppercase tracking-wide">Mensaje</p>
                    <p class="text-sm text-gray-800 mt-0.5">{{ detailAlert?.message }}</p>
                </div>
                <div v-if="detailAlert?.observation">
                    <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Observación que la originó</p>
                    <div class="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 flex flex-wrap gap-4">
                        <span>📅 {{ new Date(detailAlert.observation.observed_at).toLocaleString('es-ES') }}</span>
                        <span v-if="detailAlert.observation.temperature != null">🌡 {{
                            detailAlert.observation.temperature }}°C</span>
                        <span v-if="detailAlert.observation.humidity != null">💧 {{ detailAlert.observation.humidity
                        }}%</span>
                        <span v-if="detailAlert.observation.pressure != null">🔵 {{ detailAlert.observation.pressure }}
                            hPa</span>
                        <span v-if="detailAlert.observation.wind_speed != null">💨 {{ detailAlert.observation.wind_speed
                        }} km/h</span>
                        <span v-if="detailAlert.observation.precipitation != null">🌧 {{
                            detailAlert.observation.precipitation }} mm</span>
                    </div>
                </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
                <button @click="showDetailModal = false"
                    class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Cerrar
                </button>
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

const showDetailModal = ref(false)
const detailAlert = ref<any>(null)
const loading = ref(true)
const alerts = ref<any[]>([])
const pagination = ref<any>(null)

function openDetail(alert: any) {
    detailAlert.value = alert
    showDetailModal.value = true
}

const typeClass = (level: string) => {
    const map: Record<string, string> = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-700',
        red: 'bg-red-100 text-red-700',
    }
    return map[level] ?? 'bg-gray-100 text-gray-700'
}

const fetchAlerts = async (page = 1) => {
    auth.loadFromStorage()
    try {
        const data: any = await api('/alerts', {
            params: { page },
        })
        if (Array.isArray(data)) {
            alerts.value = data
            pagination.value = null
        } else {
            alerts.value = data.data
            pagination.value = {
                current_page: data.current_page,
                last_page: data.last_page,
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(fetchAlerts)
</script>