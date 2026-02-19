import { useEffect, useRef } from 'react';
import { useBenefitsContext } from '@/shared/context/BenefitsContext';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';

export const useBenefitsMatrix = () => {
    const { benefits, loading, refreshBenefits } = useBenefitsContext();

    const hasLoggedCache = useRef(false);

    useEffect(() => {
        if (!loading && !hasLoggedCache.current && benefits.length > 0) {
            useDevMonitorStore.getState().trackCache('useBenefitsMatrix (RAM Hit)');
            hasLoggedCache.current = true;
        }
    }, [loading, benefits.length]);

    return {
        benefits,
        loading,
        refresh: refreshBenefits
    };
};