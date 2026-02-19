import { useEffect, useRef } from 'react';
import { useCostsContext } from '@/shared/context/CostsContext';
import { useTollsContext } from '@/shared/context/TollsContext';
import { useDevMonitorStore } from '@/modules/devtools/store/useDevMonitorStore';

export const useCostMatrix = () => {
    const { tariffs, fuel, loading: costsLoading } = useCostsContext();
    const { tolls, loading: tollsLoading } = useTollsContext();

    const hasLoggedCache = useRef(false);

    useEffect(() => {
        if (!costsLoading && !tollsLoading && !hasLoggedCache.current) {

            if (tariffs.length > 0 || tolls.length > 0) {
                useDevMonitorStore.getState().trackCache('useCostMatrix (RAM Hit)');
                hasLoggedCache.current = true;
            }
        }
    }, [costsLoading, tollsLoading, tariffs.length, tolls.length]);

    return {
        tariffs,
        tolls,
        fuel,
        loading: costsLoading || tollsLoading
    };
};