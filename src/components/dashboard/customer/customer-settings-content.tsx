"use client";

import { useCustomerProfile } from "@/hooks/use-customer-profile";
import { SettingsSkeleton } from "@/components/shared/settings-skeleton";
import { SettingsContent } from "@/components/shared/settings-content";

export function CustomerSettingsContent() {
    const { data, isLoading } = useCustomerProfile();

    if (isLoading || !data) {
        return <SettingsSkeleton userRole="CUSTOMER" />;
    }

    const profile = data?.data;

    return (
        <SettingsContent
            userRole={profile?.role}
        />
    );
}
