export function useApi() {
    const auth = useAuthStore()
    const config = useRuntimeConfig()
    
    // Wrapper around $fetch that injects baseURL and Authorization header automatically
    const api = <T = any>(path: string, options: Record<string, any> = {}) : Promise<T> => {
        return $fetch(path, {
            baseURL: config.public.apiBase as string,
            headers: {
                Authorization: `Bearer ${auth.token}`,
                ...options.headers,
            },
             ...options,
        })
    }

    return {api}
}