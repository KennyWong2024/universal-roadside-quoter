import { useEffect, useRef } from 'react';
import { useBenefitsContext } from '@/shared/context/BenefitsContext';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';
import type { Benefit } from '@/shared/types/benefits.types';

export type { Benefit };

export const useBenefits = (category: string) => {
    const { benefits: allBenefits, loading } = useBenefitsContext();

    const hasLoggedCache = useRef(false);

    const benefits = allBenefits
        .filter(b => b.service_category === category)
        .sort((a, b) => a.plan_name.localeCompare(b.plan_name));

    useEffect(() => {
        if (!loading && !hasLoggedCache.current) {
            if (allBenefits.length > 0) {
                useDevMonitorStore.getState().trackCache(`useBenefits (${category} - RAM Hit)`);
                hasLoggedCache.current = true;
            }
        }
    }, [loading, allBenefits.length, category]);

    return { benefits, loading };
};