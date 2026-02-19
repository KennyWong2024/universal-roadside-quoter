import { useBenefitsContext } from '@/shared/context/BenefitsContext';

export const useBenefitsMatrix = () => {
    const { benefits, loading, refreshBenefits } = useBenefitsContext();

    return {
        benefits,
        loading,
        refresh: refreshBenefits
    };
};