"use client";

import dynamic from "next/dynamic";
import { Spinner } from "@/components/ui/spinner";

const CoverageMap = dynamic(() => import("./coverage-map"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[500px] items-center justify-center">
            <Spinner className="h-8 w-8" />
        </div>
    ),
});

export default CoverageMap;
