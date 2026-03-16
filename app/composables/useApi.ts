export function useApi() {
    const auth = useAuthStore()
    const config = useRuntimeConfig()
    
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