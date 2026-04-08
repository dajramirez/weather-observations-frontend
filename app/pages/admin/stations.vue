<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Estaciones</h1>
                <p class="text-gray-500 mt-1">Gestión de estaciones meteorológicas y sus observadores.</p>
            </div>
            <button @click="openCreate"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva estación
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 text-sm">Cargando estaciones...</div>

        <!-- Tabla -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Nombre</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Ubicación</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Altitud</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Observadores</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="station in stations" :key="station.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-medium text-gray-900">{{ station.name }}</td>
                            <td class="px-4 py-3 text-gray-600">{{ station.location }}</td>
                            <td class="px-4 py-3 text-gray-600">{{ station.altitude }}</td>
                            <td class="px-4 py-3">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="user in station.users" :key="user.id"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                        {{ user.name }}
                                        <button @click="unassignObserver(station, user.id)"
                                            class="hover:text-red-500 transition-colors">x</button>
                                    </span>
                                    <button @click="openAssign(station)"
                                        class="px-2 py-0.5 border border-dashed border-gray-300 text-gray-400 text-xs rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors">
                                        + Asignar
                                    </button>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button @click="openDetail(station)"
                                        class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Ver
                                    </button>
                                    <button @click="openEdit(station)"
                                        class="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Editar
                                    </button>
                                    <button @click="confirmDelete(station)"
                                        class="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="stations.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay estaciones registradas.
                </p>
            </div>
        </div>

        <!-- ====== Modal detalle ====== -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-lg">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="text-base font-semibold text-gray-900">{{ detailStation?.name }}</h2>
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
                            <p class="text-xs text-gray-400 uppercase tracking-wide">Ubicación</p>
                            <p class="text-sm text-gray-800 mt-0.5">{{ detailStation?.location ?? '—' }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 uppercase tracking-wide">Altitud</p>
                            <p class="text-sm text-gray-800 mt-0.5">{{ detailStation?.altitude }} m</p>
                        </div>
                    </div>
                    <div v-if="detailStation?.description">
                        <p class="text-xs text-gray-400 uppercase tracking-wide">Descripción</p>
                        <p class="text-sm text-gray-800 mt-0.5">{{ detailStation.description }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Observadores asignados</p>
                        <div v-if="detailStation?.users?.length" class="flex flex-wrap gap-2">
                            <span v-for="user in detailStation.users" :key="user.id"
                                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {{ user.name }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-gray-400">Sin observadores asignados.</p>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="openEdit(detailStation); showDetailModal = false"
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

        <!-- ====== Modal crear/editar ====== -->
        <div v-if="showFormModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">
                        {{ editingStation ? 'Editar estación' : 'Nueva estación' }}
                    </h2>
                </div>
                <div class="px-6 py-4 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input v-model="form.name" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                        <input v-model="form.location" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Altitud (m)</label>
                        <input v-model="form.altitude" type="number" min="0"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea v-model="form.description" rows="3"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
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

        <!--- ==== Modal asignar observador ==== -->
        <div v-if="showAssignModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Asignar observador</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ assigningStation?.name }}</p>
                </div>
                <div class="px-6 py-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Observador</label>
                    <select v-model="assignUserId"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecciona un observador</option>
                        <option v-for="obs in availableObservers" :key="obs.id" :value="obs.id">
                            {{ obs.name }} - {{ obs.email }}
                        </option>
                    </select>
                    <p v-if="formError" class="text-sm text-red-600 mt-2">{{ formError }}></p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitAssign" :disabled="saving || !assignUserId"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Asignando...' : 'Asignar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ====== Modal confirmar eliminación ====== -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Eliminar estación</h2>
                </div>
                <div class="px-6 py-4">
                    <p class="text-sm text-gray-600">
                        ¿Seguro que quieres eliminar <span class="font-semibold">{{ deletingStation?.name }}</span>?
                        Esta acción no se puede deshacer y eliminará todas sus observaciones y alertas asociadas.
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
definePageMeta({
    layout: 'default',
    middleware: ['auth']
})

const { api } = useApi()

const stations = ref<any>([])
const observers = ref<any>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formError = ref<string | null>(null)

// Modales
const showDetailModal = ref(false)
const showFormModal = ref(false)
const showAssignModal = ref(false)
const showDeleteModal = ref(false)
const detailStation = ref<any>(null)
const editingStation = ref<any>(null)
const deletingStation = ref<any>(null)
const assigningStation = ref<any>(null)
const assignUserId = ref<number | null>(null)

const form = ref({ name: '', location: '', altitude: 0, description: '' })

const availableObservers = computed(() => {
    if (!assigningStation.value) return observers.value
    const assignedIds = assigningStation.value.users?.map((u: any) => u.id) ?? []
    return observers.value.filter((o: any) => !assignedIds.includes(o.id))
})

async function fetchStations() {
    loading.value = true
    try {
        const data: any = await api('/admin/stations')
        stations.value = data.stations ?? []
        observers.value = data.observers ?? []
    } catch {
        error.value = 'No se pudieron cargar las estaciones.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchStations)

// Abrir modal detalle
function openDetail(station: any) {
    detailStation.value = station
    showDetailModal.value = true
}

// Abrir modal crear
function openCreate() {
    editingStation.value = null
    form.value = { name: '', location: '', altitude: 0, description: '' }
    formError.value = null
    showFormModal.value = true
}

// Abrir modal editar
function openEdit(station: any) {
    editingStation.value = station
    form.value = {
        name: station.name,
        location: station.location,
        altitude: station.altitude,
        description: station.description ?? ''
    }
    formError.value = null
    showFormModal.value = true
}

// Abrir modal asignar
function openAssign(station: any) {
    assigningStation.value = station
    assignUserId.value = null
    formError.value = null
    showAssignModal.value = true
}

// Abrir modal eliminar
function confirmDelete(station: any) {
    deletingStation.value = station
    showDeleteModal.value = true
}

function closeModals() {
    showDetailModal.value = false
    showFormModal.value = false
    showAssignModal.value = false
    showDeleteModal.value = false
    detailStation.value = null
    editingStation.value = null
    deletingStation.value = null
    assigningStation.value = null
    formError.value = null
}

// Crear o editar estación
async function submitForm() {
    formError.value = null
    saving.value = true
    try {
        if (editingStation.value) {
            await api(`/admin/stations/${editingStation.value.id}`, {
                method: 'PATCH',
                body: form.value
            })
        } else {
            await api('/admin/stations', {
                method: 'POST',
                body: form.value
            })
        }
        closeModals()
        await fetchStations()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al guardar la estación.'
    } finally {
        saving.value = false
    }
}

// Asignar observador
async function submitAssign() {
    formError.value = null
    saving.value = true
    try {
        await api(`/admin/stations/${assigningStation.value.id}/assign`, {
            method: 'POST',
            body: { user_id: assignUserId.value }
        })
        closeModals()
        await fetchStations()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al asignar el observador.'
    } finally {
        saving.value = false
    }
}

// Desasignar observador
async function unassignObserver(station: any, userId: number) {
    try {
        await api(`/admin/stations/${station.id}/unassign`, {
            method: 'POST',
            body: { user_id: userId }
        })
        await fetchStations()
    } catch {
        formError.value = 'Error al desasignar el observador.'
    }
}

// Eliminar estación
async function submitDelete() {
    saving.value = true
    try {
        await api(`/admin/stations/${deletingStation.value.id}`, {
            method: 'DELETE'
        })
        closeModals()
        await fetchStations()
    } catch (err: any) {
        formError.value = 'Error al eliminar la estación.'
    } finally {
        saving.value = false
    }
}
</script>