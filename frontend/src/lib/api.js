import axios from 'axios';

// API Base URL - Use relative paths for production (when frontend and backend are served from same domain)
// In development, use VITE_API_URL from .env
// In production, use relative path /api
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'production' 
    ? '/api' 
    : 'http://localhost:3000/api'
);

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
        const adminToken = localStorage.getItem('givora_admin_token');
        const userToken = localStorage.getItem('givora_session_token');

        // Use admin token for:
        // 1. URLs that include '/admin'
        // 2. Product management endpoints (upload, create, update, delete) when admin is logged in
        const isAdminRoute = config.url?.includes('/admin');
        const isProductManagement = config.url?.includes('/products') &&
            (config.method === 'post' || config.method === 'put' || config.method === 'delete');

        const useAdminToken = (isAdminRoute || isProductManagement) && adminToken;
        const token = useAdminToken ? adminToken : userToken;

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
            // Check if this was an admin route
            const isAdminRoute = error.config?.url?.includes('/admin');

            if (isAdminRoute) {
                // Admin token expired or invalid
                localStorage.removeItem('givora_admin_token');
                window.location.href = '/admin/login';
            } else {
                // User token expired or invalid
                localStorage.removeItem('givora_session_token');
                localStorage.removeItem('givora_user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error.response?.data || error.message);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    verifyEmail: (verificationMail, verificationCode) => api.post('/auth/verify-email', { email: verificationMail, code: verificationCode }),
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
    login: (data) => {
        try {
            // console.log(data);
            return api.post('/admin/login', data);
        } catch (error) {
            console.error('Admin login failed:', error);
            throw error;
        }
    },
    getStats: () => api.get('/admin/stats'),

    // Wholesale management
    getWholesaleApplications: (status) => {
        try {
            return api.get('/admin/wholesale/applications', { params: { status } });
        } catch (error) {
            console.error('Failed to fetch wholesale applications:', error);
            throw error;
        }
    },
    approveWholesale: (id) => {
        try {
            return api.put(`/admin/wholesale/${id}/approve`);
        } catch (error) {
            console.error('Failed to approve wholesale application:', error);
            throw error;
        }
    },
    rejectWholesale: (id) => {
        try {
            return api.put(`/admin/wholesale/${id}/reject`);
        } catch (error) {
            console.error('Failed to reject wholesale application:', error);
            throw error;
        }
    },

    // Messages
    getMessages: (read) => api.get('/admin/messages', { params: { read } }),
    markMessageRead: (id) => api.put(`/admin/messages/${id}/read`),
    deleteMessage: (id) => api.delete(`/admin/messages/${id}`),

    // Orders
    getOrders: (status) => api.get('/admin/orders', { params: { status } }),
    updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),

    // Products
    getProducts: (status) => api.get('/products', { params: { status } }),
    updateProductStatus: (id, status) => api.put(`/products/${id}/status`, { status }),
    createProduct: (data) => api.post('/products', data),
    updateProduct: (id, data) => api.put(`/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/products/${id}`),
    uploadProductImage: (formData) => {
        return api.post('/products/upload-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    uploadProductImages: (formData) => {
        return api.post('/products/upload-images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Users
    getUsers: (accountType) => api.get('/admin/users', { params: { accountType } })
};

export default api;
