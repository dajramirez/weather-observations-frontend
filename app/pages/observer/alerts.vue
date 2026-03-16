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
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth'],
    meta: { role: 'observer' },
})

const { api } = useApi()
const auth = useAuthStore()

const loading = ref(true)
const alerts = ref<any[]>([])
const pagination = ref<any>(null)

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
        const data: any = await $fetch('/observer/alerts', {
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