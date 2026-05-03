<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <span class="font-bold text-lg text-blue-600">WeatherObs</span>
                    <span class="text-gray-300">·</span>
                    <span class="text-sm text-gray-500">Ayuda</span>
                    <span class="text-gray-300">·</span>
                    <span class="text-sm font-medium text-gray-700">{{ title }}</span>
                </div>
                <button @click="closeWindow()"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cerrar
                </button>
            </div>
        </div>

        <!-- Content -->
        <div class="flex max-w-6xl mx-auto">

            <!-- Sidebar: role-based navigation menu -->
            <HelpSidebar :role="role.toLocaleLowerCase()" />
            <div class="flex-1 px-10 py-10">
                <!-- Title block -->
                <div class="mb-8">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3">
                        <span>{{ translateRole(role) }}</span>
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ title }}</h1>
                    <p class="text-gray-500 leading-relaxed">{{ description }}</p>
                </div>

                <hr class="border-gray-200 mb-8">

                <!-- Actions -->
                <div class="space-y-4">
                    <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Acciones disponibles
                    </h2>
                    <div v-for="action in actions" :key="action.title"
                        class="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-200 transition-colors">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-blue-600 text-sm font-bold">{{ action.icon }}</span>
                            </div>
                            <div>
                                <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ action.title }}</h3>
                                <p class="text-sm text-gray-500 leading-relaxed">{{ action.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notes -->
                <div v-if="notes" class="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
                    <div class="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p class="text-sm text-amber-700 leading-relaxed">{{ notes }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    role: string
    description: string
    actions: { icon: string; title: string; description: string }[]
    notes?: string
}>()

// Function to manage window closing
const closeWindow = () => {
    if (typeof window !== 'undefined') {
        window.close()
    }
}

const translateRole = (role: string) => {
    switch (role.toLocaleLowerCase()) {
        case 'admin':
            return 'Administrador'
        case 'observer':
            return 'Observador'
        case 'user':
            return 'Usuario'
        default:
            return role
    }
}
</script>