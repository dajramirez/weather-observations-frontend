<template>
    <aside class="w-64 border-r border-gray-200 p-6 flex-shrink-0 bg-white">
        <div class="mb-8">
            <div class="flex items-center gap-2 mb-1">
                <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">Manual</span>
            </div>
            <h2 class="text-xl font-extrabold text-gray-900 capitalize">{{ roleLabel }}</h2>
        </div>

        <nav class="space-y-1">
            <NuxtLink v-for="item in menuItems" :key="item.path" :to="`/help/${role}${item.path}`"
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                active-class="bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                inactive-class="text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                <span class="text-lg group-hover:scale-110 transition-transform">{{ item.icon }}</span>
                {{ item.label }}
            </NuxtLink>
        </nav>
    </aside>
</template>

<script setup lang="ts">
const props = defineProps<{
    role: string
}>()

const navigationMap: Record<string, { label: string, path: string, icon: string }[]> = {
    admin: [
        { label: 'Dashboard', path: '', icon: '🏠' },
        { label: 'Estaciones', path: '/stations', icon: '📡' },
        { label: 'Usuarios', path: '/users', icon: '👥' },
        { label: 'Observaciones', path: '/observations', icon: '🌡' },
        { label: 'Reportes', path: '/reports', icon: '📊' },
        { label: 'Alertas', path: '/alerts', icon: '🚨' },
    ],
    observer: [
        { label: 'Dashboard', path: '', icon: '🏠' },
        { label: 'Observaciones', path: '/observations', icon: '📝' },
        { label: 'Reportes', path: '/reports', icon: '📊' },
        { label: 'Alertas', path: '/alerts', icon: '⚠️' },
    ],
    user: [
        { label: 'Dashboard', path: '', icon: '🏠' },
        { label: 'Reportes', path: '/reports', icon: '📈' },
        { label: 'Alertas', path: '/alerts', icon: '🚨' },
    ]
}

const menuItems = computed(() => navigationMap[props.role] || [])

const roleLabel = computed(() => {
    const map: Record<string, string> = {
        admin: 'Administrador',
        observer: 'Observador',
        user: 'Usuario',
    }
    return map[props.role] ?? props.role
})
</script>