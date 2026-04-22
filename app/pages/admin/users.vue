<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <div>
                <div class="flex items-center gap-2">
                    <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
                    <NuxtLink to="/help/admin/users" target="_blank"
                        class="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-600 flex items-center justify-center transition-colors flex-shrink-0"
                        title="Ayuda con esta sección">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </NuxtLink>
                </div>
                <p class="text-gray-500 mt-1">Gestión de usuarios y sus roles.</p>
            </div>

            <button @click="openCreate"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo usuario
            </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 text-sm">Cargando usuarios...</div>

        <!-- Table -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Nombre</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Email</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Rol</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estaciones</th>
                            <th class="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 font-medium text-gray-900">{{ user.name }}</td>
                            <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
                            <td class="px-4 py-3">
                                <span :class="roleClass(user.role?.name)"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ roleLabel(user.role?.name) }}
                                </span>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="s in user.stations" :key="s.id"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                        {{ s.name }}
                                        <button @click="unassignStation(user, s.id)"
                                            class="hover:text-red-500 transition-colors">x</button>
                                    </span>
                                    <button v-if="user.role?.name !== 'user'" @click="openAssignStation(user)"
                                        class="px-2 py-0.5 border border-dashed border-gray-300 text-gray-400 text-xs rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors">
                                        + Asignar
                                    </button>
                                </div>
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <button @click="openDetail(user)"
                                        class="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                                        Ver
                                    </button>
                                    <button @click="openEditRole(user)"
                                        class="text-xs px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cambiar rol
                                    </button>
                                    <button @click="confirmDelete(user)" :disabled="user.id === auth.user?.id"
                                        class="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="users.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay usuarios registrados.
                </p>
            </div>
        </div>

        <!-- Global error  -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {{ error }}
        </div>

        <!-- User detail modal -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 class="text-base font-semibold text-gray-900">{{ detailUser?.name }}</h2>
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
                            <p class="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                            <p class="text-sm text-gray-800 mt-0.5">{{ detailUser?.email }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 uppercase tracking-wide">Rol</p>
                            <span :class="roleClass(detailUser?.role?.name)"
                                class="px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 inline-block">
                                {{ roleLabel(detailUser?.role?.name) }}
                            </span>
                        </div>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400 uppercase tracking-wide mb-2">Estaciones asignadas</p>
                        <div v-if="detailUser?.stations?.length" class="flex flex-wrap gap-2">
                            <span v-for="s in detailUser.stations" :key="s.id"
                                class="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {{ s.name }}
                            </span>
                        </div>
                        <p v-else class="text-sm text-gray-400">Sin estaciones asignadas.</p>
                        <button @click="openAssignStation(detailUser)"
                            class="text-xs px-3 py-1 border border-dashed border-gray-300 text-gray-400 rounded-lg hover:border-blue-400 hover:text-blue-500 transition-colors">
                            + Asignar estación
                        </button>
                    </div>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="openEditRole(detailUser); showDetailModal = false"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cambiar rol
                    </button>
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== Role change modal ====== -->
        <div v-if="showRoleModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Cambiar rol</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ editingUser?.name }}</p>
                </div>
                <div class="px-6 py-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select v-model="selectedRoleId"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option v-for="role in roles" :key="role.id" :value="role.id">
                            {{ role.name }}
                        </option>
                    </select>
                    <p v-if="formError" class="text-sm text-red-600 mt-2">{{ formError }}</p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitRoleChange" :disabled="saving"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== Confirm delete modal ====== -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Eliminar usuario</h2>
                </div>
                <div class="px-6 py-4">
                    <div class="text-sm text-gray-600">
                        ¿Seguro que quieres eliminar <span class="font-semibold">{{ deletingUser?.name }}</span>?
                        Esta acción no se puede deshacer.
                    </div>
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

        <!-- ===== Create user modal ====== -->
        <div v-if="showCreateModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Nuevo usuario</h2>
                </div>
                <div class="px-6 py-4 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input v-model="createForm.name" type="text"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input v-model="createForm.email" type="email"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input v-model="createForm.password" type="password"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <select v-model="createForm.role_id"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option v-for="role in roles" :key="role.id" :value="role.id">
                                {{ roleLabel(role.name) }}
                            </option>
                        </select>
                    </div>
                    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitCreate" :disabled="saving"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Creando...' : 'Crear usuario' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- ===== Assign station modal ====== -->
        <div v-if="showAssignStationModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-xl w-full max-w-sm">
                <div class="px-6 py-4 border-b border-gray-100">
                    <h2 class="text-base font-semibold text-gray-900">Asignar estación</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ assigningUser?.name }}</p>
                </div>
                <div class="px-6 py-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estación</label>
                    <select v-model="assignStationId"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Selecciona una estación</option>
                        <option v-for="s in availableStations" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                    <p v-if="formError" class="text-sm text-red-600 mt-2">{{ formError }}</p>
                </div>
                <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
                    <button @click="closeModals"
                        class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancelar
                    </button>
                    <button @click="submitAssignStation" :disabled="saving || !assignStationId"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
                        {{ saving ? 'Asignando...' : 'Asignar' }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default', middleware: ['auth'] })

const { api } = useApi()
const auth = useAuthStore()

const users = ref<any[]>([])
const roles = ref<any[]>([])
const allStations = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formError = ref<string | null>(null)

const showAssignStationModal = ref(false)
const showDetailModal = ref(false)
const showRoleModal = ref(false)
const showDeleteModal = ref(false)
const assigningUser = ref<any>(null)
const assignStationId = ref<number | null>(null)
const detailUser = ref<any>(null)
const editingUser = ref<any>(null)
const deletingUser = ref<any>(null)
const selectedRoleId = ref<number | null>(null)

const roleClass = (role: string) => {
    const map: Record<string, string> = {
        'admin': 'bg-purple-100 text-purple-700',
        'observer': 'bg-blue-100 text-blue-700',
        'user': 'bg-gray-100 text-gray-600',
    }
    return map[role] ?? 'bg-gray-100 text-gray-600'
}

function roleLabel(roleName: string): string {
    const map: Record<string, string> = {
        'admin': 'Administrador',
        'observer': 'Observador',
        'user': 'Usuario',
    }
    return map[roleName] ?? roleName
}

const availableStations = computed(() => {
    if (!assigningUser.value) return allStations.value
    const assignedIds = assigningUser.value.stations?.map((s: any) => s.id) ?? []
    return allStations.value.filter((s: any) => !assignedIds.includes(s.id))
})

async function fetchUsers() {
    loading.value = true
    try {
        const data: any = await api('/admin/users')
        users.value = Array.isArray(data) ? data : (data.data ?? [])
        roles.value = [
            { id: 1, name: 'Administrador' },
            { id: 2, name: 'Observador' },
            { id: 3, name: 'Usuario' },
        ]
    } catch {
        error.value = 'No se pudieron cargar los usuarios.'
    } finally {
        loading.value = false
    }
}

onMounted(async () => {
    auth.loadFromStorage()
    await fetchUsers()
    try {
        const data: any = await api('/admin/stations')
        allStations.value = data.stations ?? []
    } catch {
        // silent
    }
})

function openAssignStation(user: any) {
    assigningUser.value = user
    assignStationId.value = null
    formError.value = null
    showDetailModal.value = false
    showAssignStationModal.value = true
}

function openDetail(user: any) {
    detailUser.value = user
    showDetailModal.value = true
}

function openEditRole(user: any) {
    editingUser.value = user
    selectedRoleId.value = user.role?.id ?? null
    formError.value = null
    showRoleModal.value = true
}

function confirmDelete(user: any) {
    deletingUser.value = user
    showDeleteModal.value = true
}

function closeModals() {
    showRoleModal.value = false
    showDeleteModal.value = false
    showDetailModal.value = false
    showCreateModal.value = false
    showAssignStationModal.value = false
    assigningUser.value = null
    editingUser.value = null
    deletingUser.value = null
    formError.value = null
    detailUser.value = null
}

async function submitRoleChange() {
    formError.value = null
    saving.value = true
    try {
        await api(`/admin/users/${editingUser.value.id}/role`, {
            method: 'POST',
            body: { role_id: selectedRoleId.value },
        })
        closeModals()
        await fetchUsers()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al cambiar el rol.'
    } finally {
        saving.value = false
    }
}

async function submitAssignStation() {
    formError.value = null
    saving.value = true
    try {
        await api(`/admin/stations/${assignStationId.value}/assign`, {
            method: 'POST',
            body: { user_id: assigningUser.value.id }
        })
        closeModals()
        await fetchUsers()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al asignar la estación.'
    } finally {
        saving.value = false
    }
}

async function unassignStation(user: any, stationId: number) {
    try {
        await api(`/admin/stations/${stationId}/unassign`, {
            method: 'DELETE',
            body: { user_id: user.id }
        })
        await fetchUsers()
        // Actualizar el detailUser para reflejar el cambio en el modal
        detailUser.value = users.value.find((u: any) => u.id === user.id) ?? null
    } catch {
        error.value = 'Error al desasignar la estación.'
    }
}

async function submitDelete() {
    saving.value = true
    try {
        await api(`/admin/users/${deletingUser.value.id}`, {
            method: 'DELETE'
        })
        closeModals()
        await fetchUsers()
    } catch {
        error.value = 'Error al eliminar el usuario.'
    } finally {
        saving.value = false
    }
}

const showCreateModal = ref(false)
const createForm = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role_id: 3,
})

function openCreate() {
    createForm.name = ''
    createForm.email = ''
    createForm.password = ''
    createForm.password_confirmation = ''
    createForm.role_id = 3
    formError.value = null
    showCreateModal.value = true
}

async function submitCreate() {
    formError.value = null
    saving.value = true
    // password_confirmation igual que password
    createForm.password_confirmation = createForm.password
    try {
        await api('/register', {
            method: 'POST',
            body: createForm,
        })
        closeModals()
        await fetchUsers()
    } catch (err: any) {
        const errors = err?.data?.errors
        if (errors) {
            const first = Object.values(errors)[0] as string[]
            formError.value = first?.[0] ?? 'Error al crear el usuario.'
        } else {
            formError.value = err?.data?.message ?? 'Error al crear el usuario.'
        }
    } finally {
        saving.value = false
    }
}
</script>