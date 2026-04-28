import { api } from "@/lib/apiClient";
import type {
  AddressesResponse,
  GetAddressesParams,
  CreateAddressInput,
  CreateAddressResponse,
  UpdateAddressInput,
  UpdateAddressResponse,
  DeleteAddressResponse,
  SetDefaultAddressResponse,
} from "@/types/address.types";

// ─── Client-side Service (for mutations) ───────────────────────────────────

export const addressService = {
  getAddresses: (params: GetAddressesParams = {}): Promise<AddressesResponse> => {
    const { page = 1, limit = 10 } = params;
    return api.get<AddressesResponse>("/addresses", {
      params: { page, limit },
    });
  },
  createAddress: (input: CreateAddressInput): Promise<CreateAddressResponse> => {
    return api.post<CreateAddressResponse>("/addresses", input);
  },
  updateAddress: (id: string, input: UpdateAddressInput): Promise<UpdateAddressResponse> => {
    return api.patch<UpdateAddressResponse>(`/addresses/${id}`, input);
  },
  deleteAddress: (id: string): Promise<DeleteAddressResponse> => {
    return api.delete<DeleteAddressResponse>(`/addresses/${id}`);
  },
  setDefaultAddress: (id: string): Promise<SetDefaultAddressResponse> => {
    return api.patch<SetDefaultAddressResponse>(`/addresses/${id}/default`);
  },
};
