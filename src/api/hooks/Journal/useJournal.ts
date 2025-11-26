import { api } from "@/api/helpers/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface JournalAsset {
    asset_id: string;
    asset_url: string;
}

export interface CreateJournalBody {
    content_type: string;
    tickers: string[];
    title: string;
    body: string;
    assets?: JournalAsset[];
    community_id?: string;
    reply_to_content_id?: string;
}

export interface UpdateJournalBody {
    title?: string;
    subtitle?: string;
    body?: string;
    tickers?: string[];
    assets?: JournalAsset[];
}

export interface JournalResponse {
    message: string;
    success: boolean;
    data?: any;
}

export const useCreateJournal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateJournalBody) =>
            api.post<JournalResponse>("/users/journals", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
        },
    });
};

export const useUpdateJournal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contentId, data }: { contentId: string; data: UpdateJournalBody }) =>
            api.put<JournalResponse>(`/content/${contentId}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
        },
    });
};

export const useDeleteJournal = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contentId: string) =>
            api.delete<JournalResponse>(`/content/${contentId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["journals"] });
        },
    });
};

export const useGetJournals = (params: {
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
}) => {
    return useQuery({
        queryKey: ["journals", params],
        queryFn: () => api.get<{ data: any }>("/users/journals", params),
    });
};