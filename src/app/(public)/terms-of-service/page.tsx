import { Separator } from "@/components/ui/separator";

const sections = [
    {
        title: "1. Agreement to Terms",
        content: "These Terms of Service ('Terms') constitute a legal agreement between you ('User', 'you', or 'your') and NexDrop ('Company', 'we', 'us', or 'our'). By accessing and using the NexDrop platform (the 'Service'), you agree to be bound by these Terms. If you do not agree to abide by the above, please do not use this service."
    },
    {
        title: "2. Use License",
        content: "Permission is granted to temporarily download one copy of the materials (information or software) on NexDrop's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:\n\n• Modify or copy the materials\n• Use the materials for any commercial purpose or for any public display\n• Attempt to decompile or reverse engineer any software contained on NexDrop\n• Remove any copyright or other proprietary notations from the materials\n• Transfer the materials to another person or 'mirror' the materials on any other platform\n• Violate any applicable laws or regulations"
    },
    {
        title: "3. Disclaimer",
        content: "The materials on NexDrop's platform are provided on an 'as is' basis. NexDrop makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties. Further, NexDrop does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its Internet web site or otherwise relating to such materials or on any sites linked to this site."
    },
    {
        title: "4. Limitations of Liability",
        content: "In no event shall NexDrop or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NexDrop's platform, even if NexDrop or a NexDrop authorized representative has been notified orally or in writing of the possibility of such damage."
    },
    {
        title: "5. Accuracy of Materials",
        content: "The materials appearing on NexDrop's platform could include technical, typographical, or photographic errors. NexDrop does not warrant that any of the materials on its platform are accurate, complete, or current. NexDrop may make changes to the materials contained on its platform at any time without notice."
    },
    {
        title: "6. Materials and Content",
        content: "The materials on NexDrop's platform are protected by applicable copyright and trade mark law. Users grant NexDrop a non-exclusive, royalty-free, irrevocable license to use any content uploaded or submitted by the user. Users remain responsible for all content they submit and must ensure they have all necessary rights and permissions."
    },
    {
        title: "7. User Responsibilities",
        content: "Users are responsible for:\n\n• Maintaining the confidentiality of their account credentials\n• All activities that occur under your account\n• Notifying NexDrop of any unauthorized use of your account\n• Using the Service in compliance with all applicable laws and regulations\n• Not engaging in any prohibited activities including fraud, hacking, or misuse of the Service"
    },
    {
        title: "8. Limitation of Time for Bringing Actions",
        content: "Any claim or cause of action arising out of or related to the use of NexDrop's platform must be commenced within one (1) year after the claim or cause of action arises; otherwise, such claim or cause of action is permanently barred."
    },
    {
        title: "9. Modifications to Service",
        content: "NexDrop may revise these terms of service for the platform at any time without notice. By using this platform you are agreeing to be bound by the then current version of these terms of service."
    },
    {
        title: "10. Governing Law",
        content: "These terms and conditions are governed by and construed in accordance with the laws of Bangladesh, and you irrevocably submit to the exclusive jurisdiction of the courts located there."
    }
];

export const metadata = {
    title: "Terms of Service - NexDrop",
    description: "Review NexDrop's terms of service and conditions for using our platform."
};

export default function TermsOfServicePage() {
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-0 py-10 md:py-20">
            <div className="space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        Terms of Service
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
                        Questions About Our Terms?
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        If you have any questions about these Terms of Service, please contact us at support@nexdrop.com.bd or call +880 1700-000000.
                    </p>
                </div>
            </div>
        </section>
    );
}
