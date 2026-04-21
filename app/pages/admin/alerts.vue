<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-gray-900">Alertas</h1>
                    <NuxtLink to="/help/admin/alerts" target="_blank"
                        class="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-600 flex items-center justify-center transition-colors flex-shrink-0"
                        title="Ayuda con esta sección">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </NuxtLink>
                </div>
                <p class="text-gray-500 mt-1">Gestión de alertas.</p>
            </div>
            <button @click="openCreate"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva alerta
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 text-sm">Cargando alertas...</div>

        <!-- Table -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estación</td>
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Título</td>
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Nivel</td>
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estado</td>
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Fecha</td>
                            <td class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</td>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="alert in alerts" :key="alert.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 text-gray-600">{{ alert.station?.name ?? '-' }}</td>
                            <td class="px-4 py-3 font-medium text-gray-900">{{ alert.title }}</td>
                            <td class="px-4 py-3">
                                <span :class="levelClass(alert.level)"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ alert.level }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <span :class="alert.is_active ? 'text-green-600' : 'text-gray-400'"
                                    class="text-xs font-medium">
                                    {{ alert.is_active ? 'Activa' : 'Inactiva' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{
                                formatDate(alert.created_at) }}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button @click="openDetail(alert)"
                                        class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Ver
                                    </button>
                                    <button @click="openEdit(alert)"
                                        class="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Editar
                                    </button>
                                    <button @click="confirmDelete(alert)"
                                        class="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="alerts.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay alertas registradas.
                </p>
            </div>
        </div>

        <!-- Global error -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {{ error }}
        </div>

        <!-- Alert detail modal -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="text-base font-semibold text-gray-900">{{ detailAlert?.title }}</h2>
                    <button @click="closeModals" class="text-gray-400 hover:text-gray-600">
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
                            <span :class="levelClass(detailAlert?.level)"
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
                            <p class="text-sm text-gray-800 mt-0.5">{{ formatDate(detailAlert?.created_at) }}</p>
                        </div>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Mensaje</p>
                        <p class="text-sm text-gray-800 mt-0.5">{{ detailAlert?.message }}</p>
                    </div>
                    <div v-if="detailAlert?.observation">
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Observación que la originó</p>
                        <div class="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-600 flex flex-wrap gap-4">
                            <span>📅 {{ formatDate(detailAlert.observation.observed_at) }}</span>
                            <span v-if="detailAlert.observation.temperature != null">🌡 {{
                                detailAlert.observation.temperature }}°C</span>
                            <span v-if="detailAlert.observation.humidity != null">💧 {{ detailAlert.observation.humidity
                            }}%</span>
                            <span v-if="detailAlert.observation.pressure != null">🔵 {{ detailAlert.observation.pressure
                            }} hPa</span>
                            <span v-if="detailAlert.observation.wind_speed != null">💨 {{
                                detailAlert.observation.wind_speed }} km/h</span>
                            <span v-if="detailAlert.observation.precipitation != null">🌧 {{
                                detailAlert.observation.precipitation }} mm</span>
                        </div>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <!-- ==== Create/Edit Modal ====== -->
        <div v-if="showFormModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">
                        {{ editingAlert ? 'Editar alerta' : 'Nueva alerta' }}
                    </h2>
                </div>
                <div class="px-6 py-4 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Estación</label>
                        <select v-model="form.station_id"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Selecciona una estación</option>
                            <option v-for="station in stations" :key="station.id" :value="station.id">
                                {{ station.name }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input v-model="form.title" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                        <textarea v-model="form.message" rows="3"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                        <select v-model="form.level"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="red">Red</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2">
                        <input v-model="form.is_active" type="checkbox" id="is_active"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                        <label for="is_active" class="text-sm font-medium text-gray-700">Activa</label>
                    </div>
                    <p v-if="formError" class="text-sm text-red-600 mt-2">{{ formError }}></p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitForm" :disabled="saving"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ==== Confirm delete modal ====== -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Eliminar alerta</h2>
                </div>
                <div class="px-6 py-4">
                    <p class="text-sm text-gray-600">
                        ¿Seguro que quieres eliminar <span class="font-semibold">{{ deletingAlert?.title }}</span>?
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

const alerts = ref<any[]>([])
const stations = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formError = ref<string | null>(null)

const showDetailModal = ref(false)
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const detailAlert = ref<any>(null)
const editingAlert = ref<any>(null)
const deletingAlert = ref<any>(null)

const form = ref({
    station_id: null as number | null,
    title: '',
    message: '',
    level: 'green',
    is_active: true,
})

const levelClass = (level: string) => {
    const map: Record<string, string> = {
        green: 'bg-green-100 text-green-700',
        yellow: 'bg-yellow-100 text-yellow-700',
        orange: 'bg-orange-100 text-orange-700',
        red: 'bg-red-100 text-red-700',
    }
    return map[level] ?? 'bg-gray-100 text-gray-700'
}

async function fetchAlerts() {
    loading.value = true
    try {
        const data: any = await api('/admin/alerts')
        alerts.value = data.alerts ?? []
        stations.value = data.stations ?? []
    } catch {
        error.value = 'No se pudieron cargar las alertas.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchAlerts)

function openDetail(alert: any) {
    detailAlert.value = alert
    showDetailModal.value = true
}

function openCreate() {
    editingAlert.value = null
    form.value = { station_id: null, title: '', message: '', level: 'green', is_active: true }
    formError.value = null
    showFormModal.value = true
}

function openEdit(alert: any) {
    editingAlert.value = alert
    form.value = {
        station_id: alert.station_id,
        title: alert.title,
        message: alert.message,
        level: alert.level,
        is_active: alert.is_active
    }
    formError.value = null
    showFormModal.value = true
}

function confirmDelete(alert: any) {
    deletingAlert.value = alert
    showDeleteModal.value = true
}

function closeModals() {
    showFormModal.value = false
    showDeleteModal.value = false
    showDetailModal.value = false
    editingAlert.value = null
    deletingAlert.value = null
    formError.value = null
    detailAlert.value = null
}

async function submitForm() {
    formError.value = null
    saving.value = true
    try {
        if (editingAlert.value) {
            await api(`/admin/alerts/${editingAlert.value.id}`, {
                method: 'PATCH',
                body: form.value
            })
        } else {
            await api('/admin/alerts', {
                method: 'POST',
                body: form.value
            })
        }
        closeModals()
        await fetchAlerts()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al guardar la alerta.'
    } finally {
        saving.value = false
    }
}

async function submitDelete() {
    saving.value = true
    try {
        await api(`/admin/alerts/${deletingAlert.value.id}`, {
            method: 'DELETE',
        })
        closeModals()
        await fetchAlerts()
    } catch {
        error.value = 'Error al eliminar la alerta.'
    } finally {
        saving.value = false
    }
}
</script>