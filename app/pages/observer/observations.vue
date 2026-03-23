<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Observaciones</h1>
            <button @click="showForm = !showForm"
                class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm">
                {{ showForm ? 'Cancelar' : 'Nueva observación' }}
            </button>
        </div>

        <!-- Formulario de nueva observación -->
        <div v-if="showForm" class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="font-semibold text-gray-700 mb-4">Registrar observación</h2>
            <form @submit.prevent="submitObservation" class="grid grid-cols-2 gap-4">

                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Estación</label>
                    <select v-model="form.station_id" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="" disabled>Seleccione una estación</option>
                        <option v-for="station in stations" :key="station.id" :value="station.id">
                            {{ station.name }}
                        </option>
                    </select>
                </div>

                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha y hora de observación</label>
                    <input v-model="form.observed_at" type="datetime-local" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Temperatura (°C)</label>
                    <input v-model="form.temperature" type="number" step="0.1" required placeholder="Entre -50 y 60"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p v-if="errors.temperature" class="text-red-500 text-xs mt-1">{{ errors.temperature }}></p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precipitación (mm)</label>
                    <input v-model="form.precipitation" type="number" step="0.1" required min="0"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Velocidad del viento (km/h)</label>
                    <input v-model="form.wind_speed" type="number" step="0.1" min="0"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Humedad (%)</label>
                    <input v-model="form.humidity" type="number" step="0.1" required placeholder="Entre 0 y 100"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p v-if="errors.humidity" class="text-red-500 text-xs mt-1">{{ errors.humidity }}></p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Presión (hPa)</label>
                    <input v-model="form.pressure" type="number" step="0.1" required placeholder="Entre 800 y 1200"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p v-if="errors.pressure" class="text-red-500 text-xs mt-1">{{ errors.pressure }}></p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Dirección del viento (°)</label>
                    <input v-model="form.wind_direction" type="number" step="1" min="0" max="360"
                        placeholder="Entre 0 y 360"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <p v-if="formError" class="col-span-2 text-red-600 text-sm">{{ formError }}</p>
                <p v-if="formSuccess" class="col-span-2 text-green-600 text-sm">{{ formSuccess }}</p>

                <div class="col-span-2 flex justify-end gap-2">
                    <button type="button" @click="showForm = false"
                        class="px-4 py-2 bg-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                        Cancelar
                    </button>
                    <button type="submit" :disabled="submitting"
                        class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                        {{ submitting ? 'Guardando...' : 'Guardar observación' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Listado de observaciones -->
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
                        </tr>
                    </tbody>
                </table>

                <p v-if="observations.length === 0" class="text-gray-400 text-sm mt-2">
                    No hay observaciones registradas.
                </p>
            </div>
        </div>

        <!--- Paginación -->
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
const showForm = ref(false)
const submitting = ref(false)
const formError = ref('')
const formSuccess = ref('')
const errors = ref<any>({})
const observations = ref<any[]>([])
const stations = ref<any[]>([])
const pagination = ref<any>(null)

const form = reactive({
    station_id: '',
    observed_at: new Date().toISOString().slice(0, 16),
    temperature: null as number | null,
    precipitation: null as number | null,
    humidity: null as number | null,
    pressure: null as number | null,
    wind_speed: null as number | null,
    wind_direction: null as number | null,
})

const fetchObservations = async (page = 1) => {
    auth.loadFromStorage()
    try {
        const data: any = await $fetch('/observer/observations', {
            params: { page }
        })
        observations.value = data.data
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
        const data: any = await $fetch('/observer/stations')
        stations.value = data
    } catch (e) {
        console.error(e)
    }
}

const submitObservation = async () => {
    submitting.value = true
    formError.value = ''
    formSuccess.value = ''
    errors.value = {}

    try {
        await $fetch('/observer/observations', {
            method: 'POST',
            body: form
        })
        formSuccess.value = 'Observación registrada correctamente.'
        showForm.value = false
        await fetchObservations()
    } catch (e: any) {
        if (e?.response?.status === 422) {
            errors.value = e.response.data?.errors ?? {}
            formError.value = 'Revise los campos del formulario.'
        } else if (e?.response?.status === 403) {
            formError.value = 'No tienes permiso para registrar observaciones en esta estación.'
        } else {
            formError.value = 'Error al guardar la observación.'
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    auth.loadFromStorage()
    await Promise.all([fetchObservations(), fetchStations()])
})
</script>