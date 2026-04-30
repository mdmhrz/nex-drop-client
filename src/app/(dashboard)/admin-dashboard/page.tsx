import { getAdminDashboard } from "@/services/admin.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardTrend } from "@/components/shared/stats-card-trend";
import { ChartArea } from "@/components/shared/chart-area";
import { ChartPie } from "@/components/shared/chart-pie";
import { Package, Users, DollarSign, TrendingUp, Clock, Wallet, UserCheck } from "lucide-react";

export default async function AdminDashboardPage() {
  const response = await getAdminDashboard();
  const { overview, revenue, riders, performance, financial, growth } = response.data;

  // Format revenue data for area chart
  const revenueChartData = [
    { period: "Daily", revenue: revenue.dailyRevenue },
    { period: "Weekly", revenue: revenue.weeklyRevenue },
    { period: "Monthly", revenue: revenue.monthlyRevenue },
  ];

  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "var(--color-chart-1)",
    },
  };

  // Format growth data for area chart
  const growthChartData = [
    { period: "Today", users: growth.newUsersToday },
    { period: "This Week", users: growth.newUsersThisWeek },
    { period: "This Month", users: growth.newUsersThisMonth },
  ];

  const growthChartConfig = {
    users: {
      label: "New Users",
      color: "var(--color-chart-2)",
    },
  };

  // Format pie chart data for parcel status distribution
  const parcelStatusData = [
    { status: "Completed", count: overview.totalCompletedParcels },
    { status: "Pending", count: overview.totalPendingParcels },
  ];

  const parcelStatusConfig = {
    count: {
      label: "Count",
    },
    completed: {
      label: "Completed",
      color: "var(--color-chart-3)",
    },
    pending: {
      label: "Pending",
      color: "var(--color-chart-4)",
    },
  };

  const parcelStatusChartData = parcelStatusData.map((item, index) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-chart-${index + 3})`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-heading-text text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform metrics and analytics.</p>
      </div>

      {/* Overview Stats */}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardTrend
          title="Active Riders"
          value={riders.activeRiders}
          trend={{ value: `${riders.onlineRiders} Online`, direction: "neutral" }}
          icon={<UserCheck className="size-4" />}
        />
        <StatsCardTrend
          title="Pending Parcels"
          value={overview.totalPendingParcels}
          trend={{ value: "Needs Attention", direction: "neutral" }}
          icon={<Package className="size-4" />}
        />
        <StatsCardTrend
          title="Avg Delivery Time"
          value={`${performance.avgDeliveryTime}h`}
          trend={{ value: `${performance.deliverySuccessRate}% Success Rate`, direction: "neutral" }}
          icon={<Clock className="size-4" />}
        />
        <StatsCardBasic
          title="Pending Payouts"
          value={`৳${financial.pendingPayouts.toLocaleString()}`}
          icon={<Wallet className="size-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardTrend
          title="New Users Today"
          value={growth.newUsersToday}
          trend={{ value: "Today", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardTrend
          title="This Week"
          value={growth.newUsersThisWeek}
          trend={{ value: "This Week", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardTrend
          title="This Month"
          value={growth.newUsersThisMonth}
          trend={{ value: "This Month", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardBasic
          title="Platform Revenue"
          value={`৳${revenue.platformRevenue.toLocaleString()}`}
          icon={<DollarSign className="size-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
        <ChartArea
          title="Revenue Trends"
          description="Revenue over different time periods"
          data={revenueChartData}
          dataKey="revenue"
          xDataKey="period"
          config={revenueChartConfig}
        />
        <ChartArea
          title="User Growth"
          description="New user registrations over time"
          data={growthChartData}
          dataKey="users"
          xDataKey="period"
          config={growthChartConfig}
        />
        <ChartPie
          title="Parcel Status Distribution"
          data={parcelStatusChartData}
          dataKey="count"
          nameKey="status"
          config={parcelStatusConfig}
          showLabel
        />
      </div>
    </div>
  );
}
