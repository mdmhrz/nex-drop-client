import { getCurrentUser } from "@/lib/auth";
import { BeARiderForm } from "@/components/home/be-a-rider/be-a-rider-form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import {
    Bike,
    ShieldCheck,
    Star,
    Wallet,
    Clock,
    MapPin,
    TrendingUp,
    Users,
    PackageCheck,
    ChevronDown,
    ArrowRight,
} from "lucide-react";

const stats = [
    { value: "500+", label: "Active Riders" },
    { value: "50K+", label: "Deliveries Done" },
    { value: "4.9★", label: "Average Rating" },
    { value: "64", label: "Districts Covered" },
];

const perks = [
    {
        icon: Wallet,
        title: "Competitive Earnings",
        description: "Transparent per-parcel rates with weekly payouts directly to your account.",
    },
    {
        icon: Clock,
        title: "Flexible Hours",
        description: "Go online when you want. Work around your schedule, not ours.",
    },
    {
        icon: MapPin,
        title: "Local Routes",
        description: "Deliver within your own district — no long hauls, no surprises.",
    },
    {
        icon: Star,
        title: "Performance Bonuses",
        description: "Top-rated riders earn bonus incentives and priority parcel assignments.",
    },
    {
        icon: ShieldCheck,
        title: "Insured Deliveries",
        description: "Every parcel is insured so you ride with full peace of mind.",
    },
    {
        icon: TrendingUp,
        title: "Career Growth",
        description: "Unlock senior rider status, team lead roles, and exclusive perks.",
    },
];

const steps = [
    { icon: PackageCheck, step: "01", title: "Apply", desc: "Fill out the short form below — takes under 2 minutes." },
    { icon: ShieldCheck, step: "02", title: "Get Verified", desc: "Our team reviews your application within 24 hours." },
    { icon: Bike, step: "03", title: "Start Earning", desc: "Accept parcels in your district and cash out weekly." },
];

export default async function BeARiderPage() {
    const user = await getCurrentUser();

    const isAuthenticated = !!user;
    const isAlreadyRider =
        user?.role === "RIDER" ||
        user?.role === "ADMIN" ||
        user?.role === "SUPER_ADMIN";

    return (
        <div className="w-full">
            {/* ── Hero ──────────────────────────────────────────────────── */}
            <section className="bg-[#03373D] w-full">
                <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center gap-6">
                    <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 px-3 py-1">
                        Now hiring in 64 districts
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight max-w-3xl">
                        Ride with NexDrop.<br className="hidden md:block" />
                        <span className="text-primary"> Earn on your terms.</span>
                    </h1>

                    <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
                        Join our verified rider fleet and start delivering parcels in your district.
                        Flexible, rewarding, and fully supported every step of the way.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden w-full max-w-2xl mt-4">
                        {stats.map(({ value, label }) => (
                            <div key={label} className="bg-[#03373D] flex flex-col items-center py-5 px-4">
                                <span className="text-2xl font-bold text-white">{value}</span>
                                <span className="text-xs text-white/50 mt-0.5">{label}</span>
                            </div>
                        ))}
                    </div>

                    <Button variant="ghost" size="sm" asChild className="text-white/40 hover:text-white/70 hover:bg-transparent flex flex-col h-auto gap-1 mt-2">
                        <a href="#apply">
                            <span className="text-xs">Learn more</span>
                            <ChevronDown className="h-4 w-4 animate-bounce" />
                        </a>
                    </Button>
                </div>
            </section>

            {/* ── How it works ──────────────────────────────────────────── */}
            <section className="bg-muted/30 w-full">
                <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
                    <div className="text-center space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
                        <h2 className="text-2xl md:text-3xl font-bold">Three steps to start earning</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-3">
                        {steps.map(({ icon: Icon, step, title, desc }) => (
                            <Card key={step} className="relative text-center">
                                <span className="absolute top-4 right-5 text-5xl font-black text-muted-foreground/20 select-none">{step}</span>
                                <CardContent className="flex flex-col items-center gap-4 pt-8 pb-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold">{title}</p>
                                        <p className="text-sm text-muted-foreground">{desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Perks ─────────────────────────────────────────────────── */}
            <section className="w-full">
                <div className="max-w-6xl mx-auto px-6 py-16 space-y-10">
                    <div className="text-center space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why NexDrop</p>
                        <h2 className="text-2xl md:text-3xl font-bold">Benefits built for riders</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {perks.map(({ icon: Icon, title, description }) => (
                            <Card key={title} className="transition-colors hover:bg-muted/60">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm">{title}</p>
                                        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Separator />

            {/* ── Application Form ──────────────────────────────────────── */}
            <section id="apply" className="w-full">
                <div className="max-w-6xl mx-auto px-6 py-16">
                    {isAlreadyRider ? (
                        <Card className="max-w-md mx-auto text-center">
                            <CardContent className="flex flex-col items-center gap-4 py-10">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <CardTitle>You&apos;re already on the team</CardTitle>
                                    <CardDescription>
                                        Your account already has an active role. Head to your dashboard to manage deliveries.
                                    </CardDescription>
                                </div>
                                <Button variant="link" asChild className="text-primary">
                                    <Link href={user?.role === "RIDER" ? "/rider-dashboard" : "/admin-dashboard"}>
                                        Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] items-start">
                            {/* Left: copy */}
                            <div className="space-y-6 lg:sticky lg:top-24">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Users className="h-5 w-5" />
                                        <span className="text-sm font-semibold uppercase tracking-wide">Apply Now</span>
                                    </div>
                                    <h2 className="text-3xl font-bold leading-tight">
                                        {isAuthenticated
                                            ? "One step away from riding"
                                            : "Start your rider journey today"}
                                    </h2>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {isAuthenticated
                                            ? "Just tell us your district and we'll review your application within 24 hours."
                                            : "Create your free account, submit your district, and our team will reach out within 24 hours."}
                                    </p>
                                </div>

                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {[
                                        "No experience required",
                                        "Review within 24 hours",
                                        "Start earning immediately after approval",
                                        "100% free to apply",
                                    ].map((point) => (
                                        <li key={point} className="flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right: form card */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>
                                        {isAuthenticated ? "Submit Your Application" : "Create Account & Apply"}
                                    </CardTitle>
                                    <CardDescription>
                                        {isAuthenticated
                                            ? "Enter the district you want to deliver in."
                                            : "Fill in your details — it takes less than 2 minutes."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <BeARiderForm isAuthenticated={isAuthenticated} />

                                    {!isAuthenticated && (
                                        <p className="text-center text-sm text-muted-foreground">
                                            Already have an account?{" "}
                                            <Button variant="link" asChild className="p-0 h-auto text-primary font-medium">
                                                <Link href="/login">Sign in</Link>
                                            </Button>
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}


