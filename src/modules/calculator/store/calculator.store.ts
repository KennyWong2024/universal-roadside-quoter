import { create } from 'zustand';

type CalculatorType = 'towing' | 'heavy' | 'taxi_airport' | 'home';

interface CalculatorState {
    activeTab: CalculatorType;
    setActiveTab: (tab: CalculatorType) => void;

    towingData: {
        ps: number;
        sd: number;
        maneuver: number;
        tolls: boolean;
    };
    setTowingData: (data: Partial<CalculatorState['towingData']>) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
    activeTab: 'towing',
    setActiveTab: (tab) => set({ activeTab: tab }),

    towingData: { ps: 0, sd: 0, maneuver: 0, tolls: false },

    setTowingData: (data) => set((state) => ({
        towingData: { ...state.towingData, ...data }
    })),
}));