import api from "../api/axiosConfig";

const API_URL = "/auth";

export const register = (user) => {
    return api.post(`${API_URL}/register`, user);
};

export const login = (user) => {
    return api.post(`${API_URL}/login`, user);
};