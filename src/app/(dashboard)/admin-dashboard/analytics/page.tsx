import { getAdminRevenueAnalytics } from "@/services/admin.server";
import { StatsCardBasic } from "@/components/shared/stats-card-basic";
import { StatsCardStatus } from "@/components/shared/stats-card-status";
import { ChartBarVertical } from "@/components/shared/chart-bar-vertical";
import { ChartPie } from "@/components/shared/chart-pie";
import { ChartArea } from "@/components/shared/chart-area";
import { DollarSign, CreditCard, TrendingUp, AlertCircle, LogIn, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
    let response;

    try {
        response = await getAdminRevenueAnalytics();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';
        const is401Error = errorMessage.includes('401');

        console.error('Analytics error:', errorMessage);

        return (
            <div className="space-y-6">
                <div>
                    <h1 className="section-heading-text text-2xl font-bold tracking-tight">Revenue Analytics</h1>
                    <p className="text-muted-foreground">Detailed revenue breakdown and analytics.</p>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="space-y-3 flex flex-col">
                        <span>
                            {is401Error
                                ? 'Your session has expired or you are not authorized to access this analytics. Please log in again.'
                                : `Unable to load analytics data: ${errorMessage}. Please refresh the page or try again later.`
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

    const { summary, byPaymentMethod, byDistrict, overTime } = response.data;

    // --- Health statuses ---
    const aovStatus =
        summary.averageOrderValue >= 600 ? "within" : summary.averageOrderValue >= 400 ? "observe" : "exceed";

    const topDistrict = byDistrict.reduce(
        (max, d) => (d.totalRevenue > max.totalRevenue ? d : max),
        byDistrict[0] ?? { district: "N/A", totalRevenue: 0, parcelCount: 0 }
    );

    // --- Chart data ---
    const paymentMethodConfig = {
        totalRevenue: { label: "Revenue" },
        ...Object.fromEntries(
            byPaymentMethod.map((item, index) => [
                item.paymentMethod,
                { label: item.paymentMethod, color: `var(--color-chart-${index + 1})` },
            ])
        ),
    };

    const paymentMethodChartData = byPaymentMethod.map((item, index) => ({
        paymentMethod: item.paymentMethod,
        totalRevenue: item.totalRevenue,
        paymentCount: item.paymentCount,
        fill: `var(--color-chart-${index + 1})`,
    }));

    const districtChartData = byDistrict.map((item) => ({
        district: item.district,
        revenue: item.totalRevenue,
        parcelCount: item.parcelCount,
    }));

    const districtChartConfig = {
        revenue: { label: "Revenue", color: "var(--color-chart-1)" },
        parcelCount: { label: "Parcels", color: "var(--color-chart-2)" },
    };

    const timeSeriesChartData = overTime.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        revenue: item.revenue,
        paymentCount: item.paymentCount,
    }));

    const timeSeriesConfig = {
        revenue: { label: "Revenue", color: "var(--color-chart-3)" },
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="section-heading-text text-2xl font-bold tracking-tight">Revenue Analytics</h1>
                <p className="text-muted-foreground">Detailed revenue breakdown and analytics.</p>
            </div>

            {/* Section 1 — Revenue Summary */}
            <section className="space-y-3">
                <SectionHeader title="Revenue Summary" />
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
                    <StatsCardStatus
                        title="Avg Order Value"
                        value={`৳${summary.averageOrderValue.toFixed(0)}`}
                        status={aovStatus}
                        range={aovStatus === "within" ? "Above ৳600 target" : aovStatus === "observe" ? "৳400–৳600 range" : "Below ৳400 — low"}
                        icon={<TrendingUp className="size-4" />}
                    />
                    <StatsCardStatus
                        title="Top District"
                        value={topDistrict.district}
                        status="within"
                        range={`৳${topDistrict.totalRevenue.toLocaleString()} · ${topDistrict.parcelCount} parcels`}
                        icon={<Activity className="size-4" />}
                    />
                </div>
            </section>

            {/* Section 2 — Visual Breakdown */}
            <section className="space-y-3">
                <SectionHeader title="Visual Breakdown" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 min-h-100">
                    <ChartPie
                        title="Revenue by Payment Method"
                        description="Share of each payment type"
                        data={paymentMethodChartData}
                        dataKey="totalRevenue"
                        nameKey="paymentMethod"
                        config={paymentMethodConfig}
                        showLabel
                    />
                    <ChartBarVertical
                        title="Revenue by District"
                        description="Revenue and parcel count per district"
                        data={districtChartData}
                        xDataKey="district"
                        dataKeys={["revenue", "parcelCount"]}
                        config={districtChartConfig}
                        showLegend={true}
                    />
                    <ChartArea
                        title="Revenue Over Time"
                        description="Daily revenue trend"
                        data={timeSeriesChartData}
                        dataKey="revenue"
                        xDataKey="date"
                        config={timeSeriesConfig}
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

