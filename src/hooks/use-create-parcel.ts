import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parcelService, CreateParcelInput } from "@/services/parcel.service";

export function useCreateParcel() {
    const router = useRouter();

    return useMutation({
        mutationFn: (input: CreateParcelInput) => parcelService.createParcel(input),
        onSuccess: (response) => {
            toast.success(response.message || "Parcel created successfully!");
            router.push("/dashboard/parcels");
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message || "Failed to create parcel. Please try again.");
        },
    });
}
