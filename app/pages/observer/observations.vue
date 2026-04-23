<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-800">Observaciones</h1>
                <NuxtLink to="/help/observer/observations" target="_blank"
                    class="text-xs text-gray-400 hover:text-blue-500 transition flex items-center gap-1 border-l pl-3 border-gray-200 h-5 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ¿Ayuda con esta sección?
                </NuxtLink>
            </div>
            <p class="text-gray-500 mt-1">Registra nuevas observaciones y consulta las ya ingresadas.</p>
            <button @click="openCreate"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva observación
            </button>
        </div>

        <!-- Observations list -->
        <div class="bg-white rounded-lg shadow-sm p-4">
            <div v-if="loading" class="text-gray-500 text-sm">Cargando observaciones...</div>
            <div v-else>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="text-left text-gray-500 border-b">
                            <th class="pb-2">Estación</th>
                            <th class="pb-2">Fecha</th>
                            <th class="pb-2">Temp.</th>
                            <th class="pb-2">Precip.</th>
                            <th class="pb-2">Humedad</th>
                            <th class="pb-2">Presión</th>
                            <th class="pb-2">Viento</th>
                            <th class="pb-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="obs in observations" :key="obs.id" class="border-b last:border-0 hover:bg-gray-50">
                            <td class="py-2">{{ obs.station?.name }}</td>
                            <td class="py-2">{{ new Date(obs.observed_at).toLocaleString('es-ES') }}</td>
                            <td class="py-2">{{ obs.temperature }}°C</td>
                            <td class="py-2">{{ obs.precipitation }}mm</td>
                            <td class="py-2">{{ obs.humidity }}%</td>
                            <td class="py-2">{{ obs.pressure }}hPa</td>
                            <td class="py-2">{{ obs.wind_speed }}km/h</td>
                            <td class="py-2">
                                <button @click="openDetail(obs)"
                                    class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                    Ver
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p v-if="observations.length === 0" class="text-gray-400 text-sm mt-2">
                    No hay observaciones registradas.
                </p>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination" class="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
            <div class="flex gap-2">
                <button :disabled="pagination.current_page === 1"
                    @click="fetchObservations(pagination.current_page - 1)"
                    class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                    Anterior
                </button>
                <button :disabled="pagination.current_page === pagination.last_page"
                    @click="fetchObservations(pagination.current_page + 1)"
                    class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50">
                    Siguiente
                </button>
            </div>
        </div>
    </div>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">{{ detailObs?.station?.name }}</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ new Date(detailObs?.observed_at).toLocaleString('es-ES')
                        }}</p>
                </div>
                <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="px-6 py-4 grid grid-cols-3 gap-4">
                <div class="text-center bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-400 mb-1">Temperatura</p>
                    <p class="text-xl font-bold text-gray-800">{{ detailObs?.temperature ?? '—' }}<span
                            class="text-sm font-normal">°C</span></p>
                </div>
                <div class="text-center bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-400 mb-1">Humedad</p>
                    <p class="text-xl font-bold text-gray-800">{{ detailObs?.humidity ?? '—' }}<span
                            class="text-sm font-normal">%</span></p>
                </div>
                <div class="text-center bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-400 mb-1">Presión</p>
                    <p class="text-xl font-bold text-gray-800">{{ detailObs?.pressure ?? '—' }}<span
                            class="text-sm font-normal"> hPa</span></p>
                </div>
                <div class="text-center bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-400 mb-1">Viento</p>
                    <p class="text-xl font-bold text-gray-800">{{ detailObs?.wind_speed ?? '—' }}<span
                            class="text-sm font-normal"> km/h</span></p>
                    <p v-if="detailObs?.wind_direction" class="text-xs text-gray-400">{{ detailObs.wind_direction }}°
                    </p>
                </div>
                <div class="text-center bg-gray-50 rounded-lg p-3">
                    <p class="text-xs text-gray-400 mb-1">Precipitación</p>
                    <p class="text-xl font-bold text-gray-800">{{ detailObs?.precipitation ?? '—' }}<span
                            class="text-sm font-normal"> mm</span></p>
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

    <!-- ==== Create observation modal ====== -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div class="px-6 py-4 border-b border-gray-100">
                <h2 class="text-base font-semibold text-gray-900">Nueva observación</h2>
            </div>
            <div class="px-6 py-4 grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estación</label>
                    <select v-model="createForm.station_id"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecciona una estación</option>
                        <option v-for="s in stations" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                </div>
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y hora</label>
                    <input v-model="createForm.observed_at" type="datetime-local"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
                    <input v-model="createForm.temperature" type="number" step="0.1" placeholder="-50 a 60"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Humedad (%)</label>
                    <input v-model="createForm.humidity" type="number" step="0.1" placeholder="0 a 100"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Presión (hPa)</label>
                    <input v-model="createForm.pressure" type="number" step="0.1" placeholder="800 a 1200"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precipitación (mm)</label>
                    <input v-model="createForm.precipitation" type="number" step="0.1" min="0"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Viento (km/h)</label>
                    <input v-model="createForm.wind_speed" type="number" step="0.1" min="0"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dirección viento (°)</label>
                    <input v-model="createForm.wind_direction" type="number" min="0" max="360"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div v-if="formError" class="px-6 py-2 mb-2 bg-red-50 border-l-4 border-red-500">
                <p class="text-sm text-red-700">{{ formError }}</p>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                <button @click="closeModals"
                    class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button @click="submitCreate" :disabled="saving"
                    class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {{ saving ? 'Guardando...' : 'Guardar' }}
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
const showCreateModal = ref(false)
const detailObs = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const formError = ref<string | null>(null)
const observations = ref<any[]>([])
const stations = ref<any[]>([])
const pagination = ref<any>(null)

const createForm = reactive({
    station_id: '',
    observed_at: new Date().toISOString().slice(0, 16),
    temperature: null as number | null,
    humidity: null as number | null,
    pressure: null as number | null,
    precipitation: null as number | null,
    wind_speed: null as number | null,
    wind_direction: null as number | null,
})

const fetchObservations = async (page = 1) => {
    auth.loadFromStorage()
    try {
        const data: any = await api('/observer/observations', {
            params: { page }
        })
        observations.value = data.data ?? []
        pagination.value = {
            current_page: data.current_page,
            last_page: data.last_page,
        }
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

const fetchStations = async () => {
    auth.loadFromStorage()
    try {
        const data: any = await api('/stations')
        stations.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch (e) {
        console.error(e)
    }
}

const openDetail = (obs: any) => {
    detailObs.value = obs
    showDetailModal.value = true
}

function closeModals() {
    showDetailModal.value = false
    showCreateModal.value = false
}

function openCreate() {
    createForm.station_id = ''
    createForm.observed_at = new Date().toISOString().slice(0, 16)
    createForm.temperature = null
    createForm.humidity = null
    createForm.pressure = null
    createForm.precipitation = null
    createForm.wind_speed = null
    createForm.wind_direction = null
    formError.value = null
    showCreateModal.value = true
}

const submitCreate = async () => {
    formError.value = null
    saving.value = true
    try {
        await api('/observer/observations', { method: 'POST', body: createForm })
        closeModals()
        await fetchObservations()
    } catch (e: any) {
        console.error("Error completo:", e)

        if (e.response?._data?.errors) {
            const firstError = Object.values(e.response._data.errors)[0]
            formError.value = Array.isArray(firstError) ? firstError[0] : 'Datos inválidos.'
        } else {
            formError.value = e.response?._data?.message || 'Error al conectar con el servidor.'
        }
    } finally {
        saving.value = false
    }
}


onMounted(async () => {
    auth.loadFromStorage()
    await Promise.all([fetchObservations(), fetchStations()])
})
</script>