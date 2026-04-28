import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/address.service";
import { toast } from "sonner";
import type {
  Address,
  AddressesResponse,
  GetAddressesParams,
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/address.types";

export const ADDRESSES_KEY = ["addresses"];

export type { Address, AddressesResponse, GetAddressesParams, CreateAddressInput, UpdateAddressInput };

export function useAddresses(params: GetAddressesParams = {}) {
  return useQuery({
    queryKey: [...ADDRESSES_KEY, params],
    queryFn: () => addressService.getAddresses(params),
    staleTime: Infinity,
  });
}

export function useAddressMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (input: CreateAddressInput) => addressService.createAddress(input),
    onSuccess: (response) => {
      toast.success(response.message || "Address created successfully");
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to create address";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAddressInput }) =>
      addressService.updateAddress(id, input),
    onSuccess: (response) => {
      toast.success(response.message || "Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to update address";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: (response) => {
      toast.success(response.message || "Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to delete address";
      toast.error(errorMessage);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),
    onSuccess: (response) => {
      toast.success(response.message || "Default address set successfully");
      queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY });
    },
    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to set default address";
      toast.error(errorMessage);
    },
  });

  return {
    createAddress: createMutation.mutate,
    updateAddress: updateMutation.mutate,
    deleteAddress: deleteMutation.mutate,
    setDefaultAddress: setDefaultMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSettingDefault: setDefaultMutation.isPending,
  };
}
