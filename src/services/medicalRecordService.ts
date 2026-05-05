import { apiService } from './apiService';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true
});

export const medicalRecordService = {
  getAll: async () => {
    const response = await apiService.get('/records');
    return response.data || [];
  },

  create: async (recordData: FormData | any) => {
    let response;
    if (recordData instanceof FormData) {
      response = await apiClient.post('/records', recordData);
      return response.data.data;
    } else {
      response = await apiService.post('/records', recordData);
      return response.data;
    }
  },

  delete: async (id: string) => {
    await apiService.delete(`/records/${id}`);
  }
};
