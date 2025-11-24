import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('givora_session_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('givora_session_token');
            localStorage.removeItem('givora_user');
            window.location.href = '/login';
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    verifyEmail: (email) => api.post('/auth/verify-email', { email }),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
    createToken: (userId) => api.post('/auth/create-token', { userId }),
    consumeToken: (token) => api.post('/auth/consume-token', { token }),
    verifyToken: (token) => api.post('/auth/verify-token', { token }),
    loginWithGoogle: (data) => api.post('/auth/login-with-google', data),
};

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/products/upload-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

// Cart API
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (productId, quantity) => api.post('/cart', { productId, quantity }),
    update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
    remove: (itemId) => api.delete(`/cart/${itemId}`),
    clear: () => api.delete('/cart')
};

// Orders API
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`)
};

// Wholesale API
export const wholesaleAPI = {
    apply: (data) => api.post('/wholesale/apply', data),
    getStatus: () => api.get('/wholesale/status')
};

// Contact API
export const contactAPI = {
    submit: (data) => api.post('/contact', data)
};

// Payment API
export const paymentAPI = {
    getConfig: () => api.get('/payment/config'),
    createIntent: (amount, metadata) => api.post('/payment/create-intent', { amount, metadata }),
    confirmPayment: (paymentIntentId) => api.post('/payment/confirm', { paymentIntentId })
};

// Admin API
export const adminAPI = {
    login: (data) => api.post('/admin/login', data),
    getStats: () => api.get('/admin/stats'),

    // Wholesale management
    getWholesaleApplications: (status) => api.get('/admin/wholesale/applications', { params: { status } }),
    approveWholesale: (id) => api.put(`/admin/wholesale/${id}/approve`),
    rejectWholesale: (id) => api.put(`/admin/wholesale/${id}/reject`),

    // Messages
    getMessages: (read) => api.get('/admin/messages', { params: { read } }),
    markMessageRead: (id) => api.put(`/admin/messages/${id}/read`),
    deleteMessage: (id) => api.delete(`/admin/messages/${id}`),

    // Orders
    getOrders: (status) => api.get('/admin/orders', { params: { status } }),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),

    // Users
    getUsers: (accountType) => api.get('/admin/users', { params: { accountType } })
};

export default api;
