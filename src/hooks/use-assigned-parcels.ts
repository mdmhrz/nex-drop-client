import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { parcelService, type GetAssignedParcelsParams } from "@/services/parcel.service";

export const ASSIGNED_PARCELS_KEY = "assigned-parcels" as const;

export function useAssignedParcels(params: GetAssignedParcelsParams = {}) {
    const { page = 1, limit = 10 } = params;

    return useQuery({
        queryKey: [ASSIGNED_PARCELS_KEY, { page, limit }],
        queryFn: () => parcelService.getAssignedParcels({ page, limit }),
        placeholderData: keepPreviousData,
    });
}
