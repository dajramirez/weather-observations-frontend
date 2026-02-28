<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navbar -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <span class="font-bold text-lg text-blue-600">WeatherObs</span>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">{{ auth.user?.name }}</span>
                    <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {{ auth.user?.role?.name }}
                    </span>
                    <button @click="auth.logout()" class="text-sm text-red-500 hover:text-red-700 transition">
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>

        <!-- Sidebar + Content -->
        <div class="max-w-7xl mx-auto px-4 py-6 flex gap-6">
            <!-- Sidebar -->
            <aside class="w-56 shrink-0">
                <nav class="bg-white rounded-lg shadow-sm p-4 space-y-1">
                    <template v-if="auth.isAdmin">
                        <NuxtLink to="/admin" class="nav-link">Dashboard</NuxtLink>
                        <NuxtLink to="/admin/stations" class="nav-link">Estaciones</NuxtLink>
                        <NuxtLink to="/admin/users" class="nav-link">Usuarios</NuxtLink>
                        <NuxtLink to="/admin/alerts" class="nav-link">Alertas</NuxtLink>
                    </template>
                    <template v-else-if="auth.isObserver">
                        <NuxtLink to="/observer" class="nav-link">Dashboard</NuxtLink>
                        <NuxtLink to="/observer/observations" class="nav-link">Observaciones</NuxtLink>
                        <NuxtLink to="/observer/reports" class="nav-link">Reportes</NuxtLink>
                        <NuxtLink to="/observer/alerts" class="nav-link">Alertas</NuxtLink>
                    </template>
                </nav>
            </aside>

            <!-- Main Content -->
            <main class="flex-1">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
</script>

<style scoped>
.nav-link {
    @apply block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition;
}
</style>