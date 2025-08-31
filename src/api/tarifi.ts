import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export const getTariffs = () => {
  return useQuery({
    queryKey: ['tariffs'],
    queryFn: async () => {
      const response = await api.get('/tariffs');
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};