import { useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// interface ScanResponse {
//     message: string;
//     bonus?: string;
// }

interface BonusHistoryResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        bonus: string;
        barcode_data: string;
        created_at: string;
    }[];
    total_bonuses: number;
    filtered_total?: number;
}

interface BonusHistoryParams {
    page?: number;
    search?: string;
    from_date?: string;
    to_date?: string;
}

export const useScan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ barcode_data }: { barcode_data: string }) => {
            const token = localStorage.getItem('accessToken');

            if (!token) {
                throw new Error("Необходима авторизация. Пожалуйста, войдите снова.");
            }

            const response = await fetch('https://test.easybonus.uz/api/scan/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ barcode_data })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Произошла ошибка при сканировании");
            }

            return response.json();
        },
        onSuccess: async (data) => {
            queryClient.setQueryData(['bonusHistory'], (oldData: any) => {
                if (!oldData?.pages?.[0]) return oldData;
                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            total_bonuses: data.total_bonuses || oldData.pages[0].total_bonuses
                        },
                        ...oldData.pages.slice(1)
                    ]
                };
            });
            
            await queryClient.invalidateQueries({ queryKey: ['bonusHistory'] });
        }
    });
}

export const useBonusHistory = (params: BonusHistoryParams = {}) => {
    const { search, from_date, to_date } = params;
    const token = localStorage.getItem('accessToken');

    return useInfiniteQuery<BonusHistoryResponse>({
        queryKey: ['bonusHistory', search, from_date, to_date],
        queryFn: async ({ pageParam = 1 }) => {
            const queryParams: Record<string, any> = {
                page: pageParam,
                search,
            };

            if (from_date && to_date) {
                queryParams.from_date = from_date;
                queryParams.to_date = to_date;
            }

            const response = await axios.get<BonusHistoryResponse>(
                `https://test.easybonus.uz/api/user/bonus`,
                {
                    params: queryParams,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        },
        getNextPageParam: (lastPage) => {
            if (lastPage.next) {
                const url = new URL(lastPage.next);
                const nextPage = url.searchParams.get('page');
                return nextPage ? parseInt(nextPage) : undefined;
            }
            return undefined;
        },
        initialPageParam: 1,
    });
};







