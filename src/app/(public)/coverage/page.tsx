import { SectionWrapper } from "@/components/home/section-wrapper";
import CoverageMap from "@/components/coverage/coverage-map";
import { Card } from "@/components/ui/card";

export default function CoveragePage() {
    return (
        <SectionWrapper>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4 pt-10">
                    <h1 className="section-heading-text text-4xl md:text-5xl font-bold tracking-tight">
                        We are available in 64 districts
                    </h1>
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                    <h2 className="section-heading-text text-2xl md:text-3xl font-bold">
                        We deliver almost all over Bangladesh
                    </h2>
                </div>

                {/* Map Component with integrated search */}
                <Card className="p-0 overflow-hidden">
                    <CoverageMap />
                </Card>
            </div>
        </SectionWrapper>
    );
}