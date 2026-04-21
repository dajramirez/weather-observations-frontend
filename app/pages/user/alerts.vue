<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div class="mb-6">
            <div class="flex items-center gap-2">
                <h1 class="text-2xl font-bold text-gray-900">Alertas</h1>
                <NuxtLink to="/help/user/alerts" target="_blank"
                    class="w-6 h-6 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-400 hover:text-blue-600 flex items-center justify-center transition-colors flex-shrink-0"
                    title="Ayuda con esta sección">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </NuxtLink>
            </div>
            <p class="text-gray-500 mt-1">Alertas meteorológicas vigentes en el sistema.</p>
        </div>

        <div v-if="loading" class="text-gray-500 text-sm">Cargando alertas...</div>

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estación</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Tipo</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Mensaje</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Fecha</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="alert in alerts" :key="alert.id" class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3 text-gray-700">{{ alert.station?.name ?? '—' }}</td>
                            <td class="px-4 py-3">
                                <span :class="levelClass(alert.level)"
                                    class="px-2 py-0.5 rounded-full text-xs font-medium">
                                    {{ alert.title }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-gray-600 max-w-xs truncate">{{ alert.message }}</td>
                            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                {{ formatDate(alert.created_at) }}
                            </td>
                            <td class="px-4 py-3">
                                <span :class="alert.is_active ? 'text-green-600' : 'text-gray-400'"
                                    class="text-xs font-medium">
                                    {{ alert.is_active ? 'Activa' : 'Inactiva' }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="alerts.length === 0" class="text-gray-400 text-sm p-6 text-center">
                    No hay alertas activas en este momento.
                </p>
            </div>

            <div v-if="pagination"
                class="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                <span>Página {{ pagination.current_page }} de {{ pagination.last_page }}</span>
                <div class="flex gap-2">
                    <button :disabled="pagination.current_page === 1" @click="fetchAlerts(pagination.current_page - 1)"
                        class="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        Anterior
                    </button>
                    <button :disabled="pagination.current_page === pagination.last_page"
                        @click="fetchAlerts(pagination.current_page + 1)"
                        class="px-3 py-1 border rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors">
                        Siguiente
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

const alerts = ref<any[]>([])
const pagination = ref<{ current_page: number; last_page: number } | null>(null)
const loading = ref(true)

const levelClass = (level: string) => {
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
        const data: any = await api('/user/alerts', { params: { page } })
        if (Array.isArray(data)) {
            alerts.value = data
            pagination.value = null
        } else {
            alerts.value = Array.isArray(data.data) ? data.data : []
            pagination.value = data.current_page ? {
                current_page: data.current_page,
                last_page: data.last_page,
            } : null
        }
    } catch (e) {
        console.error(e)
        alerts.value = []
    } finally {
        loading.value = false
    }
}

onMounted(fetchAlerts)
</script>