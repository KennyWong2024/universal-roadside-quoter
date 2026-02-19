import { useCostsContext } from '@/shared/context/CostsContext';
import { useTollsContext } from '@/shared/context/TollsContext';

export const useCostMatrix = () => {
    const { tariffs, fuel, loading: costsLoading } = useCostsContext();
    const { tolls, loading: tollsLoading } = useTollsContext();

    return {
        tariffs,
        tolls,
        fuel,
        loading: costsLoading || tollsLoading
    };
};