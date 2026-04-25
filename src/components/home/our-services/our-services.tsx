
import { Truck, Globe, Warehouse, DollarSign, Building2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/home/section-header";
import { SectionWrapper } from "@/components/home/section-wrapper";

const services = [
    {
        id: 1,
        icon: Truck,
        title: "Express & Standard Delivery",
        description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    },
    {
        id: 2,
        icon: Globe,
        title: "Nationwide Delivery",
        description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    },
    {
        id: 3,
        icon: Warehouse,
        title: "Fulfillment Solution",
        description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    },
    {
        id: 4,
        icon: DollarSign,
        title: "Cash on Home Delivery",
        description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
    },
    {
        id: 5,
        icon: Building2,
        title: "Corporate Service / Contract In Logistics",
        description: "Customized corporate services which includes warehouse and inventory management support.",
    },
    {
        id: 6,
        icon: RotateCcw,
        title: "Parcel Return",
        description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
    },
];

export function OurServices() {
    return (
        <SectionWrapper hasPadding={false} topPadding={false}>

            <div className="bg-[#03373D] rounded-lg p-6 md:p-10 lg:p-16">
                {/* Section Header */}
                <SectionHeader
                    title="Our Services"
                    description="We provide comprehensive and reliable delivery solutions tailored to your business and customer needs."
                    highlightWord="Services"
                />

                {/* Services Grid */}
                <div className="mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
                    {services.map((service) => {
                        const Icon = service.icon;
                        return (
                            <Card
                                key={service.id}
                                className="group dark:border dark:border-border bg-card/50 backdrop-blur-sm p-4 text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:bg-card sm:p-5 overflow-hidden cursor-pointer h-full flex flex-col"
                            >
                                {/* Icon */}
                                <div className="flex items-center justify-center mb-3">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-center text-base font-semibold text-foreground sm:text-lg">
                                    {service.title}
                                </h3>

                                {/* Divider */}
                                <div className="my-2 h-0.5 w-8 bg-primary mx-auto" />

                                {/* Description */}
                                <p className="text-center text-sm leading-relaxed text-muted-foreground grow">
                                    {service.description}
                                </p>

                                {/* Bottom accent line */}
                                <div className="mx-auto h-1 w-0 bg-primary transition-all duration-300 group-hover:w-12 mt-3" />
                            </Card>
                        );
                    })}
                </div>
            </div>
        </SectionWrapper>
    );
}
