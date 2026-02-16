import { useState, useEffect, useMemo } from 'react';
import { X, Filter } from 'lucide-react';
import { type TaxiRate } from '../../hooks/useAirportRates';

interface AirportRatesFiltersProps {
    rates: TaxiRate[];
    onFilterChange: (filters: { province: string, canton: string, district: string }) => void;
}

export const AirportRatesFilters = ({ rates, onFilterChange }: AirportRatesFiltersProps) => {
    const [province, setProvince] = useState('');
    const [canton, setCanton] = useState('');
    const [district, setDistrict] = useState('');

    const provinces = useMemo(() => {
        const unique = new Set(rates.map(r => r.location.province));
        return Array.from(unique).sort();
    }, [rates]);

    const cantons = useMemo(() => {
        if (!province) return [];
        const filtered = rates.filter(r => r.location.province === province);
        const unique = new Set(filtered.map(r => r.location.canton));
        return Array.from(unique).sort();
    }, [rates, province]);

    const districts = useMemo(() => {
        if (!canton) return [];
        const filtered = rates.filter(r => r.location.canton === canton);
        const unique = new Set(filtered.map(r => r.location.district));
        return Array.from(unique).sort();
    }, [rates, canton]);

    useEffect(() => {
        onFilterChange({ province, canton, district });
    }, [province, canton, district]);

    const clearFilters = () => {
        setProvince(''); setCanton(''); setDistrict('');
    };

    return (
        <div className="flex flex-col md:flex-row gap-3 items-end md:items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">

                <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 mb-1 block">Provincia</label>
                    <div className="relative">
                        <select
                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm appearance-none"
                            value={province}
                            onChange={(e) => { setProvince(e.target.value); setCanton(''); setDistrict(''); }}
                        >
                            <option value="">Todas</option>
                            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 mb-1 block">Cantón</label>
                    <select
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm disabled:opacity-50 appearance-none"
                        value={canton}
                        onChange={(e) => { setCanton(e.target.value); setDistrict(''); }}
                        disabled={!province || cantons.length === 0}
                    >
                        <option value="">Todos</option>
                        {cantons.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="relative">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1 mb-1 block">Distrito</label>
                    <select
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-sm disabled:opacity-50 appearance-none"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        disabled={!canton || districts.length === 0}
                    >
                        <option value="">Todos</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>

            {(province || canton || district) && (
                <button
                    onClick={clearFilters}
                    className="p-2.5 mb-0.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Limpiar filtros"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
};