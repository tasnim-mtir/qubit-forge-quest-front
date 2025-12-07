import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { InvestorNavbar } from "@/components/investor/InvestorNavbar";
import { LeasingDashboardStats } from "@/components/investor/LeasingDashboardStats";
import { ActiveLeasesTable } from "@/components/investor/ActiveLeasesTable";
import { ComputeMarketplace } from "@/components/investor/ComputeMarketplace";
import { CCPriceChart } from "@/components/investor/CCPriceChart";
import { LeaseCreationModal } from "@/components/investor/LeaseCreationModal";
import { useGetUserLeases, useGetVaultStats } from "@/hooks/useProtocol";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MarketplacePackage } from "@/services/protocolAPI";

export default function InvestorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<MarketplacePackage | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data
  const { data: leaseData, isLoading: leasesLoading } = useGetUserLeases(
    user?._id || "",
    1,
    10
  );
  const { data: vaultStats } = useGetVaultStats();

  useEffect(() => {
    // Redirect if not investor
    if (!loading && user && user.role !== "investor") {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 animate-spin text-blue-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "investor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <InvestorNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Investor Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your compute leases and optimize your investment portfolio
          </p>
        </div>

        {/* Stats Section */}
        <LeasingDashboardStats leaseData={leaseData} isLoading={leasesLoading} />

        {/* Tabs */}
        <Tabs defaultValue="leases" className="mt-8">
          <TabsList className="bg-slate-900/50 border border-blue-500/20 p-1">
            <TabsTrigger value="leases">Active Leases</TabsTrigger>
            <TabsTrigger value="marketplace">Compute Marketplace</TabsTrigger>
            <TabsTrigger value="pricing">CC Pricing</TabsTrigger>
          </TabsList>

          {/* Active Leases Tab */}
          <TabsContent value="leases" className="mt-6 space-y-4">
            <div className="bg-gradient-to-b from-slate-900/30 to-slate-950/30 border border-blue-500/10 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">Your Active Leases</h2>
              <ActiveLeasesTable leases={(leaseData as any)?.leases || []} isLoading={leasesLoading} />
            </div>
          </TabsContent>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="mt-6 space-y-4">
            <div className="bg-gradient-to-b from-slate-900/30 to-slate-950/30 border border-blue-500/10 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Available Compute Packages</h2>
              <ComputeMarketplace
                onSelectPackage={(pkg) => {
                  setSelectedPackage(pkg);
                  setIsModalOpen(true);
                }}
              />
            </div>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="mt-6 space-y-4">
            <CCPriceChart height={400} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Lease Creation Modal */}
      <LeaseCreationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(undefined);
        }}
        packageData={selectedPackage}
      />
    </div>
  );
}
