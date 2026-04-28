import { getUserDashboard } from "@/services/user.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardTrend } from "@/components/shared/stats-card-trend";
import { ChartBarVertical } from "@/components/shared/chart-bar-vertical";
import { ChartPie } from "@/components/shared/chart-pie";
import { ChartArea } from "@/components/shared/chart-area";
import { Package, Wallet, Clock, TrendingUp } from "lucide-react";

export default async function CustomerDashboardPage() {
  const response = await getUserDashboard();
  const { overview, barChart, pieChart } = response.data;

  // Format bar chart data for vertical chart with day names
  const barChartData = barChart.data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    spent: item.spent,
  }));

  const pieChartConfig = {
    count: {
      label: "Count",
    },
    ...Object.fromEntries(
      pieChart.data.map((item, index) => [
        item.status,
        {
          label: item.status,
          color: `var(--chart-${index + 1})`,
        },
      ])
    ),
  };

  // Format pie chart data with colors
  const pieChartData = pieChart.data.map((item) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-${item.status})`,
  }));

  const barChartConfig = {
    spent: {
      label: "Spent",
      color: "var(--color-chart-1)",
    },
  };

  // Format area chart data from stats
  const areaChartData = [
    { period: "Today", parcels: overview.todayParcels },
    { period: "This Week", parcels: overview.thisWeekParcels },
    { period: "This Month", parcels: overview.thisMonthParcels },
  ];

  const areaChartConfig = {
    parcels: {
      label: "Parcels",
      color: "var(--color-chart-2)",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Customer Dashboard</h1>
        <p className="text-muted-foreground">Overview of your parcels and spending.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardBasic
          title="Total Parcels"
          value={overview.totalParcels}
          icon={<Package className="size-4" />}
        />
        <StatsCardBasic
          title="Total Spent"
          value={`৳${overview.totalSpent.toLocaleString()}`}
          icon={<Wallet className="size-4" />}
        />
        <StatsCardBasic
          title="Active Parcels"
          value={overview.activeParcels}
          icon={<Package className="size-4" />}
        />
        <StatsCardBasic
          title="Delivered Parcels"
          value={overview.deliveredParcels}
          icon={<Package className="size-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardTrend
          title="Today's Parcels"
          value={overview.todayParcels}
          trend={{ value: "Today", direction: "neutral" }}
          icon={<Package className="size-4" />}
        />
        <StatsCardTrend
          title="This Week"
          value={overview.thisWeekParcels}
          trend={{ value: "This Week", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardTrend
          title="This Month"
          value={overview.thisMonthParcels}
          trend={{ value: "This Month", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardBasic
          title="Avg Delivery Time"
          value={`${overview.avgDeliveryTime}h`}
          icon={<Clock className="size-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
        <ChartArea
          title="Parcel Trends"
          description="Parcels over time periods"
          data={areaChartData}
          dataKey="parcels"
          xDataKey="period"
          config={areaChartConfig}
        />
        <ChartBarVertical
          title="Spending (Last 7 Days)"
          data={barChartData}
          xDataKey="date"
          config={barChartConfig}
        />
        <ChartPie
          title={pieChart.title}
          data={pieChartData}
          dataKey="count"
          nameKey="status"
          config={pieChartConfig}
          showLabel
        />
      </div>

    </div>
  );
}
