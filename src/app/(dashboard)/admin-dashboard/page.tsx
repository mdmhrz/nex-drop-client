import { getAdminDashboard } from "@/services/admin.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardTrend } from "@/components/shared/stats-card-trend";
import { StatsCardStatus } from "@/components/shared/stats-card-status";
import { ChartPie } from "@/components/shared/chart-pie";
import { ChartBarVertical } from "@/components/shared/chart-bar-vertical";
import { ChartArea } from "@/components/shared/chart-area";
import { Package, Users, DollarSign, TrendingUp, Clock, Wallet, UserCheck, AlertCircle, LogIn, Activity, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboardPage() {
  let response;

  try {
    response = await getAdminDashboard();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard data';
    const is401Error = errorMessage.includes('401');

    console.error('Dashboard error:', errorMessage);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="section-heading-text text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of platform metrics and analytics.</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="space-y-3 flex flex-col">
            <span>
              {is401Error
                ? 'Your session has expired or you are not authorized to access this dashboard. Please log in again.'
                : `Unable to load dashboard data: ${errorMessage}. Please refresh the page or try again later.`
              }
            </span>
            {is401Error && (
              <Button asChild size="sm" className="w-fit gap-2">
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Go to Login
                </Link>
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { overview, revenue, riders, performance, financial, growth } = response.data;

  // --- Operational health statuses ---
  const ridersStatus =
    riders.activeRiders / Math.max(overview.totalRiders, 1) > 0.7
      ? "within"
      : riders.activeRiders > 0
        ? "observe"
        : "exceed";

  const pendingParcelStatus =
    overview.totalPendingParcels > 50 ? "exceed" : overview.totalPendingParcels > 20 ? "observe" : "within";

  const deliveryStatus =
    performance.deliverySuccessRate >= 80 ? "within" : performance.deliverySuccessRate >= 60 ? "observe" : "exceed";

  const payoutStatus =
    financial.pendingPayouts > 100000 ? "exceed" : financial.pendingPayouts > 50000 ? "observe" : "within";

  // --- Financial health ---
  const platformRevenueRatio =
    revenue.totalRevenue > 0 ? ((revenue.platformRevenue / revenue.totalRevenue) * 100).toFixed(1) : "0";
  const riderPayoutRatio =
    revenue.totalRevenue > 0 ? ((financial.riderPayouts / revenue.totalRevenue) * 100).toFixed(1) : "0";
  const riderPayoutHealthStatus = parseFloat(riderPayoutRatio) > 70 ? "observe" : "within";

  // --- Revenue trend directions ---
  const weeklyVsDaily =
    revenue.dailyRevenue > 0 ? (revenue.weeklyRevenue / revenue.dailyRevenue).toFixed(1) : "—";
  const monthlyVsDaily =
    revenue.dailyRevenue > 0 ? (revenue.monthlyRevenue / revenue.dailyRevenue).toFixed(0) : "—";
  const aovDirection = revenue.avgOrderValue >= 500 ? ("up" as const) : ("down" as const);

  // --- Chart data ---
  const parcelStatusChartData = [
    { status: "Completed", count: overview.totalCompletedParcels, fill: "var(--color-chart-1)" },
    { status: "Pending", count: overview.totalPendingParcels, fill: "var(--color-chart-2)" },
  ];

  const parcelStatusConfig = {
    count: { label: "Count" },
    Completed: { label: "Completed", color: "var(--color-chart-1)" },
    Pending: { label: "Pending", color: "var(--color-chart-2)" },
  };

  const revenueComparisonData = [
    { period: "Daily", amount: revenue.dailyRevenue },
    { period: "Weekly", amount: revenue.weeklyRevenue },
    { period: "Monthly", amount: revenue.monthlyRevenue },
  ];

  const revenueComparisonConfig = {
    amount: { label: "Revenue (৳)", color: "var(--color-chart-1)" },
  };

  const growthChartData = [
    { period: "Today", users: growth.newUsersToday },
    { period: "This Week", users: growth.newUsersThisWeek },
    { period: "This Month", users: growth.newUsersThisMonth },
  ];

  const growthConfig = {
    users: { label: "New Users", color: "var(--color-chart-2)" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-heading-text text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform metrics and analytics.</p>
      </div>

      {/* Section 1 — Platform Overview */}
      <section className="space-y-3">
        <SectionHeader title="Platform Overview" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardBasic
            title="Total Parcels"
            value={overview.totalParcels}
            icon={<Package className="size-4" />}
          />
          <StatsCardBasic
            title="Total Users"
            value={overview.totalUsers}
            icon={<Users className="size-4" />}
          />
          <StatsCardBasic
            title="Total Riders"
            value={overview.totalRiders}
            icon={<UserCheck className="size-4" />}
          />
          <StatsCardBasic
            title="Total Revenue"
            value={`৳${revenue.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="size-4" />}
          />
        </div>
      </section>

      {/* Section 2 — Operational Health */}
      <section className="space-y-3">
        <SectionHeader title="Operational Health" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardStatus
            title="Active Riders"
            value={riders.activeRiders}
            status={ridersStatus}
            range={`${riders.onlineRiders} online now`}
            icon={<UserCheck className="size-4" />}
          />
          <StatsCardStatus
            title="Pending Parcels"
            value={overview.totalPendingParcels}
            status={pendingParcelStatus}
            range={pendingParcelStatus === "within" ? "All clear" : "Needs attention"}
            icon={<Package className="size-4" />}
          />
          <StatsCardStatus
            title="Delivery Success Rate"
            value={`${performance.deliverySuccessRate}%`}
            status={deliveryStatus}
            range={`Avg ${performance.avgDeliveryTime.toFixed(2)}h per order`}
            icon={<Clock className="size-4" />}
          />
          <StatsCardStatus
            title="Pending Payouts"
            value={`৳${financial.pendingPayouts.toLocaleString()}`}
            status={payoutStatus}
            range={payoutStatus === "within" ? "Within threshold" : "Above threshold"}
            icon={<Wallet className="size-4" />}
          />
        </div>
      </section>

      {/* Section 3 — Revenue */}
      <section className="space-y-3">
        <SectionHeader title="Revenue Breakdown" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCardTrend
            title="Daily Revenue"
            value={`৳${revenue.dailyRevenue.toLocaleString()}`}
            trend={{ value: "Today's collection", direction: "neutral" }}
            icon={<DollarSign className="size-4" />}
          />
          <StatsCardTrend
            title="Weekly Revenue"
            value={`৳${revenue.weeklyRevenue.toLocaleString()}`}
            trend={{ value: `${weeklyVsDaily}× daily avg`, direction: "up" }}
            icon={<TrendingUp className="size-4" />}
          />
          <StatsCardTrend
            title="Monthly Revenue"
            value={`৳${revenue.monthlyRevenue.toLocaleString()}`}
            trend={{ value: `${monthlyVsDaily}× daily avg`, direction: "up" }}
            icon={<BarChart3 className="size-4" />}
          />
          <StatsCardTrend
            title="Avg Order Value"
            value={`৳${revenue.avgOrderValue.toFixed(0)}`}
            trend={{ value: aovDirection === "up" ? "Above target" : "Below target", direction: aovDirection }}
            icon={<Activity className="size-4" />}
          />
        </div>
      </section>

      {/* Section 4 — Financial Health */}
      <section className="space-y-3">
        <SectionHeader title="Financial Health" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCardStatus
            title="Platform Revenue Share"
            value={`৳${revenue.platformRevenue.toLocaleString()}`}
            status="within"
            range={`${platformRevenueRatio}% of total revenue`}
            icon={<DollarSign className="size-4" />}
          />
          <StatsCardStatus
            title="Rider Payouts"
            value={`৳${financial.riderPayouts.toLocaleString()}`}
            status={riderPayoutHealthStatus}
            range={`${riderPayoutRatio}% of total revenue`}
            icon={<Wallet className="size-4" />}
          />
          <StatsCardStatus
            title="Outstanding Payouts"
            value={`৳${financial.pendingPayouts.toLocaleString()}`}
            status={payoutStatus}
            range={payoutStatus === "exceed" ? "High — needs review" : payoutStatus === "observe" ? "Elevated — monitor" : "Normal range"}
            icon={<AlertCircle className="size-4" />}
          />
        </div>
      </section>

      {/* Section 5 — User Growth */}
      <section className="space-y-3">
        <SectionHeader title="User Growth" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCardTrend
            title="New Users Today"
            value={growth.newUsersToday}
            trend={{ value: "Registered today", direction: "up" }}
            icon={<Users className="size-4" />}
          />
          <StatsCardTrend
            title="New Users This Week"
            value={growth.newUsersThisWeek}
            trend={{ value: "Past 7 days", direction: "up" }}
            icon={<TrendingUp className="size-4" />}
          />
          <StatsCardTrend
            title="New Users This Month"
            value={growth.newUsersThisMonth}
            trend={{ value: "Past 30 days", direction: "up" }}
            icon={<BarChart3 className="size-4" />}
          />
        </div>
      </section>

      {/* Section 6 — Charts */}
      <section className="space-y-3">
        <SectionHeader title="Visual Analytics" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-100">
          <ChartPie
            title="Parcel Status Distribution"
            description="Completed vs Pending parcels"
            data={parcelStatusChartData}
            dataKey="count"
            nameKey="status"
            config={parcelStatusConfig}
            showLabel
          />
          <ChartBarVertical
            title="Revenue by Period"
            description="Daily, weekly and monthly comparison"
            data={revenueComparisonData}
            xDataKey="period"
            dataKeys={["amount"]}
            config={revenueComparisonConfig}
            showLegend={false}
          />
          <ChartArea
            title="User Growth Trend"
            description="New registrations over time"
            data={growthChartData}
            dataKey="users"
            xDataKey="period"
            config={growthConfig}
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
