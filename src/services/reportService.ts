import { apiService } from './apiService';

export const reportService = {
  getReportData: async (timeRange: string) => {
    const data = await apiService.get(`/reports/data?timeRange=${timeRange}`);
    return data;
  }
};
