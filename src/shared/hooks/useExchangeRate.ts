import { useExchangeRateContext } from '../context/ExchangeRateContext';

export const useExchangeRate = () => {
    const { rate, loading } = useExchangeRateContext();

    return {
        rate,
        loading,
        isFallback: rate === 500
    };
};