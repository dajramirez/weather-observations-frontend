<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
                Iniciar sesión
            </h1>

            <NuxtLink to="/" class="flex items-center gap-1 text-sm text-gray-400 hover:text-blue-600 transition mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al inicio
            </NuxtLink>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.email" type="email" required autofocus
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <div class="relative">
                        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                            class="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

                <button type="submit" :disabled="loading"
                    class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
                    {{ loading ? 'Accediendo...' : 'Entrar' }}
                </button>
                <p class="text-center text-sm text-gray-500 mt-2">
                    ¿No tienes cuenta?
                    <NuxtLink to="/register" class="text-blue-600 hover:underline">Regístrate</NuxtLink>
                </p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

onMounted(() => {
    auth.loadFromStorage()
    if (auth.isAuthenticated) {
        if (auth.isAdmin) router.push('/admin')
        else if (auth.isObserver) router.push('/observer')
        else if (auth.isUser) router.push('/user')
    }
})

const handleLogin = async () => {
    error.value = '';
    loading.value = true;

    try {
        await auth.login(form.email, form.password);
        if (auth.isAdmin) {
            router.push('/admin')
        } else if (auth.isObserver) {
            router.push('/observer')
        } else if (auth.isUser) {
            router.push('/user')
        }
    } catch (e: any) {
        error.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
    } finally {
        loading.value = false;
    }
}
</script>