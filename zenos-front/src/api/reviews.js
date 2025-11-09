// src/api/auth.js
import api from "./axios";

// Get current user info
export const getCurrentUser = () => api.get('/current-user/');

// Get all establishments
export const getEstablishments = () => api.get('/reviews/establishments/');

// Get all reviews
export const getReviews = () => api.get('/reviews/');

// Add a new review
export const addReview = (data) => api.post('/reviews/', data);

// Register (not implemented in backend)
export const register = (data) => api.post('/register/', data);

export const getProducts = (establishment_id) => api.get('/reviews/products/', { params: { establishment_id } });

// Send a purchase request to the backend. Payload should be an object like:
// { establishment_id: <id>, items: [ { id: <product_id>, qty: <number> , price?: <number> }, ... ] }
export const buyProducts = (payload) => api.post('/reviews/products/buy/', payload);

