import { getRiderDashboard } from "@/services/rider.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardTrend } from "@/components/shared/stats-card-trend";
import { StatsCardStatus } from "@/components/shared/stats-card-status";
import { ChartArea } from "@/components/shared/chart-area";
import { ChartPie } from "@/components/shared/chart-pie";
import { Package, Star, Clock, Wallet, TrendingUp } from "lucide-react";

export default async function RiderDashboardPage() {
  const response = await getRiderDashboard();
  const { overview, barChart, pieChart } = response.data;

  // Format bar chart data for horizontal chart
  const areaChartData = barChart.data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    earnings: item.earnings,
    deliveries: item.deliveries,
  }));

  // Format pie chart data with colors
  const pieChartData = pieChart.data.map((item, index) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-chart-${index + 1})`,
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
          color: `var(--color-chart-${index + 1})`,
        },
      ])
    ),
  };

  const earningsConfig = {
    earnings: {
      label: "Earnings",
      color: "var(--color-chart-1)",
    },
  };

  const deliveriesConfig = {
    deliveries: {
      label: "Deliveries",
      color: "var(--color-chart-2)",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rider Dashboard</h1>
        <p className="text-muted-foreground">Overview of your delivery performance and earnings.</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardBasic
          title="Total Deliveries"
          value={overview.totalDeliveries}
          icon={<Package className="size-4" />}
        />
        <StatsCardBasic
          title="Total Earnings"
          value={`৳${overview.totalEarnings.toLocaleString()}`}
          icon={<Wallet className="size-4" />}
        />
        <StatsCardBasic
          title="Rating"
          value={overview.rating.toFixed(1)}
          icon={<Star className="size-4 fill-yellow-400 text-yellow-400" />}
        />
        <StatsCardBasic
          title="Avg Delivery Time"
          value={`${overview.avgDeliveryTime}h`}
          icon={<Clock className="size-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCardTrend
          title="Today's Deliveries"
          value={overview.todayDeliveries}
          trend={{ value: "Today", direction: "neutral" }}
          icon={<Package className="size-4" />}
        />
        <StatsCardTrend
          title="This Week"
          value={overview.thisWeekDeliveries}
          trend={{ value: "This Week", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardTrend
          title="This Month"
          value={overview.thisMonthDeliveries}
          trend={{ value: "This Month", direction: "neutral" }}
          icon={<TrendingUp className="size-4" />}
        />
        <StatsCardBasic
          title="Available Earnings"
          value={`৳${overview.availableEarnings.toLocaleString()}`}
          icon={<Wallet className="size-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ChartArea
          title="Earnings (Last 7 Days)"
          data={areaChartData}
          dataKey="earnings"
          xDataKey="date"
          config={earningsConfig}
          className="lg:col-span-2"
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
