import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { parcelService, type GetAvailableParcelsParams } from "@/services/parcel.service";

export const AVAILABLE_PARCELS_KEY = "available-parcels" as const;

export function useAvailableParcels(params: GetAvailableParcelsParams = {}) {
    const { page = 1, limit = 10 } = params;

    return useQuery({
        queryKey: [AVAILABLE_PARCELS_KEY, { page, limit }],
        queryFn: () => parcelService.getAvailableParcels({ page, limit }),
        placeholderData: keepPreviousData,
    });
}
