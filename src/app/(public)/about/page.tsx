import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { SectionWrapper } from "@/components/home/section-wrapper";

const tabsData = [
    {
        id: "story",
        label: "Story",
        paragraphs: [
            "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands. Whether it's a personal gift or a time-sensitive business shipment — we deliver on time, every time.",
            "Our journey began when we recognized a critical gap in Bangladesh's parcel delivery ecosystem. Traditional logistics solutions were fragmented, opaque, and unreliable. We saw an opportunity to build something different—a platform that puts customers at the center and leverages technology to solve real-world delivery challenges.",
            "Today, NexDrop serves countless businesses and individuals across the nation. Our scalable infrastructure, dedicated rider network, and obsessive focus on customer satisfaction have established us as the go-to choice for reliable, affordable parcel delivery.",
        ],
    },
    {
        id: "mission",
        label: "Mission",
        paragraphs: [
            "Our mission is to revolutionize parcel delivery by providing fast, reliable, and affordable logistics solutions that connect businesses and customers seamlessly. We believe every delivery should be tracked, transparent, and on time. By combining cutting-edge technology with dedicated service, we're building the future of logistics in Bangladesh.",
            "We are driven by a simple belief: parcel delivery should be stress-free and predictable. Traditional systems often leave customers in the dark, wondering where their packages are and when they'll arrive. NexDrop changes this by offering real-time visibility, professional handling, and guaranteed satisfaction.",
            "Our commitment extends beyond individual deliveries. We aim to empower small businesses by providing them with enterprise-grade logistics infrastructure at affordable prices, enabling them to compete on a level playing field with larger merchants. This democratization of logistics is at the heart of our mission.",
        ],
    },
    {
        id: "success",
        label: "Success",
        paragraphs: [
            "Our success is measured by the trust our customers place in us every single day. With a 98% on-time delivery rate and 4.9/5 average customer rating, NexDrop has become the preferred choice for thousands. These metrics aren't just numbers—they represent the countless stories of satisfied customers and successful deliveries.",
            "Since our inception, we've successfully completed over 50,000 deliveries across Bangladesh. From personal packages to bulk merchant shipments, we've built a reputation for reliability, safety, and professionalism. Our network of 500+ trusted merchants and growing rider community reflects the confidence the market has placed in our platform.",
            "What truly defines our success is the impact we've had on our stakeholders. Customers enjoy peace of mind, merchants achieve faster sales through reliable delivery, and riders earn fair income through our transparent rating system. This ecosystem approach to success ensures sustainable growth and mutual benefit for everyone involved.",
        ],
    },
    {
        id: "team",
        label: "Team & Others",
        paragraphs: [
            "Our team is composed of dedicated professionals passionate about logistics innovation. From tech experts building our real-time tracking platform to customer support specialists ensuring satisfaction, every member plays a crucial role in our mission. We believe that exceptional talent combined with a shared vision creates extraordinary results.",
            "We're constantly growing and looking for talented individuals who share our vision of transforming parcel delivery. Whether you're a software engineer, logistics specialist, customer service representative, or operations professional, if you're excited about solving complex problems and impacting lives, we want to hear from you.",
            "Beyond our internal team, NexDrop's success depends on our ecosystem of delivery partners, merchant partners, and community members. We foster a culture of collaboration, continuous learning, and mutual growth. Together, we're not just building a delivery service—we're building a movement toward smarter, faster, and more reliable logistics for Bangladesh.",
        ],
    },
];

export default function AboutPage() {
    return (
        <SectionWrapper>
            <div className="space-y-12 pt-0 md:pt-10 ">
                {/* Header Section - Left Aligned */}
                <div className="space-y-4">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        About Us
                    </h1>
                    <p className="max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </div>

                {/* Tabs Section - Left Aligned */}
                <div className="w-full">
                    <Tabs defaultValue="story" className="w-full">
                        {/* Tabs List - Left Aligned */}
                        <TabsList className="w-fit bg-transparent gap-6 mb-12 !justify-start" variant="line">
                            {tabsData.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    className="text-sm md:text-base font-medium transition-all duration-300 rounded-none px-0 pb-3 group-data-[variant=line]/tabs-list:data-active:after:bg-primary"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Tabs Content */}
                        <div className="min-h-96">
                            {tabsData.map((tab) => (
                                <TabsContent
                                    key={tab.id}
                                    value={tab.id}
                                    className="outline-none"
                                >
                                    <div className="space-y-6">
                                        {tab.paragraphs.map((paragraph, idx) => (
                                            <p
                                                key={idx}
                                                className="text-base md:text-lg text-muted-foreground leading-relaxed"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
                    {[
                        { number: "50K+", label: "Deliveries" },
                        { number: "98%", label: "On-Time Rate" },
                        { number: "4.9/5", label: "Rating" },
                        { number: "500+", label: "Merchants" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors duration-300"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm md:text-base text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    );
}