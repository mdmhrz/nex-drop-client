import { getUserDashboard } from "@/services/user.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardTrend } from "@/components/shared/stats-card-trend";
import { StatsCardStatus } from "@/components/shared/stats-card-status";
import { ChartBarVertical } from "@/components/shared/chart-bar-vertical";
import { ChartPie } from "@/components/shared/chart-pie";
import { ChartArea } from "@/components/shared/chart-area";
import { Package, Wallet, Clock, TrendingUp, CheckCircle, Activity } from "lucide-react";

export default async function CustomerDashboardPage() {
  const response = await getUserDashboard();
  const { overview, barChart, pieChart } = response.data;

  // --- Health statuses ---
  const deliveryRate =
    overview.totalParcels > 0
      ? Math.round((overview.deliveredParcels / overview.totalParcels) * 100)
      : 0;
  const deliveryRateStatus =
    deliveryRate >= 80 ? "within" : deliveryRate >= 50 ? "observe" : "exceed";

  const deliveryTimeStatus =
    overview.avgDeliveryTime <= 24 ? "within" : overview.avgDeliveryTime <= 48 ? "observe" : "exceed";

  // --- Chart data ---
  const barChartData = barChart.data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    spent: item.spent,
  }));

  const barChartConfig = {
    spent: { label: "Spent (৳)", color: "var(--color-chart-1)" },
  };

  const pieChartConfig = {
    count: { label: "Count" },
    ...Object.fromEntries(
      pieChart.data.map((item, index) => [
        item.status,
        { label: item.status, color: `var(--color-chart-${index + 1})` },
      ])
    ),
  };

  const pieChartData = pieChart.data.map((item, index) => ({
    status: item.status,
    count: item.count,
    fill: `var(--color-chart-${index + 1})`,
  }));

  const areaChartData = [
    { period: "Today", parcels: overview.todayParcels },
    { period: "This Week", parcels: overview.thisWeekParcels },
    { period: "This Month", parcels: overview.thisMonthParcels },
  ];

  const areaChartConfig = {
    parcels: { label: "Parcels", color: "var(--color-chart-2)" },
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-heading-text text-2xl font-bold tracking-tight">Customer Dashboard</h1>
        <p className="text-muted-foreground">Overview of your parcels and spending.</p>
      </div>

      {/* Section 1 — Account Summary */}
      <section className="space-y-3">
        <SectionHeader title="Account Summary" />
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
            icon={<Activity className="size-4" />}
          />
          <StatsCardBasic
            title="Delivered Parcels"
            value={overview.deliveredParcels}
            icon={<CheckCircle className="size-4" />}
          />
        </div>
      </section>

      {/* Section 2 — Delivery Insights */}
      <section className="space-y-3">
        <SectionHeader title="Delivery Insights" />
        <div className="grid gap-4 md:grid-cols-2">
          <StatsCardStatus
            title="Delivery Success Rate"
            value={`${deliveryRate}%`}
            status={deliveryRateStatus}
            range={`${overview.deliveredParcels} of ${overview.totalParcels} parcels delivered`}
            icon={<CheckCircle className="size-4" />}
          />
          <StatsCardStatus
            title="Avg Delivery Time"
            value={`${Number(overview.avgDeliveryTime).toFixed(2)}h`}
            status={deliveryTimeStatus}
            range={deliveryTimeStatus === "within" ? "Within 24h — great" : deliveryTimeStatus === "observe" ? "24–48h — acceptable" : "Over 48h — slow"}
            icon={<Clock className="size-4" />}
          />
        </div>
      </section>

      {/* Section 3 — Recent Activity */}
      <section className="space-y-3">
        <SectionHeader title="Recent Activity" />
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCardTrend
            title="Today's Parcels"
            value={overview.todayParcels}
            trend={{ value: "Sent today", direction: "up" }}
            icon={<Package className="size-4" />}
          />
          <StatsCardTrend
            title="This Week"
            value={overview.thisWeekParcels}
            trend={{ value: "Past 7 days", direction: "up" }}
            icon={<TrendingUp className="size-4" />}
          />
          <StatsCardTrend
            title="This Month"
            value={overview.thisMonthParcels}
            trend={{ value: "Past 30 days", direction: "up" }}
            icon={<TrendingUp className="size-4" />}
          />
        </div>
      </section>

      {/* Section 4 — Charts */}
      <section className="space-y-3">
        <SectionHeader title="Visual Analytics" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-100">
          <ChartArea
            title="Parcel Activity Trend"
            description="Parcels across time periods"
            data={areaChartData}
            dataKey="parcels"
            xDataKey="period"
            config={areaChartConfig}
          />
          <ChartBarVertical
            title="Spending — Last 7 Days"
            description="Daily spend in BDT"
            data={barChartData}
            xDataKey="date"
            dataKeys={["spent"]}
            config={barChartConfig}
          />
          <ChartPie
            title={pieChart.title}
            description="Breakdown by parcel status"
            data={pieChartData}
            dataKey="count"
            nameKey="status"
            config={pieChartConfig}
            showLabel
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


