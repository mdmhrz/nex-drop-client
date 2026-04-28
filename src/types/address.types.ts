// ─── Address Types ─────────────────────────────────────────────────────────────

export interface Address {
  id: string;
  userId: string;
  label: string;
  address: string;
  district: string;
  upazila: string;
  thana: string | null;
  phone: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressesResponseMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AddressesResponse {
  success: boolean;
  message: string;
  data: Address[];
  meta: AddressesResponseMeta;
}

export interface GetAddressesParams {
  page?: number;
  limit?: number;
}

export interface CreateAddressInput {
  label: string;
  address: string;
  district: string;
  upazila: string;
  thana?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface CreateAddressResponse {
  success: boolean;
  message: string;
  data: Address;
}

export interface UpdateAddressInput {
  label?: string;
  address?: string;
  district?: string;
  upazila?: string;
  thana?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressResponse {
  success: boolean;
  message: string;
  data: Address;
}

export interface DeleteAddressResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export interface SetDefaultAddressResponse {
  success: boolean;
  message: string;
  data: Address;
}
