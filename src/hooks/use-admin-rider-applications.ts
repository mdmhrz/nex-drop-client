import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getAllRiderApplicationsClient, updateRiderAccountStatusClient } from "@/services/admin.service";
import type {
    GetRiderApplicationsParams,
    RiderApplication,
    RiderApplicationsResponse,
    UpdateRiderAccountStatusParams,
    UpdateRiderAccountStatusResponse,
    RiderAccountStatus,
} from "@/services/admin.server";

export type { RiderApplication, RiderApplicationsResponse, GetRiderApplicationsParams, RiderAccountStatus };

export const ADMIN_RIDER_APPLICATIONS_KEY = ["admin", "rider-applications"];

export function useAdminRiderApplications(params: GetRiderApplicationsParams = {}) {
    return useQuery({
        queryKey: [...ADMIN_RIDER_APPLICATIONS_KEY, params],
        queryFn: () => getAllRiderApplicationsClient(params),
        staleTime: 0,
    });
}

export function useUpdateRiderAccountStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ riderId, params }: { riderId: string; params: UpdateRiderAccountStatusParams }) =>
            updateRiderAccountStatusClient(riderId, params),
        onSuccess: (response: UpdateRiderAccountStatusResponse) => {
            toast.success(response.message || "Rider status updated successfully");
            queryClient.invalidateQueries({ queryKey: ADMIN_RIDER_APPLICATIONS_KEY });
        },
        onError: (error: unknown) => {
            const errorMessage = (error as { message?: string })?.message || "Failed to update rider status";
            toast.error(errorMessage);
        },
    });
}
