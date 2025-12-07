import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRoleRequest } from "@/hooks/useRoleRequest";
import { Loader } from "lucide-react";

interface RoleRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RoleRequestDialog({ open, onOpenChange, onSuccess }: RoleRequestDialogProps) {
  const [requestedRole, setRequestedRole] = useState<"creator" | "investor">("creator");
  const [message, setMessage] = useState("");
  const { mutate: createRequest, isPending } = useCreateRoleRequest();

  const handleSubmit = () => {
    createRequest(
      { requestedRole, message: message || undefined },
      {
        onSuccess: () => {
          setMessage("");
          setRequestedRole("creator");
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Role Access</DialogTitle>
          <DialogDescription>
            Apply to become a Creator or Investor. Your request will be reviewed by an administrator.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="text-sm font-medium text-slate-200 block mb-3">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRequestedRole("creator")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  requestedRole === "creator"
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                }`}
              >
                <p className="font-semibold text-slate-200">Creator</p>
                <p className="text-xs text-slate-400 mt-1">Create and submit compute tasks</p>
              </button>

              <button
                onClick={() => setRequestedRole("investor")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  requestedRole === "investor"
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                }`}
              >
                <p className="font-semibold text-slate-200">Investor</p>
                <p className="text-xs text-slate-400 mt-1">Lease compute resources</p>
              </button>
            </div>
          </div>

          {/* Role Details */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            {requestedRole === "creator" ? (
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Creator Benefits</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>✓ Submit compute tasks to the network</li>
                  <li>✓ Access compute resources for your ML projects</li>
                  <li>✓ Monitor task execution and results</li>
                  <li>✓ Earn rewards from successful executions</li>
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Investor Benefits</h4>
                <ul className="text-sm text-slate-400 space-y-1">
                  <li>✓ Lease compute resources from creators</li>
                  <li>✓ Access to compute marketplace</li>
                  <li>✓ Flexible compute packages</li>
                  <li>✓ Earn returns from resource utilization</li>
                </ul>
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <label className="text-sm font-medium text-slate-200 block mb-2">
              Why do you want this role? (Optional)
            </label>
            <Textarea
              placeholder={`Tell us why you'd like to become a ${requestedRole}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-900/50 border-slate-700 text-slate-200 placeholder:text-slate-500"
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="bg-slate-900/50 border-slate-700 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
            >
              {isPending ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
