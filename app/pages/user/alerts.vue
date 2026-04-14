<template>
    <div class="p-6 max-w-7xl mx-auto">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Alertas activas</h1>
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