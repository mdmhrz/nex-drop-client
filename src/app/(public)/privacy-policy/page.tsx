import { Separator } from "@/components/ui/separator";

const sections = [
    {
        title: "Introduction",
        content: "NexDrop ('we', 'us', 'our', or 'Company') operates the NexDrop platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. Your privacy is critically important to us. We are committed to being transparent about how we collect and use your information."
    },
    {
        title: "Information Collection and Use",
        content: "We collect several different types of information for various purposes to provide and improve our Service to you:\n\n• Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable information ('Personal Data') including but not limited to: Email address, First name and last name, Phone number, Address, State, Province, ZIP/Postal code, City, Cookies and Usage Data\n\n• Usage Data: We may also collect information about how the Service is accessed and used ('Usage Data'), including the computer's Internet Protocol address, browser type, browser version, pages visited, time and date of visits, and other diagnostic data."
    },
    {
        title: "Use of Data",
        content: "NexDrop uses the collected data for various purposes:\n\n• To provide and maintain our Service\n• To notify you about changes to our Service\n• To allow you to participate in interactive features of our Service\n• To provide customer support\n• To gather analysis or valuable information so that we can improve our Service\n• To monitor the usage of our Service\n• To detect, prevent and address technical and security issues"
    },
    {
        title: "Security of Data",
        content: "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We use industry-standard encryption and security protocols to protect your information against unauthorized access, disclosure, and modification."
    },
    {
        title: "Changes to This Privacy Policy",
        content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
    },
    {
        title: "Contact Us",
        content: "If you have any questions about this Privacy Policy, please contact us at:\n\nNexDrop\nEmail: privacy@nexdrop.com.bd\nPhone: +880 1700-000000\nAddress: 12 Gulshan Avenue, Dhaka, Bangladesh"
    }
];

export const metadata = {
    title: "Privacy Policy - NexDrop",
    description: "Learn how NexDrop collects, uses, and protects your personal data."
};

export default function PrivacyPolicyPage() {
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
                        Last updated: May 1, 2026
                    </p>
                </div>

                <Separator />

                {/* Content Sections */}
                <div className="space-y-10 prose dark:prose-invert max-w-none">
                    {sections.map((section, idx) => (
                        <div key={idx} className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                                {section.title}
                            </h2>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                <Separator />

                {/* Footer Note */}
                <div className="border border-dashed bg-primary/5 dark:bg-primary/[0.07] p-6 space-y-2">
                    <h3 className="text-base font-semibold text-foreground">
                        Questions About Privacy?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        If you have any questions or concerns about our privacy practices, please don&apos;t hesitate to contact us. We&apos;re committed to protecting your data and ensuring transparency.
                    </p>
                </div>
            </div>
        </section>
    );
}
