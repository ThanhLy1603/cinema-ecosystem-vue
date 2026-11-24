import type { AxiosResponse } from 'axios';
import axiosInstance from '@/api/axiosClient';
import type { ApiResponse } from '@/types/common/api';

export async function getPublicCities(): Promise<string[]> {
   const axiosResponse: AxiosResponse<ApiResponse<string[]>> =
      await axiosInstance.get<ApiResponse<string[]>>('/cinemas/public/cities');
   return axiosResponse.data.data;
}
