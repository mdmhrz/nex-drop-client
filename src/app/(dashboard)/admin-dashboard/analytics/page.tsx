import { getAdminRevenueAnalytics } from "@/services/admin.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { ChartBarVertical } from "@/components/shared/chart-bar-vertical";
import { ChartPie } from "@/components/shared/chart-pie";
import { ChartArea } from "@/components/shared/chart-area";
import { DollarSign, CreditCard, TrendingUp } from "lucide-react";

export default async function AdminAnalyticsPage() {
    const response = await getAdminRevenueAnalytics();
    const { summary, byPaymentMethod, byDistrict, overTime } = response.data;

    // Format payment method data for pie chart
    const paymentMethodConfig = {
        totalRevenue: {
            label: "Revenue",
        },
        ...Object.fromEntries(
            byPaymentMethod.map((item, index) => [
                item.paymentMethod,
                {
                    label: item.paymentMethod,
                    color: `var(--chart-${index + 1})`,
                },
            ])
        ),
    };

    const paymentMethodChartData = byPaymentMethod.map((item) => ({
        paymentMethod: item.paymentMethod,
        totalRevenue: item.totalRevenue,
        paymentCount: item.paymentCount,
        fill: `var(--color-${item.paymentMethod})`,
    }));

    // Format district data for bar chart
    const districtChartData = byDistrict.map((item) => ({
        district: item.district,
        revenue: item.totalRevenue,
        parcelCount: item.parcelCount,
    }));

    const districtChartConfig = {
        revenue: {
            label: "Revenue",
            color: "var(--color-chart-1)",
        },
        parcelCount: {
            label: "Parcels",
            color: "var(--color-chart-2)",
        },
    };

    // Format time series data for area chart
    const timeSeriesChartData = overTime.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: item.revenue,
        paymentCount: item.paymentCount,
    }));

    const timeSeriesConfig = {
        revenue: {
            label: "Revenue",
            color: "var(--color-chart-3)",
        },
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Revenue Analytics</h1>
                <p className="text-muted-foreground">Detailed revenue breakdown and analytics.</p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCardBasic
                    title="Total Revenue"
                    value={`৳${summary.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="size-4" />}
                />
                <StatsCardBasic
                    title="Total Payments"
                    value={summary.totalPayments}
                    icon={<CreditCard className="size-4" />}
                />
                <StatsCardBasic
                    title="Average Order Value"
                    value={`৳${summary.averageOrderValue.toFixed(2)}`}
                    icon={<TrendingUp className="size-4" />}
                />
                <StatsCardBasic
                    title="Currency"
                    value={summary.currency}
                    icon={<DollarSign className="size-4" />}
                />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
                <ChartPie
                    title="Revenue by Payment Method"
                    data={paymentMethodChartData}
                    dataKey="totalRevenue"
                    nameKey="paymentMethod"
                    config={paymentMethodConfig}
                    showLabel
                />
                <ChartBarVertical
                    title="Revenue by District"
                    data={districtChartData}
                    xDataKey="district"
                    config={districtChartConfig}
                />
                <ChartArea
                    title="Revenue Over Time"
                    data={timeSeriesChartData}
                    dataKey="revenue"
                    xDataKey="date"
                    config={timeSeriesConfig}
                    className="lg:col-span-1"
                />
            </div>
        </div>
    );
}
