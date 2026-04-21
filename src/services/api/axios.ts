import axios, { AxiosError } from 'axios'

// Global error handler
const globalErrorHandler = (error: AxiosError) => {
    // Xử lý lỗi toàn cục tại đây
    if (error.response) {
        // Server response with error status
        console.error(`API Error: ${error.response.status}`, error.response.data)
    } else if (error.request) {
        // Request made but no response
        console.error('No response from server:', error.request)
    } else {
        // Error in request setup
        console.error('Error:', error.message)
    }
}

const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use(config => {
    // You can add authorization tokens or other headers here
    // config.headers['Authorization'] = `Bearer ${token}`;
    return config
}
    , error => {
        return Promise.reject(error)
    })

api.interceptors.response.use(response => {
    return response
}
    , error => {
        // Tự động bắt lỗi ở đây
        globalErrorHandler(error as AxiosError)
        return Promise.reject(error)
    })

export default api