import { Separator } from "@/components/ui/separator";

const sections = [
    {
        title: "1. What Are Cookies?",
        content: "Cookies are small pieces of data stored on your device (computer, tablet, or mobile phone) when you visit a website. They help us remember information about your visit, such as your preferences and login status. Cookies are widely used on the internet and are an important tool for making websites work efficiently and providing users with a better experience."
    },
    {
        title: "2. How We Use Cookies",
        content: "NexDrop uses cookies for several purposes:\n\n• Essential Cookies: Required for the platform to function properly, including authentication and security features\n• Performance Cookies: Help us understand how users interact with our platform, allowing us to improve its functionality\n• Preference Cookies: Remember your choices and settings to provide a personalized experience\n• Tracking Cookies: Used for analytics and marketing purposes to understand traffic patterns and user behavior\n• Third-Party Cookies: From partners and service providers to help deliver content and services"
    },
    {
        title: "3. Types of Cookies We Use",
        content: "Session Cookies: Temporary cookies that expire when you close your browser. Used for authentication and maintaining your session.\n\nPersistent Cookies: Remain on your device for a specified period. Used to remember your preferences and login credentials.\n\nFirst-Party Cookies: Set by NexDrop directly for essential functioning and user experience.\n\nThird-Party Cookies: Set by advertising partners, analytics providers, and other service providers to track usage and deliver targeted content."
    },
    {
        title: "4. Specific Cookies We Use",
        content: "Authentication Cookies: Keep you logged in and maintain session security\n\nAnalytics Cookies: Help us understand how the platform is used (e.g., Google Analytics)\n\nPreference Cookies: Store your language, theme, and display preferences\n\nAdvertising Cookies: Used by our marketing partners to show relevant advertisements\n\nSecurity Cookies: Protect against fraud and malicious attacks"
    },
    {
        title: "5. Third-Party Services",
        content: "Our platform uses third-party services that may also set cookies:\n\n• Google Analytics: Analyzes website traffic and user behavior\n• Payment Processors: Stripe and SSLCommerz use cookies for transaction processing\n• Social Media Platforms: May set cookies for sharing and tracking\n• CDN Providers: Help deliver content efficiently\n\nThese third parties have their own privacy policies governing their use of cookies."
    },
    {
        title: "6. Your Cookie Preferences",
        content: "You have control over cookies on our platform. Most web browsers allow you to:\n\n• View cookies stored on your device\n• Delete cookies individually or in bulk\n• Block cookies from specific websites\n• Disable cookies entirely\n\nPlease note that disabling essential cookies may affect the functionality of our platform. You can adjust your cookie preferences through your browser settings or our cookie consent tool."
    },
    {
        title: "7. Cookie Consent",
        content: "When you first visit NexDrop, we display a cookie consent banner. By accepting, you consent to the use of cookies as described in this policy. You can withdraw consent at any time by:\n\n• Accessing your browser settings\n• Using our cookie management tool\n• Contacting us directly\n\nWithdrawing consent may limit your ability to use certain features of our platform."
    },
    {
        title: "8. California Consumer Privacy Act (CCPA)",
        content: "If you are a California resident, you have specific rights under the CCPA:\n\n• Right to Know: What personal information we collect and how we use it\n• Right to Delete: Request deletion of personal information\n• Right to Opt-Out: Opt-out of the sale or sharing of personal information\n• Right to Non-Discrimination: We don't discriminate against you for exercising your CCPA rights\n\nTo exercise these rights, contact us at privacy@nexdrop.com.bd"
    },
    {
        title: "9. European Users - GDPR",
        content: "If you are in Europe, the General Data Protection Regulation (GDPR) applies. Your rights include:\n\n• Lawful Basis: We base cookie use on your consent or legitimate interests\n• Right of Access: Request what data we hold\n• Right to Erasure: Request deletion of your data\n• Right to Restrict Processing: Limit how we use your data\n• Right to Data Portability: Receive your data in a portable format\n\nContact us at privacy@nexdrop.com.bd to exercise these rights."
    },
    {
        title: "10. Changes to This Policy",
        content: "We may update this Cookie Policy from time to time to reflect changes in our practices, technology, or applicable laws. We will notify you of any material changes by posting an updated version on this page with a new 'last updated' date. Your continued use of the platform after changes become effective constitutes your acceptance of the updated Cookie Policy."
    },
    {
        title: "11. Contact Us",
        content: "If you have questions about our use of cookies or this Cookie Policy, please contact us:\n\nNexDrop\nEmail: privacy@nexdrop.com.bd\nPhone: +880 1700-000000\nAddress: 12 Gulshan Avenue, Dhaka, Bangladesh"
    }
];

export const metadata = {
    title: "Cookie Policy - NexDrop",
    description: "Learn about how NexDrop uses cookies and how to manage your preferences."
};

export default function CookiePolicyPage() {
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="max-w-3xl text-base md:text-lg text-muted-foreground leading-relaxed">
                        Last updated: May 1, 2026
                    </p>
                </div>

                <Separator />

                {/* Content Sections */}
                <div className="space-y-10">
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
                        Manage Your Cookie Preferences
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You can adjust your cookie preferences at any time through your browser settings or by contacting our privacy team. We're committed to transparency and your control over your data.
                    </p>
                </div>
            </div>
        </section>
    );
}
