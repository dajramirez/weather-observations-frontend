<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
                Iniciar sesión
            </h1>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input v-model="form.email" type="email" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                    <input v-model="form.password" type="password" required
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

                <button type="submit" :disabled="loading"
                    class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
                    {{ loading ? 'Accediendo...' : 'Entrar' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
    error.value = '';
    loading.value = true;

    try {
        await auth.login(form.email, form.password);
        if (auth.isAdmin) {
            router.push('/admin')
        } else if (auth.isObserver) {
            router.push('/observer')
        }
    } catch (e: any) {
        error.value = 'Credenciales incorrectas. Inténtalo de nuevo.'
    } finally {
        loading.value = false;
    }
}
</script>