<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Observaciones</h1>
            <p class="text-gray-500 mt-1">Listado completo de observaciones registradas en el sistema.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 text-sm">Cargando observaciones...</div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <!-- Tabla -->
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Fecha</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estación</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Observador</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Temp. (°C)</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Precip. (mm)</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Humedad (%)
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Presión (hPa)
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Viento (km/h)
                            </th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="obs in observations" :key="obs.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                                {{ formatDate(obs.observed_at) }}
                            </td>
                            <td class="px-4 py-3 text-gray-700">
                                {{ obs.station?.name ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-gray-500">
                                {{ obs.user?.name ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-right">
                                <span :class="tempColor(obs.temperature)" class="font-medium">
                                    {{ obs.temperature ?? '-' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-right text-gray-600">
                                {{ obs.precipitation ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-gray-600">
                                {{ obs.humidity ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-gray-600">
                                {{ obs.pressure ?? '-' }}
                            </td>
                            <td class="px-4 py-3 text-gray-600">
                                {{ obs.wind_speed ?? '-' }}
                                <span v-if="obs.wind_direction" class="text-gray-400 text-xs ml-1">
                                    {{ obs.wind_direction }}°
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button @click="openDetail(obs)"
                                        class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Ver
                                    </button>
                                    <button @click="openEdit(obs)"
                                        class="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Editar
                                    </button>
                                    <button @click="confirmDelete(obs)"
                                        class="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="observations.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay observaciones registradas.
                </p>
            </div>

            <!-- Paginación -->
            <div v-if="pagination"
                class="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Página {{ pagination.current_page }} de {{ pagination.last_page }} - {{ pagination.total }}
                    observaciones</span>
                <div class="flex gap-2">
                    <button :disabled="pagination.current_page === 1"
                        @click="fetchObservations(pagination.current_page - 1)"
                        class="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        Anterior
                    </button>
                    <button :disabled="pagination.current_page === pagination.last_page"
                        @click="fetchObservations(pagination.current_page + 1)"
                        class="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        Siguiente
                    </button>
                </div>
            </div>
        </div>

        <!-- Error global -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {{ error }}
        </div>

        <!-- Modal detalle observación -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 class="text-base font-semibold text-gray-900">{{ detailObs?.station?.name }}</h2>
                        <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(detailObs?.observed_at) }} · {{
                            detailObs?.user?.name }}</p>
                    </div>
                    <button @click="closeModals" class="text-gray-400 hover:text-gray-600">
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
                        <p :class="tempColor(detailObs?.temperature)" class="text-xl font-bold">
                            {{ detailObs?.temperature ?? '—' }}<span class="text-sm font-normal">°C</span>
                        </p>
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
                        <p v-if="detailObs?.wind_direction" class="text-xs text-gray-400">{{ detailObs.wind_direction
                        }}°</p>
                    </div>
                    <div class="text-center bg-gray-50 rounded-lg p-3">
                        <p class="text-xs text-gray-400 mb-1">Precipitación</p>
                        <p class="text-xl font-bold text-gray-800">{{ detailObs?.precipitation ?? '—' }}<span
                                class="text-sm font-normal"> mm</span></p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="openEdit(detailObs); showDetailModal = false"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Editar
                    </button>
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <!-- ==== Modal editar ====== -->
        <div v-if="showEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Editar observación</h2>
                    <p class="text-xs text-gray-400 mt-0.5">
                        {{ editingObs?.station?.name }} - {{ formatDate(editingObs?.observed_at) }}
                    </p>
                </div>
                <div class="px-6 py-4 grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
                        <input v-model="form.temperature" type="number" step="0.1"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Precipitación (mm)</label>
                        <input v-model="form.precipitation" type="number" step="0.1" min="0"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Humedad (%)</label>
                        <input v-model="form.humidity" type="number" step="0.1"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Presión atmosférica (hPa)</label>
                        <input v-model="form.pressure" type="number" step="0.1"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Velocidad del viento (km/h)</label>
                        <input v-model="form.wind_speed" type="number" step="0.1" min="0"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección del viento (°)</label>
                        <input v-model="form.wind_direction" type="number" min="0" max="360"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <p v-if="formError" class="px-6 text-sm text-red-600">{{ formError }}</p>
                <div class="px-6 py-4 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitEdit" :disabled="saving"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ==== Modal confirmar eliminación ====== -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Eliminar observación</h2>
                </div>
                <div class="px-6 py-4">
                    <p class="text-sm text-gray-600">
                        ¿Seguro que quieres eliminar la observación de
                        <span class="font-semibold">{{ deletingObs?.station?.name }}</span>
                        del {{ formatDate(deletingObs?.observed_at) }}?
                        Esta acción no se puede deshacer.
                    </p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitDelete" :disabled="saving"
                        class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Eliminando...' : 'Eliminar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth'] })

const { api } = useApi()
const { formatDate } = useFormatters()

const observations = ref<any[]>([])
const pagination = ref<any>(null)
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formError = ref<string | null>(null)

const showDetailModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const detailObs = ref<any>(null)
const editingObs = ref<any>(null)
const deletingObs = ref<any>(null)

const form = ref({
    temperature: null as number | null,
    precipitation: null as number | null,
    humidity: null as number | null,
    pressure: null as number | null,
    wind_speed: null as number | null,
    wind_direction: null as number | null
})

async function fetchObservations(page = 1) {
    loading.value = true
    try {
        const data: any = await api('/admin/observations', { params: { page } })
        observations.value = data.data ?? []
        pagination.value = {
            current_page: data.current_page,
            last_page: data.last_page,
            total: data.total
        }
    } catch {
        error.value = 'No se pudieron cargar las observaciones.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchObservations)

function openDetail(obs: any) {
    detailObs.value = obs
    showDetailModal.value = true
}

function openEdit(obs: any) {
    editingObs.value = obs
    form.value = {
        temperature: obs.temperature,
        precipitation: obs.precipitation,
        humidity: obs.humidity,
        pressure: obs.pressure,
        wind_speed: obs.wind_speed,
        wind_direction: obs.wind_direction
    }
    formError.value = null
    showEditModal.value = true
}

function confirmDelete(obs: any) {
    deletingObs.value = obs
    showDeleteModal.value = true
}

function closeModals() {
    showDetailModal.value = false
    showEditModal.value = false
    showDeleteModal.value = false
    detailObs.value = null
    editingObs.value = null
    deletingObs.value = null
    formError.value = null
}

async function submitEdit() {
    formError.value = null
    saving.value = true
    try {
        await api(`/admin/observations/${editingObs.value.id}`, {
            method: 'PATCH',
            body: form.value
        })
        closeModals()
        await fetchObservations(pagination.value?.current_page ?? 1)
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al guardar la observación.'
    } finally {
        saving.value = false
    }
}

async function submitDelete() {
    saving.value = true
    try {
        await api(`/admin/observations/${deletingObs.value.id}`, {
            method: 'DELETE'
        })
        closeModals()
        await fetchObservations(pagination.value?.current_page ?? 1)
    } catch (err: any) {
        formError.value = 'Error al eliminar la observación.'
    } finally {
        saving.value = false
    }
}

function tempColor(temp: number | null | undefined) {
    if (temp === null || temp === undefined) return 'text-gray-400'
    if (temp >= 35) return 'text-red-600'
    if (temp >= 25) return 'text-orange-500'
    if (temp >= 15) return 'text-green-500'
    if (temp >= 5) return 'text-blue-500'
    return 'text-indigo-600'
}
</script>