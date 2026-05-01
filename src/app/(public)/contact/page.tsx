import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/contact/contact-form";

const contactDetails = [
    {
        icon: Mail,
        label: "Email",
        value: "support@nexdrop.com.bd",
        sub: "We reply within 24 hours",
    },
    {
        icon: Phone,
        label: "Phone",
        value: "+880 1700-000000",
        sub: "Sun – Thu, 9 AM – 6 PM",
    },
    {
        icon: MapPin,
        label: "Office",
        value: "12 Gulshan Avenue, Dhaka",
        sub: "Bangladesh",
    },
    {
        icon: Clock,
        label: "Support Hours",
        value: "Sunday – Thursday",
        sub: "9:00 AM – 6:00 PM BST",
    },
];

export default function ContactPage() {
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20">
            <div className="space-y-12 pt-0">
                {/* Header */}
                <div className="space-y-4">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Contact Us
                    </h1>
                    <p className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
                        Have a question, complaint, or just want to say hello? Fill out
                        the form and our team will get back to you as soon as possible.
                    </p>
                </div>

                <Separator />

                {/* Two-column layout */}
                <div className="grid gap-10 lg:grid-cols-[1fr_28rem]">
                    {/* Left: contact info cards */}
                    <div className="space-y-8">
                        <div className="grid gap-4 sm:grid-cols-2">
                            {contactDetails.map(({ icon: Icon, label, value, sub }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-4  border bg-muted/30 p-5 transition-colors hover:bg-muted/50"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            {label}
                                        </p>
                                        <p className="text-sm font-semibold text-foreground">
                                            {value}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FAQ teaser */}
                        <div className="border border-dashed bg-primary/5 dark:bg-primary/[0.07] p-6 space-y-2">
                            <h3 className="text-base font-semibold text-foreground">
                                Looking for quick answers?
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Check our Help Centre for guides on tracking parcels, rider
                                registration, merchant onboarding, and more. Most common
                                questions are answered there instantly.
                            </p>
                        </div>
                    </div>

                    {/* Right: contact form */}
                    <ContactForm />
                </div>
            </div>
        </section>
    );
}
