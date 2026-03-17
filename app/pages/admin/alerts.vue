<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Alertas</h1>
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

        <!-- Tabla -->
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
                                <span :class="alert.isActive ? 'text-green-600' : 'text-gray-400'"
                                    class="text-xs font-medium">
                                    {{ alert.isActive ? 'Activa' : 'Inactiva' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{
                                formatDate(alert.created_at) }}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
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

        <!-- Error global-->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {{ error }}
        </div>

        <!-- ==== Modal crear/editar ====== -->
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
                        <input v-model="form.isActive" type="checkbox" id="is_active"
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

        <!-- ==== Modal confirmar eliminación ====== -->
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

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const editingAlert = ref<any>(null)
const deletingAlert = ref<any>(null)

const form = ref({
    station_id: null as number | null,
    title: '',
    message: '',
    level: 'green',
    isActive: true,
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

function openCreate() {
    editingAlert.value = null
    form.value = { station_id: null, title: '', message: '', level: 'green', isActive: true }
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
        isActive: alert.is_active
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
    editingAlert.value = null
    deletingAlert.value = null
    formError.value = null
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