import { X, AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateLease } from "@/hooks/useProtocol";
import { useToast } from "@/hooks/use-toast";
import type { MarketplacePackage } from "@/services/protocolAPI";

interface LeaseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData?: MarketplacePackage;
}

export function LeaseCreationModal({
  isOpen,
  onClose,
  packageData,
}: LeaseCreationModalProps) {
  const [step, setStep] = useState<"details" | "review" | "confirm">("details");
  const [quantity, setQuantity] = useState(1);
  const [customDuration, setCustomDuration] = useState(packageData?.duration || 30);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { mutate: createLease, isPending } = useCreateLease();
  const { toast } = useToast();

  if (!packageData) return null;

  const totalComputeAmount = packageData.computeAmount * quantity;
  const totalCost = packageData.costCC * quantity;
  const totalCCWithDuration = (totalCost * customDuration) / packageData.duration;

  const handleCreateLease = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Please accept the terms",
        description: "You must agree to the lease terms to continue",
        variant: "destructive",
      });
      return;
    }

    createLease(
      {
        computeAmount: totalComputeAmount,
        costCC: Math.ceil(totalCCWithDuration),
        duration: customDuration,
      },
      {
        onSuccess: () => {
          toast({
            title: "Lease created successfully!",
            description: `You now have ${totalComputeAmount} compute units leased for ${customDuration} days.`,
          });
          setStep("confirm");
          setTimeout(() => {
            onClose();
            setStep("details");
          }, 2000);
        },
        onError: (error: any) => {
          toast({
            title: "Failed to create lease",
            description: error.message || "An error occurred while creating the lease",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-500/20 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/10">
          <div>
            <h2 className="text-xl font-bold text-white">
              {step === "details" && "Lease Configuration"}
              {step === "review" && "Review Your Lease"}
              {step === "confirm" && "Lease Created"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {step === "details" && "Customize your lease terms"}
              {step === "review" && "Confirm all details before submission"}
              {step === "confirm" && "Your lease is now active"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded transition-all"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === "details" && (
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-slate-800/30 border border-blue-500/10 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">
                  Selected Package
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Provider</p>
                    <p className="text-blue-300 font-semibold">{packageData.provider}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Reputation</p>
                    <p className="text-blue-300 font-semibold">{packageData.reputation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Base Duration</p>
                    <p className="text-blue-300 font-semibold">{packageData.duration} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Available</p>
                    <p className="text-blue-300 font-semibold">{packageData.available}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 rounded transition-all"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 bg-slate-900/50 border border-blue-500/20 rounded px-3 py-2 text-center text-slate-200 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-300 rounded transition-all"
                  >
                    +
                  </button>
                  <span className="text-sm text-slate-400">
                    = {(packageData.computeAmount * quantity).toLocaleString()} compute units
                  </span>
                </div>
              </div>

              {/* Duration Customization */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Lease Duration
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {[7, 14, 30, 60, 90].map((days) => (
                      <button
                        key={days}
                        onClick={() => setCustomDuration(days)}
                        className={`px-4 py-2 rounded transition-all text-sm font-medium ${
                          customDuration === days
                            ? "bg-blue-600/40 border border-blue-500/50 text-blue-300"
                            : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 text-slate-400"
                        }`}
                      >
                        {days}d
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="1"
                      max="365"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                    />
                    <input
                      type="number"
                      value={customDuration}
                      onChange={(e) => setCustomDuration(Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-slate-900/50 border border-blue-500/20 rounded px-2 py-1 text-slate-200 text-sm text-center"
                    />
                    <span className="text-sm text-slate-400">days</span>
                  </div>
                </div>
              </div>

              {/* Cost Preview */}
              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Cost Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Cost:</span>
                    <span className="text-slate-200">
                      {packageData.costCC} CC × {quantity} qty
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Duration Factor:</span>
                    <span className="text-slate-200">
                      {(customDuration / packageData.duration).toFixed(2)}x
                    </span>
                  </div>
                  <div className="border-t border-slate-600 pt-2 flex justify-between">
                    <span className="font-semibold text-slate-300">Total Cost:</span>
                    <span className="text-emerald-300 font-bold text-lg">
                      {Math.ceil(totalCCWithDuration)} CC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    ≈ ${(Math.ceil(totalCCWithDuration) * 0.001).toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              {/* Review Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Provider</p>
                    <p className="text-blue-300 font-semibold">{packageData.provider}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">Reputation</p>
                    <p className="text-blue-300 font-semibold">{packageData.reputation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <p className="text-xs text-slate-500">Compute Units</p>
                    <p className="text-emerald-300 font-bold text-xl">
                      {totalComputeAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <p className="text-xs text-slate-500">Duration</p>
                    <p className="text-blue-300 font-bold text-xl">{customDuration}</p>
                    <p className="text-xs text-slate-500">days</p>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-500/10">
                    <p className="text-xs text-slate-500">Total Cost</p>
                    <p className="text-yellow-300 font-bold text-xl">
                      {Math.ceil(totalCCWithDuration)}
                    </p>
                    <p className="text-xs text-slate-500">CC</p>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-300">Lease Terms</h4>
                    <ul className="text-xs text-slate-400 mt-2 space-y-1">
                      <li>• Lease duration is non-refundable</li>
                      <li>• Compute units are reserved and cannot be transferred</li>
                      <li>• Available units: {packageData.available}</li>
                      <li>• Payment must be settled upon lease creation</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-blue-500 cursor-pointer"
                />
                <span className="text-sm text-slate-400">
                  I understand and agree to the lease terms and conditions. I authorize the
                  deduction of <span className="text-emerald-300 font-semibold">{Math.ceil(totalCCWithDuration)} CC</span>{" "}
                  from my account.
                </span>
              </label>
            </div>
          )}

          {step === "confirm" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-4 flex items-center justify-center w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-emerald-300 mb-2">Lease Created!</h3>
              <p className="text-center text-slate-400 mb-6">
                Your lease for {totalComputeAmount.toLocaleString()} compute units is now active.
              </p>
              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-400">Lease ID:</span>
                  <span className="text-slate-200 font-mono">LEASE-{Date.now()}</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-400">Duration:</span>
                  <span className="text-slate-200">{customDuration} days</span>
                </div>
                <div className="flex justify-between p-3 bg-slate-800/30 rounded">
                  <span className="text-slate-400">Cost:</span>
                  <span className="text-emerald-300 font-semibold">
                    {Math.ceil(totalCCWithDuration)} CC
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-blue-500/10 px-6 py-4 flex gap-3 justify-end bg-slate-950/50">
          {step === "confirm" ? (
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  if (step === "review") setStep("details");
                  else onClose();
                }}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50"
              >
                {step === "review" ? "Back" : "Cancel"}
              </Button>
              <Button
                onClick={() => {
                  if (step === "details") setStep("review");
                  else if (step === "review") handleCreateLease();
                }}
                disabled={isPending || (step === "review" && !agreedToTerms)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating..." : step === "details" ? "Review" : "Create Lease"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
