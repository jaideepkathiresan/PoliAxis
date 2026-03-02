import { apiClient } from './api';

export const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/register', { email, password });
    return response.data;
};

export const submitSurvey = async (data: any) => {
    const response = await apiClient.post('/survey/submit', data);
    return response.data;
};

export const getResults = async () => {
    const response = await apiClient.get('/survey/my-results');
    return response.data;
};
