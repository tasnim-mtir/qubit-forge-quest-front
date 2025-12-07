import { useState } from "react";
import { useGetPendingRequests, useApproveRequest, useRejectRequest } from "@/hooks/useRoleRequest";
import { ChevronLeft, ChevronRight, Loader, CheckCircle, XCircle, Clock, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { RoleRequest } from "@/services/protocolAPI";

export function PendingRoleRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RoleRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: requestsData, isLoading, refetch } = useGetPendingRequests(currentPage, 10);
  const { mutate: approveRequest, isPending: isApproving } = useApproveRequest();
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectRequest();

  const requests = requestsData?.requests || [];
  const totalPages = requestsData?.pagination?.pages || 1;

  const handleApprove = (request: RoleRequest) => {
    approveRequest(request._id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleRejectClick = (request: RoleRequest) => {
    setSelectedRequest(request);
    setRejectReason("");
    setShowRejectDialog(true);
  };

  const handleReject = () => {
    if (selectedRequest) {
      rejectRequest(
        { requestId: selectedRequest._id, reason: rejectReason || undefined },
        {
          onSuccess: () => {
            setShowRejectDialog(false);
            setSelectedRequest(null);
            setRejectReason("");
            refetch();
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-slate-400">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
        <p className="text-slate-400">No pending role requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-gradient-to-r from-slate-900/50 to-slate-950/50 border border-blue-500/20 rounded-lg p-5 hover:border-blue-500/40 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-100 truncate">
                    {request.userId.email}
                  </h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold capitalize whitespace-nowrap">
                    {request.requestedRole}
                  </span>
                </div>

                {request.message && (
                  <div className="flex items-start gap-2 mb-3 text-sm">
                    <MessageSquare className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-400">{request.message}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  <span>Requested {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(request)}
                  disabled={isApproving}
                  className="px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isApproving ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Approve
                </button>
                <button
                  onClick={() => handleRejectClick(request)}
                  disabled={isRejecting}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isRejecting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-slate-800/50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition-all text-sm ${
                  currentPage === page
                    ? "bg-blue-600/40 border border-blue-500/50 text-blue-300"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-slate-800/50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Role Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-2">
                Rejecting request from <span className="font-semibold text-slate-200">{selectedRequest?.userId.email}</span> for{" "}
                <span className="font-semibold text-slate-200 capitalize">{selectedRequest?.requestedRole}</span> role
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200 block mb-2">
                Rejection Reason (Optional)
              </label>
              <Textarea
                placeholder="Provide a reason for rejection (will be sent to the user)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
                disabled={isRejecting}
                className="bg-slate-900/50 border-slate-700 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={isRejecting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isRejecting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  "Reject Request"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
