<template>
    <div class="p-6 max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
            <p class="text-gray-500 mt-1">Gestión de usuarios y sus roles.</p>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-gray-500 text-sm">Cargando usuarios...</div>

        <!-- Tabla -->
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
                                    {{ user.role?.name ?? '-' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-gray-500 text-xs">
                                {{user.stations?.length ? user.stations.map((s: any) => s.name).join(', ') : '-'}}
                            </td>
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
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

        <!-- Error global  -->
        <div v-if="error" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {{ error }}
        </div>

        <!-- ===== Modal cambiar rol ====== -->
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

        <!-- ===== Modal confirmar eliminación ====== -->
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
    </div>
</template>

<script setup lang="ts">
import { f } from 'vue-router/dist/router-CWoNjPRp.mjs'

definePageMeta({ layout: 'default', middleware: ['auth'] })

const auth = useAuthStore()
const config = useRuntimeConfig()

const users = ref<any[]>([])
const roles = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const formError = ref<string | null>(null)

const showRoleModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref<any>(null)
const deletingUser = ref<any>(null)
const selectedRoleId = ref<number | null>(null)

const headers = computed(() => ({
    'Authorization': `Bearer ${auth.token}`
}))

const roleClass = (role: string) => {
    const map: Record<string, string> = {
        'admin': 'bg-purple-100 text-purple-700',
        'observer': 'bg-blue-100 text-blue-700',
        'user': 'bg-gray-100 text-gray-600',
    }
    return map[role] ?? 'bg-gray-100 text-gray-600'
}

async function fetchUsers() {
    loading.value = true
    try {
        const data: any = await $fetch('/admin/users', {
            baseURL: config.public.apiBase as string,
            headers: headers.value,
        })
        users.value = Array.isArray(data) ? data : (data.data ?? [])
        roles.value = [
            { id: 1, name: 'admin' },
            { id: 2, name: 'observer' },
            { id: 3, name: 'user' },
        ]
    } catch {
        error.value = 'No se pudieron cargar los usuarios.'
    } finally {
        loading.value = false
    }
}

onMounted(fetchUsers)

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
    editingUser.value = null
    deletingUser.value = null
    formError.value = null
}

async function submitRoleChange() {
    formError.value = null
    saving.value = true
    try {
        await $fetch(`/admin/users/${editingUser.value.id}/role`, {
            method: 'PATCH',
            baseURL: config.public.apiBase as string,
            headers: headers.value,
            body: { role_id: selectedRoleId.value }
        })
        closeModals()
        await fetchUsers()
    } catch (err: any) {
        formError.value = err?.data?.message ?? 'Error al cambiar el rol.'
    } finally {
        saving.value = false
    }
}

async function submitDelete() {
    saving.value = true
    try {
        await $fetch(`/admin/users/${deletingUser.value.id}`, {
            method: 'DELETE',
            baseURL: config.public.apiBase as string,
            headers: headers.value,
        })
        closeModals()
        await fetchUsers()
    } catch {
        error.value = 'Error al eliminar el usuario.'
    } finally {
        saving.value = false
    }
}
</script>