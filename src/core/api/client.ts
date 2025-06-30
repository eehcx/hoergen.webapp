import axios from "axios";

// Get API URLs from environment variables with fallback to production URLs
const API_URL_V1 = import.meta.env.VITE_API_URL_V1 || 'https://api-kzphduejga-uc.a.run.app/v1';
const API_URL_V2 = import.meta.env.VITE_API_URL_V2 || 'https://nestjs-kzphduejga-uc.a.run.app/v2';

// Configuración común
const commonConfig = {
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
};

// Instancias para cada versión
export const apiV1 = axios.create({
    baseURL: API_URL_V1,
    ...commonConfig,
});

export const apiV2 = axios.create({
    baseURL: API_URL_V2,
    ...commonConfig,
});

// Export por defecto (mantiene retrocompatibilidad)
const api = apiV1;
export default api;