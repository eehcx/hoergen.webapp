// API client using native fetch instead of axios
// Get API URLs from environment variables
const API_URL_V1 = import.meta.env.VITE_API_URL_V1 || '/api/v1';
const API_URL_V2 = import.meta.env.VITE_API_URL_V2 || '/api/v2';

// Debug logging
console.log('API URLs:', { API_URL_V1, API_URL_V2 });

// Common configuration for fetch requests
const commonHeaders = {
    'Content-Type': 'application/json',
};

// Request timeout helper
const timeoutPromise = (ms: number) => 
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms));

// Fetch wrapper with timeout and error handling
const fetchWithConfig = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
        const response = await Promise.race([
            fetch(url, {
                ...options,
                headers: {
                    ...commonHeaders,
                    ...options.headers,
                },
                signal: controller.signal,
            }),
            timeoutPromise(10000)
        ]) as Response;

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

// API client for v1
export const apiV1 = {
    get: async (endpoint: string) => {
        const response = await fetchWithConfig(`${API_URL_V1}${endpoint}`);
        return { data: await response.json() };
    },
    post: async (endpoint: string, data?: any) => {
        const response = await fetchWithConfig(`${API_URL_V1}${endpoint}`, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
        return { data: await response.json() };
    },
    put: async (endpoint: string, data?: any) => {
        const response = await fetchWithConfig(`${API_URL_V1}${endpoint}`, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        return { data: await response.json() };
    },
    delete: async (endpoint: string) => {
        const response = await fetchWithConfig(`${API_URL_V1}${endpoint}`, {
            method: 'DELETE',
        });
        return { data: await response.json() };
    },
};

// API client for v2
export const apiV2 = {
    get: async (endpoint: string) => {
        const response = await fetchWithConfig(`${API_URL_V2}${endpoint}`);
        return { data: await response.json() };
    },
    post: async (endpoint: string, data?: any) => {
        const response = await fetchWithConfig(`${API_URL_V2}${endpoint}`, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
        return { data: await response.json() };
    },
    put: async (endpoint: string, data?: any) => {
        const response = await fetchWithConfig(`${API_URL_V2}${endpoint}`, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
        return { data: await response.json() };
    },
    delete: async (endpoint: string) => {
        const response = await fetchWithConfig(`${API_URL_V2}${endpoint}`, {
            method: 'DELETE',
        });
        return { data: await response.json() };
    },
};

// Export por defecto (mantiene retrocompatibilidad)
const api = apiV1;
export default api;