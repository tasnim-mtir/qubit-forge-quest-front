import { useMutation, useQuery } from "@tanstack/react-query";
import { roleRequestAPI, RoleRequest, RoleRequestsResponse } from "@/services/protocolAPI";
import { toast } from "sonner";

export const useCreateRoleRequest = () => {
  return useMutation({
    mutationFn: (data: { requestedRole: "creator" | "investor"; message?: string }) =>
      roleRequestAPI.createRequest(data.requestedRole, data.message),
    onSuccess: () => {
      toast.success("Role request submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create role request");
    },
  });
};

export const useGetMyRoleRequest = () => {
  return useQuery({
    queryKey: ["myRoleRequest"],
    queryFn: () => roleRequestAPI.getMyRequest(),
    staleTime: 30000,
  });
};

export const useGetPendingRequests = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["pendingRequests", page, limit],
    queryFn: () => roleRequestAPI.getPendingRequests(page, limit),
    staleTime: 30000,
  });
};

export const useGetPendingCount = () => {
  return useQuery({
    queryKey: ["pendingRequestsCount"],
    queryFn: () => roleRequestAPI.getPendingCount(),
    staleTime: 10000,
  });
};

export const useApproveRequest = () => {
  return useMutation({
    mutationFn: (requestId: string) => roleRequestAPI.approveRequest(requestId),
    onSuccess: () => {
      toast.success("Request approved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve request");
    },
  });
};

export const useRejectRequest = () => {
  return useMutation({
    mutationFn: (data: { requestId: string; reason?: string }) =>
      roleRequestAPI.rejectRequest(data.requestId, data.reason),
    onSuccess: () => {
      toast.success("Request rejected successfully!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject request");
    },
  });
};
