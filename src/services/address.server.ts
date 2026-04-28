import "server-only";
import { serverFetch } from "@/lib/serverFetch";
import type {
  AddressesResponse,
  GetAddressesParams,
} from "@/types/address.types";

export async function getAddresses(params: GetAddressesParams = {}): Promise<AddressesResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  return serverFetch<AddressesResponse>(`/addresses?${searchParams.toString()}`);
}
