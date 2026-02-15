import { useState, useEffect } from 'react';

const FALLBACK_RATE = 500;

export const useExchangeRate = () => {
    const [rate, setRate] = useState<number>(FALLBACK_RATE);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchRate = async () => {
            try {
                const response = await fetch('https://api.hacienda.go.cr/indicadores/tc/dolar');

                if (!response.ok) throw new Error('Error al conectar con Hacienda');

                const data = await response.json();

                const venta = data.venta.valor;

                setRate(venta);
                setError(false);
            } catch (err) {
                console.warn(`⚠️ Error obteniendo Tipo de Cambio (Usando fallback ${FALLBACK_RATE}):`, err);
                setRate(FALLBACK_RATE);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchRate();
    }, []);

    return { rate, loading, isFallback: error };
};